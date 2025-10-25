# FormDatacoin Contract - Features & API

## Overview

`FormDatacoin` is a flexible, frontend-friendly smart contract that allows users to create DataCoins with fully customizable parameters. Unlike the original `CreateDatacoin` contract which has hardcoded values, `FormDatacoin` accepts all parameters as inputs.

## Key Features

### 1. **Flexible Parameters**

Accept all configuration from frontend:

- ✅ DataCoin name
- ✅ DataCoin symbol
- ✅ Token URI (metadata)
- ✅ Creator address
- ✅ Creator allocation (basis points)
- ✅ Creator vesting duration
- ✅ Contributors allocation (basis points)
- ✅ Liquidity allocation (basis points)
- ✅ Lock token address
- ✅ Lock amount

### 2. **Two Creation Methods**

#### A) Full Control - `createDataCoinWithParams()`

```solidity
function createDataCoinWithParams(
    string memory name,
    string memory symbol,
    string memory tokenURI,
    address creator,
    uint256 creatorAllocationBps,
    uint256 creatorVestingDuration,
    uint256 contributorsAllocationBps,
    uint256 liquidityAllocationBps,
    address lockToken,
    uint256 lockAmount
) public returns (address coinAddress, address poolAddress)
```

**Example Frontend Call:**

```javascript
const tx = await formDatacoin.createDataCoinWithParams(
  "My Awesome Token", // name
  "MAT", // symbol
  "https://example.com/meta.json", // tokenURI
  userAddress, // creator
  1000, // 10% creator allocation
  365 * 24 * 60 * 60, // 1 year vesting
  6000, // 60% contributors
  3000, // 30% liquidity
  "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", // WETH token
  ethers.parseEther("0.0001") // 0.0001 WETH to lock
);
```

#### B) Quick Setup - `createDataCoinSimple()`

Uses standard allocations (Creator 10%, Contributors 60%, Liquidity 30%)

```solidity
function createDataCoinSimple(
    string memory name,
    string memory symbol,
    string memory tokenURI,
    address creator,
    uint256 creatorVestingDuration,
    address lockToken,
    uint256 lockAmount
) public returns (address coinAddress, address poolAddress)
```

### 3. **Built-in Validations**

- ✓ Name/symbol/URI cannot be empty
- ✓ Creator address must be valid
- ✓ Lock token must be valid
- ✓ Lock amount must be > 0
- ✓ Total allocations cannot exceed 100% (10000 basis points)
- ✓ Vesting duration capped at 4 years max
- ✓ Unique salt generation based on creator, name, symbol, and timestamp

### 4. **Helper Functions**

```solidity
// Get approved lock tokens and their configs
function getApprovedLockTokenAndConfig()
    public view returns (address[] memory, IDataCoinFactory.AssetConfig[] memory)

// Mint new tokens (requires minter role)
function mintDataCoin(address to, uint256 amount) public

// Get the created DataCoin address
function getDataCoinAddress() public view returns (address)

// Get the created pool address
function getPoolAddress() public view returns (address)

// Get minimum lock amount for a token
function getMinLockAmount(address lockToken) public view returns (uint256)

// Get token configuration
function getLockTokenConfig(address lockToken)
    public view returns (IDataCoinFactory.AssetConfig memory)
```

### 5. **Events**

```solidity
// Emitted when DataCoin is created
event DataCoinCreated(
    address indexed creator,
    address indexed coinAddress,
    address indexed poolAddress,
    string name,
    string symbol
);

// Emitted when tokens are minted
event DataCoinMinted(address indexed to, uint256 amount);
```

## Frontend Integration Example

### React Component Example

```javascript
import { ethers } from "ethers";

const FormDatacoinComponent = () => {
  const createDataCoin = async (formData) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Load FormDatacoin contract
    const formDatacoinAddress = "0x..."; // Your FormDatacoin address
    const formDatacoinABI = require("./FormDatacoin.json").abi;
    const formDatacoin = new ethers.Contract(
      formDatacoinAddress,
      formDatacoinABI,
      signer
    );

    // First, approve the lock token
    const lockTokenAddress = formData.lockToken;
    const lockTokenABI = require("./IERC20.json").abi;
    const lockToken = new ethers.Contract(
      lockTokenAddress,
      lockTokenABI,
      signer
    );

    const approveTx = await lockToken.approve(
      formDatacoinAddress,
      formData.lockAmount
    );
    await approveTx.wait();

    // Create the DataCoin
    const tx = await formDatacoin.createDataCoinWithParams(
      formData.name,
      formData.symbol,
      formData.tokenURI,
      formData.creator,
      formData.creatorAllocationBps,
      formData.creatorVestingDuration,
      formData.contributorsAllocationBps,
      formData.liquidityAllocationBps,
      lockTokenAddress,
      formData.lockAmount
    );

    const receipt = await tx.wait();
    console.log("DataCoin created:", receipt);
    return receipt;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        createDataCoin(Object.fromEntries(formData));
      }}
    >
      <input type="text" name="name" placeholder="DataCoin Name" required />
      <input type="text" name="symbol" placeholder="Symbol" required />
      <input type="url" name="tokenURI" placeholder="Token URI" required />
      <input
        type="number"
        name="creatorAllocationBps"
        placeholder="Creator %"
        required
      />
      <input
        type="number"
        name="contributorsAllocationBps"
        placeholder="Contributors %"
        required
      />
      <input
        type="number"
        name="liquidityAllocationBps"
        placeholder="Liquidity %"
        required
      />
      <input
        type="number"
        name="creatorVestingDuration"
        placeholder="Vesting Days"
        required
      />
      <input
        type="number"
        name="lockAmount"
        placeholder="Lock Amount"
        required
      />
      <button type="submit">Create DataCoin</button>
    </form>
  );
};

export default FormDatacoinComponent;
```

## Deployment

### Deploy to Sepolia

```bash
npm run deploy:form:sepolia
```

### Deploy to Localhost

```bash
npm run deploy:form:localhost
```

## Requirements for Deployment

1. **DATACOIN_FACTORY_ADDRESS** - Address of the DataCoinFactory contract
2. **SEPOLIA_PRIVATE_KEY** - Your wallet private key
3. **SEPOLIA_RPC_URL** - Sepolia RPC URL (optional, defaults to Alchemy)

Update these in `.env` file before deployment.

## Gas Considerations

- `createDataCoinWithParams()` - ~500k-700k gas
- `createDataCoinSimple()` - ~500k-700k gas
- `mintDataCoin()` - ~80k-120k gas
- Helper view functions - 0 gas (read-only)

## Differences from CreateDatacoin

| Feature          | CreateDatacoin   | FormDatacoin        |
| ---------------- | ---------------- | ------------------- |
| Parameters       | Hardcoded        | Fully flexible      |
| Frontend control | Limited          | Full control        |
| Allocations      | Fixed (10/60/30) | Customizable        |
| Validation       | Minimal          | Comprehensive       |
| Events           | None             | Yes (detailed logs) |
| Helper functions | Basic            | Extended            |
| Use case         | Templated        | Custom              |

## Security Notes

- ✓ All inputs are validated
- ✓ Uses OpenZeppelin IERC20 for token transfers
- ✓ Allocation percentages verified to not exceed 100%
- ✓ Requires token approval before DataCoin creation
- ✓ Salt generation prevents collisions
- ✓ Creator role verified at contract level

---

**Version:** 1.0.0  
**License:** UNLICENSED  
**Solidity:** ^0.8.23
