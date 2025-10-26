import { ethers } from "ethers";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Contract addresses
const PUBLIC_VAULT_ADDRESS = "0xc526E6dC5ED1BAA9dBd1476E328e987387927e9f";

// Common ERC20 token addresses on Sepolia
const SEPOLIA_TOKENS = {
  "USDC": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Sepolia USDC
  "USDT": "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06", // Sepolia USDT
  "LINK": "0x779877A7B0D9E8603169DdbD7836e478b4624789", // Sepolia LINK
  "DAI": "0x68194a729C2450ad26072b3D33ADaCbcef39D574", // Sepolia DAI
  "WETH": "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", // Sepolia WETH
  "FormDataCoin": "0x0b782612ff5e4E012485F85a80c5427C8A59A899", // Your FormDataCoin
};

async function main() {
  console.log("🔍 Checking PublicDataCoinVault Balance...\n");

  const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/demo";
  
  console.log(`📍 Network RPC: ${rpcUrl}`);
  console.log(`📍 Vault Address: ${PUBLIC_VAULT_ADDRESS}\n`);

  // Create provider
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  // Load the vault contract ABI
  const vaultArtifactPath = join(__dirname, "../artifacts/contracts/PublicDataCoinVault.sol/PublicDataCoinVault.json");
  const vaultArtifact = JSON.parse(readFileSync(vaultArtifactPath, "utf8"));
  
  // Create vault contract instance
  const vault = new ethers.Contract(
    PUBLIC_VAULT_ADDRESS,
    vaultArtifact.abi,
    provider
  );

  // ERC20 ABI for token name and symbol
  const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint256)"
  ];

  console.log("═══════════════════════════════════════════════════════════\n");

  // Check deposited tokens from the vault
  try {
    console.log("📊 Checking tracked deposits in vault...\n");
    const depositedTokens = await vault.getDepositedTokens();
    
    if (depositedTokens.length > 0) {
      console.log(`✓ Found ${depositedTokens.length} token(s) with tracked deposits:\n`);
      
      for (const tokenAddress of depositedTokens) {
        await checkTokenBalance(tokenAddress, vault, provider, ERC20_ABI);
      }
    } else {
      console.log("⚠️  No tokens with tracked deposits yet.\n");
    }
  } catch (error) {
    console.error("❌ Error fetching deposited tokens:", error);
  }

  console.log("═══════════════════════════════════════════════════════════\n");

  // Check common Sepolia tokens
  console.log("🔎 Checking balances for common Sepolia tokens...\n");
  
  for (const [name, address] of Object.entries(SEPOLIA_TOKENS)) {
    await checkTokenBalance(address, vault, provider, ERC20_ABI, name);
  }

  console.log("═══════════════════════════════════════════════════════════\n");
  console.log("✅ Balance check complete!\n");
  
  // Display summary
  console.log("💡 Vault Functions Available:");
  console.log("   - depositTokens(tokenAddress, amount)");
  console.log("   - withdrawTokens(tokenAddress, recipient, amount)");
  console.log("   - getVaultBalance(tokenAddress)");
  console.log("   - emergencyWithdrawAll(tokenAddress, recipient)");
  console.log("   - trackManualDeposit(tokenAddress)\n");
}

async function checkTokenBalance(
  tokenAddress: string, 
  vault: ethers.Contract, 
  provider: ethers.JsonRpcProvider,
  ERC20_ABI: string[],
  tokenName?: string
) {
  try {
    const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    
    // Get token info
    let symbol = tokenName || "UNKNOWN";
    let name = "";
    let decimals = 18;
    
    try {
      if (!tokenName) {
        symbol = await token.symbol();
        name = await token.name();
      } else {
        name = await token.name();
      }
      decimals = await token.decimals();
    } catch (error) {
      // Token might not have these functions, skip
    }

    // Get vault balance
    const balance = await vault.getVaultBalance(tokenAddress);
    const formattedBalance = ethers.formatUnits(balance, decimals);
    
    // Get total deposited (tracked)
    let totalDeposited = BigInt(0);
    try {
      totalDeposited = await vault.getTotalDeposited(tokenAddress);
    } catch (error) {
      // Might not be tracked yet
    }
    const formattedDeposited = ethers.formatUnits(totalDeposited, decimals);

    if (balance > BigInt(0)) {
      console.log(`🟢 ${symbol}${name ? ` (${name})` : ""}`);
      console.log(`   Address: ${tokenAddress}`);
      console.log(`   Balance: ${formattedBalance} ${symbol}`);
      console.log(`   Tracked Deposits: ${formattedDeposited} ${symbol}`);
      console.log(`   Decimals: ${decimals}\n`);
    } else {
      console.log(`⚪ ${symbol}${name ? ` (${name})` : ""}`);
      console.log(`   Address: ${tokenAddress}`);
      console.log(`   Balance: 0 ${symbol}\n`);
    }
  } catch (error) {
    console.log(`❌ Error checking ${tokenName || tokenAddress}:`);
    console.log(`   ${error instanceof Error ? error.message : String(error)}\n`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
