# CreateDatacoinCustom - User Input DataCoin Creation Guide

## 🎯 Overview

This guide shows you how to deploy and use the `CreateDatacoinCustom` contract that allows you to create DataCoins with **custom parameters** instead of hardcoded values. Unlike the original `CreateDatacoin.sol`, this version waits for your input before creating tokens.

## 🚀 Quick Start

### 1. Deploy the Contract

```bash
cd smart-contract

# Compile contracts
npm run compile

# Deploy to Sepolia
npm run deploy:custom:sepolia
```

The deployment will use your provided factory address: `0xC7Bc3432B0CcfeFb4237172340Cd8935f95f2990`

### 2. Set Up Environment

Make sure your `.env` file contains:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_key
SEPOLIA_PRIVATE_KEY=your_private_key
```

### 3. Create Your DataCoin

After deployment, update the contract address in `scripts/exampleCreateDatacoin.ts` and run:

```bash
npm run compile
node scripts/exampleCreateDatacoin.ts
```

## 📋 Contract Features

### Two Creation Methods

#### Method 1: Full Custom Parameters
```solidity
createDataCoinWithParams(
    string memory name,                    // "My Awesome Token"
    string memory symbol,                  // "MAT"
    string memory tokenURI,               // "https://example.com/metadata.json"
    uint256 creatorAllocationBps,         // 1500 = 15%
    uint256 creatorVestingDuration,       // 180 days
    uint256 contributorsAllocationBps,    // 5500 = 55%
    uint256 liquidityAllocationBps,       // 3000 = 30%
    address lockToken,                    // Token address
    uint256 lockAmount                    // Amount to lock
)
```

#### Method 2: Simple with Defaults
```solidity
createDataCoinSimple(
    string memory name,        // "My Token"
    string memory symbol,      // "MTK"
    string memory tokenURI,   // "https://example.com/metadata.json"
    address lockToken         // Uses minimum lock amount and default allocations
)
```

### Helper Functions

```solidity
// Get available lock tokens and their configurations
getApprovedLockTokenAndConfig() returns (address[] memory, AssetConfig[] memory)

// Get minimum lock amount for a specific token
getMinLockAmount(address lockToken) returns (uint256)

// Get last created DataCoin info
getLastCreatedDataCoin() returns (address coinAddress, address poolAddress)
```

## 💡 Usage Example

### JavaScript/TypeScript Integration

```javascript
import { ethers } from "ethers";

// Contract setup
const contract = new ethers.Contract(contractAddress, abi, signer);

// 1. Get available lock tokens
const [tokens, configs] = await contract.getApprovedLockTokenAndConfig();
console.log("Available tokens:", tokens);

// 2. Choose lock token and get minimum amount
const lockToken = "0x2EA104BCdF3A448409F2dc626e606FdCf969a5aE"; // LSDC
const minLockAmount = await contract.getMinLockAmount(lockToken);

// 3. Approve lock tokens
const tokenContract = new ethers.Contract(lockToken, ERC20_ABI, signer);
await tokenContract.approve(contractAddress, minLockAmount);

// 4. Create DataCoin
await contract.createDataCoinWithParams(
    "My Custom Token",     // name
    "MCT",                // symbol
    "https://...",        // tokenURI
    1000,                 // 10% creator allocation
    365 * 24 * 60 * 60,   // 1 year vesting
    6000,                 // 60% contributors
    3000,                 // 30% liquidity
    lockToken,            // lock token address
    minLockAmount         // lock amount
);

// 5. Get created DataCoin
const [coinAddress, poolAddress] = await contract.getLastCreatedDataCoin();
```

## 🔧 Parameter Validation

The contract validates:

- ✅ Name and symbol are not empty
- ✅ Lock token is not zero address
- ✅ Lock amount > 0 and >= minimum required
- ✅ Allocations sum to exactly 100% (10000 basis points)
- ✅ Creator vesting duration is reasonable

## 📊 Allocation Examples

| Scenario | Creator % | Contributors % | Liquidity % | Total |
|----------|-----------|----------------|-------------|-------|
| Standard | 10% | 60% | 30% | 100% |
| Creator-focused | 20% | 50% | 30% | 100% |
| Community-focused | 5% | 70% | 25% | 100% |

**Note**: Percentages are in basis points (1% = 100 bps, 100% = 10000 bps)

## 🎛️ Frontend Integration

### React Example Component

```jsx
import { useState } from 'react';
import { ethers } from 'ethers';

function CreateDataCoinForm() {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    tokenURI: '',
    creatorAllocation: 10, // percentage
    vestingDays: 365,
    contributorsAllocation: 60,
    liquidityAllocation: 30
  });

  const createDataCoin = async () => {
    // Convert percentages to basis points
    const params = {
      ...formData,
      creatorAllocationBps: formData.creatorAllocation * 100,
      contributorsAllocationBps: formData.contributorsAllocation * 100,
      liquidityAllocationBps: formData.liquidityAllocation * 100,
      creatorVestingDuration: formData.vestingDays * 24 * 60 * 60
    };

    // Contract interaction code here...
  };

  return (
    <form onSubmit={createDataCoin}>
      <input 
        placeholder="Token Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      <input 
        placeholder="Symbol"
        value={formData.symbol}
        onChange={(e) => setFormData({...formData, symbol: e.target.value})}
      />
      {/* More form fields... */}
      <button type="submit">Create DataCoin</button>
    </form>
  );
}
```

## 🔒 Security Notes

1. **Always approve tokens before creation**: The contract needs allowance to transfer your lock tokens
2. **Check balances**: Ensure you have sufficient lock tokens
3. **Validate parameters**: Double-check allocation percentages sum to 100%
4. **Use appropriate vesting periods**: Consider reasonable timeframes for token vesting

## 📞 Contract Methods Summary

| Method | Purpose | Gas Cost |
|--------|---------|----------|
| `createDataCoinWithParams()` | Full customization | High |
| `createDataCoinSimple()` | Quick creation | High |
| `getMinLockAmount()` | Check requirements | Low |
| `getApprovedLockTokenAndConfig()` | Get available tokens | Low |
| `mintDataCoin()` | Mint tokens (if authorized) | Medium |

## 🎉 Next Steps

After creating your DataCoin:

1. **Save the addresses**: Note down the DataCoin and pool addresses
2. **Set up minting**: Grant minter role if you want to mint tokens
3. **Add liquidity**: Consider adding initial liquidity to the pool
4. **Share with community**: Distribute your DataCoin address

---

**Factory Address**: `0xC7Bc3432B0CcfeFb4237172340Cd8935f95f2990`  
**Network**: Sepolia Testnet  
**Status**: ✅ Ready for deployment