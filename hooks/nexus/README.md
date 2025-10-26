# PublicDataCoinVault - Bridge & Execute Integration

## Overview

This folder contains the integration code for using Avail Nexus's Bridge & Execute functionality with the PublicDataCoinVault smart contract.

## Files

### 1. `testBridgeAndExecuteVault.ts`

Original test implementation following official Nexus docs. This demonstrates the complete flow with detailed logging.

### 2. `useBridgeAndExecuteVault.ts`

React hook that wraps the bridge and execute functionality for easy use in components.

**Features:**

- Simulate bridge & execute transactions
- Execute bridge & execute transactions
- Loading states and error handling
- TypeScript type safety

**Usage:**

```typescript
import { useBridgeAndExecuteVault } from '@/hooks/nexus/useBridgeAndExecuteVault';

function MyComponent() {
  const {
    isSimulating,
    isExecuting,
    simulationResult,
    executeResult,
    error,
    simulate,
    execute,
    reset,
    vaultAddress,
    tokenAddress,
  } = useBridgeAndExecuteVault();

  const handleSimulate = async () => {
    const result = await simulate('1'); // 1 USDC
  };

  const handleExecute = async () => {
    const result = await execute('1'); // 1 USDC
  };

  return (
    // Your UI here
  );
}
```

## Smart Contract Details

### PublicDataCoinVault

- **Address:** `0xc526E6dC5ED1BAA9dBd1476E328e987387927e9f`
- **Network:** Sepolia Testnet
- **Chain ID:** 11155111

### FormDataCoin (Token in Vault)

- **Address:** `0x0b782612ff5e4E012485F85a80c5427C8A59A899`
- **Network:** Sepolia Testnet
- **Current Balance:** 2.0 tokens

## How It Works

1. **Bridge:** User's USDC is bridged from their current chain to Sepolia testnet using Avail Nexus
2. **Execute:** Once bridged, the vault's `withdrawTokens` function is automatically called
3. **Receive:** FormDataCoin tokens are withdrawn from the vault to the user's address

## Function Called

```solidity
function withdrawTokens(
    address tokenAddress,  // FormDataCoin address
    address recipient,     // User's address
    uint256 amount         // Amount to withdraw
) external nonReentrant
```

## Parameters

- **token:** 'USDC' (bridged token)
- **amount:** Amount in human-readable format (e.g., '1' for 1 USDC)
- **toChainId:** 11155111 (Sepolia)
- **recipient:** User's wallet address
- **contractAddress:** Vault address
- **functionName:** 'withdrawTokens'

## Testing

### Check Vault Balance

```bash
cd smart-contract
npm run check:publicvault
```

### Test Bridge & Execute

1. Navigate to `/vault` page in the app
2. Connect your wallet
3. Enter amount (e.g., 1 USDC)
4. Click "Simulate" to see estimated costs
5. Click "Execute" to perform the bridge & execute

## Components

### VaultWithdrawCard

UI component located at `/components/vault/VaultWithdrawCard.tsx`

Features:

- Amount input
- Simulate button with results
- Execute button with transaction hash
- Error handling
- Reset functionality

### Vault Page

Full page implementation at `/app/vault/page.tsx`

Accessible at: `http://localhost:3000/vault`

## Requirements

1. **Connected Wallet:** User must have a connected wallet with Nexus initialized
2. **USDC Balance:** User needs USDC on their current chain for bridging
3. **Vault Balance:** Vault must have FormDataCoin tokens available
4. **Gas Fees:** User needs ETH on Sepolia for execution gas

## Token Approval

The hook automatically handles token approval if needed. The simulation will indicate if approval is required.

## Error Handling

The hook provides comprehensive error handling:

- SDK not initialized
- Wallet not connected
- Insufficient balance
- Simulation failures
- Execution failures

## Next Steps

1. **Add to Navigation:** Add vault link to your navbar
2. **Customize UI:** Modify `VaultWithdrawCard` to match your design
3. **Add More Tokens:** Extend to support multiple tokens in the vault
4. **Add Deposit Flow:** Create a deposit component for adding tokens to vault

## Resources

- [Avail Nexus Docs](https://docs.availproject.org/docs/nexus/introduction)
- [PublicDataCoinVault Contract](https://sepolia.etherscan.io/address/0xc526E6dC5ED1BAA9dBd1476E328e987387927e9f)
- [FormDataCoin Token](https://sepolia.etherscan.io/address/0x0b782612ff5e4E012485F85a80c5427C8A59A899)
