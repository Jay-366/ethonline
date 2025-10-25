const ethersPkg = require('ethers');
require('dotenv').config();

const artifact = require('../artifacts/contracts/DataCoinVault.sol/DataCoinVault.json');

const RPC = process.env.RPC_URL;
if (!RPC) {
  console.error('Set RPC_URL in .env');
  process.exit(1);
}

const isEthersV6 = !ethersPkg.providers; // v5 has providers, v6 does not

const provider = isEthersV6
  ? new ethersPkg.JsonRpcProvider(RPC)
  : new ethersPkg.providers.JsonRpcProvider(RPC);

const formatUnits = isEthersV6 ? ethersPkg.formatUnits : ethersPkg.utils.formatUnits;

const [,, contractArg, tokenArg] = process.argv;
const contractAddress = contractArg || process.env.CONTRACT_ADDRESS;
const tokenAddress = tokenArg;

if (!contractAddress || !tokenAddress) {
  console.error('Usage: node scripts/getVaultBalance.cjs <CONTRACT_ADDRESS> <TOKEN_ADDRESS>');
  process.exit(1);
}

(async () => {
  try {
    const contract = new ethersPkg.Contract(contractAddress, artifact.abi, provider);
    const balance = await contract.getVaultBalance(tokenAddress);

    const ercAbi = ['function decimals() view returns (uint8)', 'function symbol() view returns (string)'];
    const token = new ethersPkg.Contract(tokenAddress, ercAbi, provider);
    let symbol = tokenAddress;
    let decimals = 18;
    try {
      symbol = await token.symbol();
      decimals = await token.decimals();
    } catch (e) {
      // ignore
    }

    console.log(`Vault balance for ${symbol} (${tokenAddress}):`);
    console.log(String(balance), '(raw)');
    console.log(formatUnits(balance, decimals), `(formatted, decimals=${decimals})`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();