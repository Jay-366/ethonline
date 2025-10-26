import { ethers } from "ethers";

async function main() {
  console.log("🎯 Example: Creating a DataCoin with custom parameters");

  // Your deployed CreateDatacoinCustom contract address (update this after deployment)
  const createDatacoinCustomAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";
  
  const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/demo";
  const privateKey = process.env.SEPOLIA_PRIVATE_KEY;

  if (!privateKey) {
    console.error("❌ Error: SEPOLIA_PRIVATE_KEY not set in .env file");
    process.exit(1);
  }

  // Create provider and signer
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  console.log(`✓ Signer loaded: ${signer.address}`);

  // Load the contract
  const fs = await import("fs");
  const path = await import("path");
  
  const artifactPath = path.resolve("./artifacts/contracts/CreateDatacoinCustom.sol/CreateDatacoinCustom.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const CreateDatacoinCustomABI = artifact.abi;
  const contract = new ethers.Contract(createDatacoinCustomAddress, CreateDatacoinCustomABI, signer);

  console.log(`📍 Contract Address: ${createDatacoinCustomAddress}`);

  try {
    // Step 1: Get available lock tokens
    console.log("\n📋 Step 1: Getting available lock tokens...");
    const [tokens, configs] = await contract.getApprovedLockTokenAndConfig();
    
    if (tokens.length === 0) {
      console.log("❌ No approved lock tokens found");
      return;
    }

    console.log(`✓ Found ${tokens.length} approved lock tokens:`);
    for (let i = 0; i < tokens.length; i++) {
      console.log(`   ${i + 1}. ${tokens[i]}`);
      console.log(`      Min Lock Amount: ${ethers.formatEther(configs[i].minLockAmount)} tokens`);
      console.log(`      Active: ${configs[i].isActive}`);
    }

    // Step 2: Choose a lock token (using the first available one or LSDC)
    const lockToken = "0x2EA104BCdF3A448409F2dc626e606FdCf969a5aE"; // LSDC on sepolia
    const minLockAmount = await contract.getMinLockAmount(lockToken);
    
    console.log(`\n🔒 Step 2: Using lock token: ${lockToken}`);
    console.log(`   Minimum lock amount: ${ethers.formatEther(minLockAmount)} tokens`);

    // Step 3: Prepare DataCoin parameters
    const datacoinParams = {
      name: "My Custom DataCoin",
      symbol: "MCDC",
      tokenURI: "https://my-domain.com/datacoin-metadata.json",
      creatorAllocationBps: 1500,  // 15%
      creatorVestingDuration: 180 * 24 * 60 * 60, // 180 days
      contributorsAllocationBps: 5500, // 55%
      liquidityAllocationBps: 3000,   // 30%
      lockToken: lockToken,
      lockAmount: minLockAmount
    };

    console.log(`\n⚙️ Step 3: DataCoin Parameters:`);
    console.log(`   Name: ${datacoinParams.name}`);
    console.log(`   Symbol: ${datacoinParams.symbol}`);
    console.log(`   Token URI: ${datacoinParams.tokenURI}`);
    console.log(`   Creator Allocation: ${datacoinParams.creatorAllocationBps / 100}%`);
    console.log(`   Vesting Duration: ${datacoinParams.creatorVestingDuration / (24 * 60 * 60)} days`);
    console.log(`   Contributors Allocation: ${datacoinParams.contributorsAllocationBps / 100}%`);
    console.log(`   Liquidity Allocation: ${datacoinParams.liquidityAllocationBps / 100}%`);
    console.log(`   Lock Amount: ${ethers.formatEther(datacoinParams.lockAmount)} tokens`);

    // Step 4: Check and approve lock tokens
    console.log(`\n💰 Step 4: Checking lock token approval...`);
    const lockTokenContract = new ethers.Contract(
      lockToken,
      ["function balanceOf(address) view returns (uint256)", "function approve(address,uint256) returns (bool)", "function allowance(address,address) view returns (uint256)"],
      signer
    );

    const balance = await lockTokenContract.balanceOf(signer.address);
    console.log(`   Your balance: ${ethers.formatEther(balance)} tokens`);

    if (balance < minLockAmount) {
      console.log("❌ Insufficient balance to create DataCoin");
      return;
    }

    const allowance = await lockTokenContract.allowance(signer.address, createDatacoinCustomAddress);
    console.log(`   Current allowance: ${ethers.formatEther(allowance)} tokens`);

    if (allowance < minLockAmount) {
      console.log(`   📝 Approving ${ethers.formatEther(minLockAmount)} tokens...`);
      const approveTx = await lockTokenContract.approve(createDatacoinCustomAddress, minLockAmount);
      await approveTx.wait();
      console.log(`   ✅ Approval confirmed: ${approveTx.hash}`);
    }

    // Step 5: Create the DataCoin
    console.log(`\n🚀 Step 5: Creating DataCoin...`);
    console.log("⏳ This may take a few minutes...");

    const createTx = await contract.createDataCoinWithParams(
      datacoinParams.name,
      datacoinParams.symbol,
      datacoinParams.tokenURI,
      datacoinParams.creatorAllocationBps,
      datacoinParams.creatorVestingDuration,
      datacoinParams.contributorsAllocationBps,
      datacoinParams.liquidityAllocationBps,
      datacoinParams.lockToken,
      datacoinParams.lockAmount
    );

    console.log(`   Transaction hash: ${createTx.hash}`);
    const receipt = await createTx.wait();
    console.log(`   ✅ DataCoin created successfully!`);

    // Step 6: Get the created DataCoin details
    const [coinAddress, poolAddress] = await contract.getLastCreatedDataCoin();
    console.log(`\n🎉 Success! Your DataCoin has been created:`);
    console.log(`   DataCoin Address: ${coinAddress}`);
    console.log(`   Pool Address: ${poolAddress}`);
    console.log(`   Transaction: ${createTx.hash}`);
    console.log(`   Block: ${receipt?.blockNumber}`);

  } catch (error) {
    console.error("❌ Error creating DataCoin:", error);
    
    if (error.message.includes("insufficient allowance")) {
      console.log("💡 Tip: Make sure to approve the lock tokens first");
    } else if (error.message.includes("insufficient balance")) {
      console.log("💡 Tip: You need more lock tokens in your wallet");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });