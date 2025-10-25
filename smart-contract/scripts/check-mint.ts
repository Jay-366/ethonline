import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const TOKEN_ADDRESS = "0x0b782612ff5e4e012485f85a80c5427c8a59a899"; // Your DataCoin token

const TOKEN_ABI = [
  "function mint(address to, uint256 amount) external",
  "function hasRole(bytes32 role, address account) external view returns (bool)",
  "function MINTER_ROLE() external view returns (bytes32)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)",
  "function name() external view returns (string)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

async function checkMintCapability() {
  try {
    console.log("🔍 Checking mint capability...\n");

    // Setup provider and signer
    const rpcUrl = process.env.SEPOLIA_RPC_URL;
    const privateKey = process.env.SEPOLIA_PRIVATE_KEY;

    if (!rpcUrl || !privateKey) {
      throw new Error(
        "❌ Missing SEPOLIA_RPC_URL or SEPOLIA_PRIVATE_KEY in .env"
      );
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(privateKey, provider);
    const signerAddress = await signer.getAddress();

    console.log(`📝 Signer Address: ${signerAddress}\n`);

    // Connect to token contract
    const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);

    // Get token info
    console.log("📊 Token Information:");
    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    console.log(`  Name: ${name}`);
    console.log(`  Symbol: ${symbol}`);
    console.log(`  Decimals: ${decimals}\n`);

    // Check current balance
    console.log("💰 Current Balance:");
    const balance = await token.balanceOf(signerAddress);
    const balanceFormatted = ethers.formatUnits(balance, decimals);
    console.log(`  Balance: ${balanceFormatted} ${symbol}\n`);

    // Check MINTER_ROLE
    console.log("🔐 Checking Minter Role:");
    const MINTER_ROLE = await token.MINTER_ROLE();
    console.log(`  MINTER_ROLE: ${MINTER_ROLE}`);

    const hasRole = await token.hasRole(MINTER_ROLE, signerAddress);
    console.log(`  You have minter role: ${hasRole ? "✅ YES" : "❌ NO"}\n`);

    if (!hasRole) {
      console.log("❌ You don't have minter role!");
      console.log("   Cannot mint tokens with this account.");
      return;
    }

    // Try to mint a small amount
    console.log("🚀 Attempting to mint 1 token...");
    const amountToMint = ethers.parseUnits("1", decimals);

    const tx = await token.mint(signerAddress, amountToMint);
    console.log(`  Transaction hash: ${tx.hash}`);
    console.log("⏳ Waiting for confirmation...");

    const receipt = await tx.wait();

    if (receipt && receipt.status === 1) {
      console.log(`✅ Mint successful!\n`);

      // Check new balance
      const newBalance = await token.balanceOf(signerAddress);
      const newBalanceFormatted = ethers.formatUnits(newBalance, decimals);
      console.log(`📊 New Balance: ${newBalanceFormatted} ${symbol}`);
    } else {
      console.log("❌ Mint transaction failed!");
    }
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : error);
    if (error instanceof Error && error.message.includes("MINTER_ROLE")) {
      console.log("\n💡 You might not have the MINTER_ROLE. Check:");
      console.log("   1. Did you create this DataCoin?");
      console.log("   2. Does the creator have minter role assigned to your wallet?");
      console.log("   3. Is there a factory contract that manages roles?");
    }
  }
}

// Run the check
checkMintCapability();
