import { useState, useCallback } from 'react';
import { useNexus } from '@/components/nexus/NexusProvider';
import { useAccount } from 'wagmi';
import { parseUnits, getAddress } from 'viem';

/**
 * Hook to interact with PublicDataCoinVault using Nexus Unified Balance (Intent-based)
 * This uses the chain abstraction approach with intents and solvers
 */
export function useUnifiedBalanceVault() {
  const { nexusSDK } = useNexus();
  const { address, chain } = useAccount();
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [intent, setIntent] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Contract addresses
  const VAULT_ADDRESS = getAddress('0xc526E6dC5Ed1BAA9dBd1476E328e987387927e9f') as `0x${string}`;
  const TOKEN_ADDRESS = getAddress('0x0b782612ff5e4E012485F85a80c5427C8A59A899') as `0x${string}`; // FormDataCoin
  const TREASURY_ADDRESS = getAddress('0x3324533837E165829b8E581B4F471125C9D8C66A') as `0x${string}`; // Treasury for USDC
  const SEPOLIA_CHAIN_ID = 11155111; // Destination chain - where vault is deployed

  const PublicDataCoinVaultABI = [
    {
      inputs: [
        { internalType: 'address', name: 'tokenAddress', type: 'address' },
        { internalType: 'address', name: 'recipient', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'withdrawTokens',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ] as const;

  /**
   * Execute transaction using unified balance (intent-based approach)
   * This will:
   * 1. Collect funds from available chains based on allowances
   * 2. Create an intent
   * 3. Publish intent to solvers
   * 4. Execute on destination chain once solver provides liquidity
   */
  const executeWithIntent = useCallback(async (amount: string) => {
    if (!nexusSDK || !address) {
      setError('SDK not initialized or wallet not connected');
      return null;
    }

    setIsExecuting(true);
    setError(null);

    try {
      console.log('=== UNIFIED BALANCE WITH INTENT START ===');
      console.log('User Address:', address);
      console.log('Amount:', amount, 'USDC');
      console.log('Destination Chain (Sepolia):', SEPOLIA_CHAIN_ID);
      console.log('Vault Address:', VAULT_ADDRESS);
      
      // Step 1: Get unified balance to see available funds across chains
      const unifiedBalance = await nexusSDK.getUnifiedBalance();
      console.log('Unified Balance:', unifiedBalance);
      
      // Step 2: Create intent for the transaction
      // The intent specifies what you want to do, and the system figures out
      // how to collect funds from available chains
      const intentParams = {
        destinationChainId: SEPOLIA_CHAIN_ID,
        token: 'USDC',
        amount: amount,
        recipient: TREASURY_ADDRESS,
        execute: {
          contractAddress: VAULT_ADDRESS,
          contractAbi: PublicDataCoinVaultABI,
          functionName: 'withdrawTokens',
          functionParams: [
            TOKEN_ADDRESS,
            address, // User receives FormDataCoin
            parseUnits(amount, 18), // Convert to 18 decimals for FormDataCoin
          ],
        },
      };

      console.log('Creating intent with params:', intentParams);
      
      // Step 3: Execute transaction with unified balance
      // This will:
      // - Analyze your allowances across chains
      // - Collect USDC from multiple chains if needed
      // - Publish intent to solvers
      // - Wait for solver to provide liquidity
      // - Execute vault contract on Sepolia
      const result = await nexusSDK.executeWithUnifiedBalance(intentParams);
      
      console.log('=== INTENT EXECUTION RESULT ===');
      console.log('Intent ID:', result.intentId); // THIS IS THE INTENT!
      console.log('Intent Status:', result.status);
      console.log('Source Chains Used:', result.sourceChains);
      console.log('Solver Used:', result.solver);
      console.log('Transaction Hash:', result.transactionHash);
      console.log(JSON.stringify(result, null, 2));
      
      // Store the intent information
      setIntent({
        id: result.intentId,
        status: result.status,
        sourceChains: result.sourceChains,
        destinationChain: SEPOLIA_CHAIN_ID,
        amount: amount,
        token: 'USDC',
        solver: result.solver,
        transactionHash: result.transactionHash,
        timestamp: new Date().toISOString(),
      });
      
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Execution failed';
      console.error('❌ INTENT EXECUTION ERROR:', err);
      setError(errorMsg);
      return null;
    } finally {
      console.log('=== UNIFIED BALANCE WITH INTENT END ===');
      setIsExecuting(false);
    }
  }, [nexusSDK, address, VAULT_ADDRESS, TOKEN_ADDRESS, SEPOLIA_CHAIN_ID, TREASURY_ADDRESS]);

  /**
   * Get current intent status
   */
  const getIntentStatus = useCallback(async (intentId: string) => {
    if (!nexusSDK) {
      setError('SDK not initialized');
      return null;
    }

    try {
      const status = await nexusSDK.getIntentStatus(intentId);
      console.log('Intent Status:', status);
      return status;
    } catch (err) {
      console.error('Failed to get intent status:', err);
      return null;
    }
  }, [nexusSDK]);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setIntent(null);
    setError(null);
  }, []);

  return {
    // State
    isExecuting,
    intent, // THIS CONTAINS THE INTENT INFORMATION!
    error,
    
    // Actions
    executeWithIntent,
    getIntentStatus,
    reset,
    
    // Config
    vaultAddress: VAULT_ADDRESS,
    tokenAddress: TOKEN_ADDRESS,
    chainId: SEPOLIA_CHAIN_ID,
  };
}
