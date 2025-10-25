import { ethers } from "ethers";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  console.log("🚀 Starting DataCoinVault deployment...");

  const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/demo";
  const privateKey = process.env.SEPOLIA_PRIVATE_KEY;

  if (!privateKey) {
    console.error("❌ Error: SEPOLIA_PRIVATE_KEY not set in .env file");
    console.log("Please add your private key to the .env file:");
    console.log("SEPOLIA_PRIVATE_KEY=your_private_key_here");
    process.exit(1);
  }

  console.log(`📍 Network RPC: ${rpcUrl}`);

  // Create provider and signer
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  console.log(`✓ Signer loaded: ${signer.address}`);

  // Check signer balance
  const balance = await provider.getBalance(signer.address);
  console.log(`💰 Signer balance: ${ethers.formatEther(balance)} ETH`);

  if (balance === 0n) {
    console.error("❌ Error: Insufficient ETH balance for deployment");
    console.log("Please fund your wallet with Sepolia ETH from a faucet");
    process.exit(1);
  }

  // Load the contract factory from artifacts using ES modules
  const artifactPath = join(__dirname, "../artifacts/contracts/DataCoinVault.sol/DataCoinVault.json");
  const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
  const DataCoinVaultABI = artifact.abi;
  const DataCoinVaultBytecode = artifact.bytecode;

  // Create contract factory
  const DataCoinVaultFactory = new ethers.ContractFactory(
    DataCoinVaultABI,
    DataCoinVaultBytecode,
    signer
  );

  // Estimate gas for deployment
  console.log("⛽ Estimating deployment gas...");
  const deploymentData = DataCoinVaultFactory.interface.encodeDeploy([]);
  const gasEstimate = await provider.estimateGas({
    data: deploymentData,
  });
  console.log(`📊 Estimated gas: ${gasEstimate.toString()}`);

  // Get current gas price
  const gasPrice = await provider.getFeeData();
  console.log(`💨 Gas price: ${ethers.formatUnits(gasPrice.gasPrice || 0n, "gwei")} gwei`);

  // Deploy the contract
  console.log("🏗️  Deploying DataCoinVault...");
  const dataCoinVault = await DataCoinVaultFactory.deploy();

  console.log(`📝 Transaction hash: ${dataCoinVault.deploymentTransaction()?.hash}`);
  console.log("⏳ Waiting for deployment confirmation...");

  // Wait for deployment
  await dataCoinVault.waitForDeployment();
  const deployedAddress = await dataCoinVault.getAddress();

  console.log("✅ DataCoinVault deployed successfully!");
  console.log(`📍 Contract Address: ${deployedAddress}`);

  // Verify deployment by calling a view function
  console.log("🔍 Verifying deployment...");
  try {
    const owner = await dataCoinVault.owner();
    console.log(`✓ Contract owner: ${owner}`);
    console.log(`✓ Deployment verified successfully!`);
  } catch (error) {
    console.error("❌ Deployment verification failed:", error);
  }

  // Display summary
  console.log(`
📋 Deployment Summary:
   Network: Sepolia Testnet
   Contract: DataCoinVault
   Address: ${deployedAddress}
   Owner: ${signer.address}
   Transaction: ${dataCoinVault.deploymentTransaction()?.hash}
   
🎉 DataCoinVault is now ready to use!

📖 Next Steps:
   1. Save the contract address: ${deployedAddress}
   2. Update your frontend with this address
   3. Grant necessary permissions if needed
   4. Start managing your ERC20 tokens securely!

💡 Example Usage:
   - View vault balance: getVaultBalance(tokenAddress)
   - Withdraw tokens: withdrawTokens(tokenAddress, recipient, amount)
   - Emergency withdrawal: emergencyWithdrawAll(tokenAddress, recipient)
  `);

  return {
    dataCoinVaultAddress: deployedAddress,
    deploymentTransaction: dataCoinVault.deploymentTransaction()?.hash,
    owner: signer.address,
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });