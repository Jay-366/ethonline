import { ethers } from "ethers";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  console.log("🚀 Starting PublicDataCoinVault deployment...");

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
  const artifactPath = join(__dirname, "../artifacts/contracts/PublicDataCoinVault.sol/PublicDataCoinVault.json");
  const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
  const PublicDataCoinVaultABI = artifact.abi;
  const PublicDataCoinVaultBytecode = artifact.bytecode;

  // Create contract factory
  const PublicDataCoinVaultFactory = new ethers.ContractFactory(
    PublicDataCoinVaultABI,
    PublicDataCoinVaultBytecode,
    signer
  );

  // Estimate gas for deployment
  console.log("⛽ Estimating deployment gas...");
  const deploymentData = PublicDataCoinVaultFactory.interface.encodeDeploy([]);
  const gasEstimate = await provider.estimateGas({
    data: deploymentData,
  });
  console.log(`📊 Estimated gas: ${gasEstimate.toString()}`);

  // Get current gas price
  const gasPrice = await provider.getFeeData();
  console.log(`💨 Gas price: ${ethers.formatUnits(gasPrice.gasPrice || 0n, "gwei")} gwei`);

  // Deploy the contract
  console.log("🏗️  Deploying PublicDataCoinVault...");
  const publicDataCoinVault = await PublicDataCoinVaultFactory.deploy();

  console.log(`📝 Transaction hash: ${publicDataCoinVault.deploymentTransaction()?.hash}`);
  console.log("⏳ Waiting for deployment confirmation...");

  // Wait for deployment
  await publicDataCoinVault.waitForDeployment();
  const deployedAddress = await publicDataCoinVault.getAddress();

  console.log("✅ PublicDataCoinVault deployed successfully!");
  console.log(`📍 Contract Address: ${deployedAddress}`);

  // Verify deployment by calling a view function
  console.log("🔍 Verifying deployment...");
  try {
    const depositedTokens = await publicDataCoinVault.getDepositedTokens();
    console.log(`✓ Deposited tokens array initialized: ${depositedTokens.length} tokens`);
    console.log(`✓ Deployment verified successfully!`);
  } catch (error) {
    console.error("❌ Deployment verification failed:", error);
  }

  // Display summary
  console.log(`
📋 Deployment Summary:
   Network: Sepolia Testnet
   Contract: PublicDataCoinVault
   Address: ${deployedAddress}
   Deployer: ${signer.address}
   Transaction: ${publicDataCoinVault.deploymentTransaction()?.hash}
   
🎉 PublicDataCoinVault is now ready to use!

⚠️  IMPORTANT: This is a PUBLIC vault - anyone can deposit and withdraw tokens!

📖 Next Steps:
   1. Save the contract address: ${deployedAddress}
   2. Update your frontend with this address
   3. Share the address with users who need access
   4. Monitor deposits and withdrawals via events

💡 Example Usage:
   - Deposit tokens: depositTokens(tokenAddress, amount)
   - View vault balance: getVaultBalance(tokenAddress)
   - Withdraw tokens: withdrawTokens(tokenAddress, recipient, amount)
   - Emergency withdrawal: emergencyWithdrawAll(tokenAddress, recipient)
   - Track deposits: trackManualDeposit(tokenAddress)
  `);

  return {
    publicDataCoinVaultAddress: deployedAddress,
    deploymentTransaction: publicDataCoinVault.deploymentTransaction()?.hash,
    deployer: signer.address,
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
