const ethersPkg = require('ethers');
require('dotenv').config();

const artifact = require('../artifacts/contracts/DataCoinVault.sol/DataCoinVault.json');

const RPC = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Add your private key to .env (NEVER commit this!)

if (!RPC) {
  console.error('Set RPC_URL in .env');
  process.exit(1);
}
if (!PRIVATE_KEY) {
  console.error('Set PRIVATE_KEY in .env (owner of the vault)');
  process.exit(1);
}

const isEthersV6 = !ethersPkg.providers;

const provider = isEthersV6
  ? new ethersPkg.JsonRpcProvider(RPC)
  : new ethersPkg.providers.JsonRpcProvider(RPC);

const signer = isEthersV6
  ? new ethersPkg.Wallet(PRIVATE_KEY, provider)
  : new ethersPkg.Wallet(PRIVATE_KEY).connect(provider);

const [,, contractArg, tokenArg, recipientArg, amountArg] = process.argv;
const contractAddress = contractArg || process.env.CONTRACT_ADDRESS;
const tokenAddress = tokenArg;
const recipient = recipientArg;
const amount = amountArg;

if (!contractAddress || !tokenAddress || !recipient || !amount) {
  console.error('Usage: node scripts/withdrawTokens.cjs <CONTRACT_ADDRESS> <TOKEN_ADDRESS> <RECIPIENT> <AMOUNT>');
  console.error('Example: node scripts/withdrawTokens.cjs 0xVaultAddr 0xTokenAddr 0xRecipientAddr 1000000000000000000');
  process.exit(1);
}

(async () => {
  try {
    const contract = new ethersPkg.Contract(contractAddress, artifact.abi, signer);
    
    console.log('Withdrawing tokens...');
    const tx = await contract.withdrawTokens(tokenAddress, recipient, amount);
    console.log('Transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Transaction confirmed in block:', receipt.blockNumber);
    console.log('Gas used:', receipt.gasUsed.toString());
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();