import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";
import { parseEther, zeroAddress } from "viem";

describe("DataCoinVault", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [owner, user1, user2] = await viem.getWalletClients();

  it("Should deploy correctly and set the owner", async function () {
    const dataCoinVault = await viem.deployContract("DataCoinVault");
    const vaultOwner = await dataCoinVault.read.owner();
    assert.equal(vaultOwner.toLowerCase(), owner.account.address.toLowerCase());
  });

  it("Should return zero balance for tokens initially", async function () {
    const dataCoinVault = await viem.deployContract("DataCoinVault");
    const mockToken = await viem.deployContract("MockERC20", ["MockToken", "MTK", parseEther("1000000")]);
    
    const balance = await dataCoinVault.read.getVaultBalance([mockToken.address]);
    assert.equal(balance, 0n);
  });

  it("Should allow owner to withdraw tokens", async function () {
    const dataCoinVault = await viem.deployContract("DataCoinVault");
    const mockToken = await viem.deployContract("MockERC20", ["MockToken", "MTK", parseEther("1000000")]);
    
    // Transfer tokens to vault
    const depositAmount = parseEther("100");
    await mockToken.write.transfer([dataCoinVault.address, depositAmount]);
    
    // Check vault balance
    const vaultBalance = await dataCoinVault.read.getVaultBalance([mockToken.address]);
    assert.equal(vaultBalance, depositAmount);
    
    // Withdraw tokens
    const withdrawAmount = parseEther("50");
    const initialUser2Balance = await mockToken.read.balanceOf([user2.account.address]);
    
    await dataCoinVault.write.withdrawTokens([mockToken.address, user2.account.address, withdrawAmount]);
    
    // Check final balances
    const finalVaultBalance = await dataCoinVault.read.getVaultBalance([mockToken.address]);
    const finalUser2Balance = await mockToken.read.balanceOf([user2.account.address]);
    
    assert.equal(finalVaultBalance, depositAmount - withdrawAmount);
    assert.equal(finalUser2Balance, initialUser2Balance + withdrawAmount);
  });

  it("Should reject withdrawal by non-owner", async function () {
    const dataCoinVault = await viem.deployContract("DataCoinVault");
    const mockToken = await viem.deployContract("MockERC20", ["MockToken", "MTK", parseEther("1000000")]);
    
    // Transfer tokens to vault
    await mockToken.write.transfer([dataCoinVault.address, parseEther("100")]);
    
    // Try to withdraw as non-owner (should fail)
    try {
      await dataCoinVault.write.withdrawTokens(
        [mockToken.address, user2.account.address, parseEther("50")],
        { account: user1.account }
      );
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.ok(error.message.includes("OwnableUnauthorizedAccount"));
    }
  });

  it("Should reject withdrawal with zero token address", async function () {
    const dataCoinVault = await viem.deployContract("DataCoinVault");
    
    try {
      await dataCoinVault.write.withdrawTokens([zeroAddress, user2.account.address, parseEther("50")]);
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.ok(error.message.includes("Token address cannot be zero"));
    }
  });

  it("Should reject withdrawal with zero amount", async function () {
    const dataCoinVault = await viem.deployContract("DataCoinVault");
    const mockToken = await viem.deployContract("MockERC20", ["MockToken", "MTK", parseEther("1000000")]);
    
    try {
      await dataCoinVault.write.withdrawTokens([mockToken.address, user2.account.address, 0n]);
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.ok(error.message.includes("Amount must be greater than zero"));
    }
  });

  it("Should allow emergency withdrawal of all tokens", async function () {
    const dataCoinVault = await viem.deployContract("DataCoinVault");
    const mockToken = await viem.deployContract("MockERC20", ["MockToken", "MTK", parseEther("1000000")]);
    
    // Transfer tokens to vault
    const depositAmount = parseEther("100");
    await mockToken.write.transfer([dataCoinVault.address, depositAmount]);
    
    const initialUser2Balance = await mockToken.read.balanceOf([user2.account.address]);
    
    // Emergency withdraw all
    await dataCoinVault.write.emergencyWithdrawAll([mockToken.address, user2.account.address]);
    
    // Check final balances
    const finalVaultBalance = await dataCoinVault.read.getVaultBalance([mockToken.address]);
    const finalUser2Balance = await mockToken.read.balanceOf([user2.account.address]);
    
    assert.equal(finalVaultBalance, 0n);
    assert.equal(finalUser2Balance, initialUser2Balance + depositAmount);
  });

  it("Should return correct balances for multiple tokens", async function () {
    const dataCoinVault = await viem.deployContract("DataCoinVault");
    const mockToken1 = await viem.deployContract("MockERC20", ["MockToken1", "MTK1", parseEther("1000000")]);
    const mockToken2 = await viem.deployContract("MockERC20", ["MockToken2", "MTK2", parseEther("1000000")]);
    
    // Transfer different amounts to vault
    await mockToken1.write.transfer([dataCoinVault.address, parseEther("100")]);
    await mockToken2.write.transfer([dataCoinVault.address, parseEther("200")]);
    
    // Check multiple balances
    const balances = await dataCoinVault.read.getMultipleVaultBalances([
      [mockToken1.address, mockToken2.address]
    ]);
    
    assert.equal(balances[0], parseEther("100"));
    assert.equal(balances[1], parseEther("200"));
  });

  it("Should support valid token addresses", async function () {
    const dataCoinVault = await viem.deployContract("DataCoinVault");
    const mockToken = await viem.deployContract("MockERC20", ["MockToken", "MTK", parseEther("1000000")]);
    
    const supportsToken = await dataCoinVault.read.supportsToken([mockToken.address]);
    const supportsZero = await dataCoinVault.read.supportsToken([zeroAddress]);
    
    assert.equal(supportsToken, true);
    assert.equal(supportsZero, false);
  });
});