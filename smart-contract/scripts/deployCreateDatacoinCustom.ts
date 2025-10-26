import { ethers } from "ethers";

async function main() {
  console.log("Starting CreateDatacoinCustom deployment...");

  // Your provided DataCoin Factory address
  const dataCoinFactoryAddress = "0xC7Bc3432B0CcfeFb4237172340Cd8935f95f2990";

  const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/demo";
  const privateKey = process.env.SEPOLIA_PRIVATE_KEY;

  if (!privateKey) {
    console.error("❌ Error: SEPOLIA_PRIVATE_KEY not set in .env file");
    process.exit(1);
  }

  console.log(`📍 DataCoin Factory Address: ${dataCoinFactoryAddress}`);

  // Create provider and signer
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  console.log(`✓ Signer loaded: ${signer.address}`);

  // Load the contract factory from artifacts
  const fs = await import("fs");
  const path = await import("path");
  
  const artifactPath = path.resolve("./artifacts/contracts/CreateDatacoinCustom.sol/CreateDatacoinCustom.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const CreateDatacoinCustomABI = artifact.abi;
  const CreateDatacoinCustomBytecode = artifact.bytecode;

  // Create contract factory
  const CreateDatacoinCustomFactory = new ethers.ContractFactory(
    CreateDatacoinCustomABI,
    CreateDatacoinCustomBytecode,
    signer
  );

  // Deploy the contract
  console.log("🚀 Deploying CreateDatacoinCustom...");
  const createDatacoinCustom = await CreateDatacoinCustomFactory.deploy(dataCoinFactoryAddress);

  // Wait for deployment
  await createDatacoinCustom.waitForDeployment();
  const deployedAddress = await createDatacoinCustom.getAddress();

  console.log("✅ CreateDatacoinCustom deployed successfully!");
  console.log(`📝 Contract Address: ${deployedAddress}`);

  // Test the connection to factory
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const approvedTokens = await (createDatacoinCustom as any).getApprovedLockTokenAndConfig();
    console.log(`✓ Successfully connected to factory. Found ${approvedTokens[0].length} approved tokens.`);
    
    // Show available lock tokens
    console.log("\n📋 Available Lock Tokens:");
    for (let i = 0; i < approvedTokens[0].length; i++) {
      const tokenAddress = approvedTokens[0][i];
      const config = approvedTokens[1][i];
      console.log(`   ${i + 1}. ${tokenAddress}`);
      console.log(`      Min Lock Amount: ${ethers.formatEther(config.minLockAmount)} tokens`);
      console.log(`      Active: ${config.isActive}`);
    }
  } catch (error) {
    console.warn("⚠️ Could not fetch approved tokens (factory might not be accessible)");
  }

  console.log(`\n📋 Deployment Details:`);
  console.log(`   Network: Sepolia`);
  console.log(`   DataCoin Factory: ${dataCoinFactoryAddress}`);
  console.log(`   CreateDatacoinCustom Address: ${deployedAddress}`);
  console.log(`   Deployer: ${signer.address}`);

  console.log(`\n🎉 Ready to use! You can now create DataCoins with custom parameters.`);
  
  return {
    createDatacoinCustomAddress: deployedAddress,
    dataCoinFactoryAddress: dataCoinFactoryAddress,
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });