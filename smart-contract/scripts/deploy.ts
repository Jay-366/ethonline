import { ethers } from "ethers";

async function main() {
  console.log("Starting CreateDatacoin deployment...");

  // Get the DataCoin Factory address from environment
  const dataCoinFactoryAddress = process.env.DATACOIN_FACTORY_ADDRESS;

  if (!dataCoinFactoryAddress || dataCoinFactoryAddress === "0x0000000000000000000000000000000000000000") {
    console.error("❌ Error: DATACOIN_FACTORY_ADDRESS not set in .env file");
    console.log("Please update .env with the actual factory contract address");
    process.exit(1);
  }

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
  const CreateDatacoinABI = require("../artifacts/contracts/CreateDatacoin.sol/CreateDatacoin.json").abi;
  const CreateDatacoinBytecode = require("../artifacts/contracts/CreateDatacoin.sol/CreateDatacoin.json").bytecode;

  // Create contract factory
  const CreateDatacoinFactory = new ethers.ContractFactory(
    CreateDatacoinABI,
    CreateDatacoinBytecode,
    signer
  );

  // Deploy the contract
  console.log("🚀 Deploying CreateDatacoin...");
  const createDatacoin = await CreateDatacoinFactory.deploy(dataCoinFactoryAddress);

  // Wait for deployment
  await createDatacoin.waitForDeployment();
  const deployedAddress = await createDatacoin.getAddress();

  console.log("✅ CreateDatacoin deployed successfully!");
  console.log(`📝 Contract Address: ${deployedAddress}`);

  // Verify the constructor parameter
  console.log(`\n📋 Deployment Details:`);
  console.log(`   Network RPC: ${rpcUrl}`);
  console.log(`   DataCoin Factory: ${dataCoinFactoryAddress}`);
  console.log(`   CreateDatacoin Address: ${deployedAddress}`);

  return {
    createDatacoinAddress: deployedAddress,
    dataCoinFactoryAddress: dataCoinFactoryAddress,
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
