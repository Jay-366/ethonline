import { useState, useCallback } from 'react';
import { useNexus } from '@/components/nexus/NexusProvider';
import { useAccount } from 'wagmi';
import type {
  BridgeAndExecuteResult,
  BridgeAndExecuteSimulationResult,
} from '@avail-project/nexus-core';
import { parseUnits, getAddress } from 'viem';

/**
 * Hook to interact with PublicDataCoinVault using Nexus Bridge & Execute
 * Allows users to bridge tokens and automatically withdraw from the vault
 */
export function useBridgeAndExecuteVault() {
  const { nexusSDK } = useNexus();
  const { address, chain } = useAccount();
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [simulationResult, setSimulationResult] = useState<BridgeAndExecuteSimulationResult | null>(null);
  const [executeResult, setExecuteResult] = useState<BridgeAndExecuteResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sourceChainId, setSourceChainId] = useState<number | null>(null);

  // Contract addresses
  const VAULT_ADDRESS = getAddress('0xc526E6dC5Ed1BAA9dBd1476E328e987387927e9f') as `0x${string}`;
  const TOKEN_ADDRESS = getAddress('0x0b782612ff5e4E012485F85a80c5427C8A59A899') as `0x${string}`; // FormDataCoin
  const TREASURY_ADDRESS = getAddress('0x3324533837E165829b8E581B4F471125C9D8C66A') as `0x${string}`; // Treasury for USDC
  const OP_SEPOLIA_CHAIN_ID = 11155420; // Source chain - where user has USDC (showcase cross-chain)
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
   * Simulate the bridge and execute transaction
   */
  const simulate = useCallback(async (amount: string) => {
    if (!nexusSDK || !address) {
      setError('SDK not initialized or wallet not connected');
      return null;
    }

    setIsSimulating(true);
    setError(null);

    try {
      console.log('Simulating bridge and execute for amount:', amount);

      const simulateParams = {
        token: 'USDC' as any,
        amount: amount,
        toChainId: SEPOLIA_CHAIN_ID as any, // Bridge to Sepolia (destination - where vault is)
        recipient: TREASURY_ADDRESS, // USDC goes to treasury on Sepolia
        execute: {
          contractAddress: VAULT_ADDRESS,
          contractAbi: PublicDataCoinVaultABI as any,
          functionName: 'withdrawTokens',
          buildFunctionParams: (
            token: any,
            bridgeAmount: string,
            chainId: any,
            userAddr: `0x${string}`,
          ) => {
            // USDC has 6 decimals, but FormDataCoin has 18 decimals
            // We need to convert the USDC amount (6 decimals) to FormDataCoin amount (18 decimals)
            const usdcDecimals = 6;
            const formDataCoinDecimals = 18;
            
            // Parse USDC amount and convert to FormDataCoin amount (1:1 ratio but different decimals)
            const usdcAmountWei = parseUnits(bridgeAmount || '0', usdcDecimals);
            // Convert to FormDataCoin: multiply by 10^12 (18-6) to adjust decimals
            const formDataCoinAmountWei = usdcAmountWei * BigInt(10 ** (formDataCoinDecimals - usdcDecimals));
            
            console.log('Simulate: Amount conversion:', {
              bridgeAmount,
              usdcAmountWei: usdcAmountWei.toString(),
              formDataCoinAmountWei: formDataCoinAmountWei.toString()
            });
            
            // Send FormDataCoin to the user (userAddr), not treasury
            return {
              functionParams: [TOKEN_ADDRESS, userAddr, formDataCoinAmountWei],
            };
          },
          tokenApproval: {
            token: 'USDC' as any,
            amount: parseUnits(amount, 6).toString(),
          },
          waitForReceipt: true,
          requiredConfirmations: 1,
        } as any,
        waitForReceipt: true,
      };

      const result = await nexusSDK.simulateBridgeAndExecute(simulateParams);
      
      console.log('Simulation result:', result);
      setSimulationResult(result);
      
      if (!result.success) {
        setError(result.error || 'Simulation failed');
      }
      
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Simulation failed';
      console.error('Simulation error:', err);
      setError(errorMsg);
      return null;
    } finally {
      setIsSimulating(false);
    }
  }, [nexusSDK, address, VAULT_ADDRESS, TOKEN_ADDRESS, SEPOLIA_CHAIN_ID]);

  /**
   * Execute the bridge and execute transaction
   */
  const execute = useCallback(async (amount: string) => {
    if (!nexusSDK || !address) {
      setError('SDK not initialized or wallet not connected');
      return null;
    }

    setIsExecuting(true);
    setError(null);

    try {
      console.log('=== BRIDGE AND EXECUTE START ===');
      console.log('User Address:', address);
      console.log('Current Chain ID:', chain?.id || 'Unknown');
      console.log('Source Chain ID (OP Sepolia):', OP_SEPOLIA_CHAIN_ID);
      console.log('Destination Chain ID (Sepolia):', SEPOLIA_CHAIN_ID);
      console.log('Amount to bridge:', amount, 'USDC');
      console.log('Treasury Address (USDC recipient on Sepolia):', TREASURY_ADDRESS);
      console.log('Vault Address (on Sepolia):', VAULT_ADDRESS);
      console.log('Token Address (FormDataCoin on Sepolia):', TOKEN_ADDRESS);
      console.log('ℹ️ Nexus SDK will handle chain switching automatically during execution');

      const executeParams = {
        token: 'USDC' as any,
        amount: amount,
        fromChainId: OP_SEPOLIA_CHAIN_ID, // Bridge FROM OP Sepolia (source)
        toChainId: SEPOLIA_CHAIN_ID as any, // Bridge TO Sepolia (destination - where vault is)
        recipient: TREASURY_ADDRESS, // USDC goes to treasury on Sepolia
        execute: {
          contractAddress: VAULT_ADDRESS,
          contractAbi: PublicDataCoinVaultABI as any,
          functionName: 'withdrawTokens',
          buildFunctionParams: (
            token: any,
            bridgeAmount: string,
            chainId: any,
            userAddr: `0x${string}`,
          ) => {
            // USDC has 6 decimals, but FormDataCoin has 18 decimals
            // We need to convert the USDC amount (6 decimals) to FormDataCoin amount (18 decimals)
            const usdcDecimals = 6;
            const formDataCoinDecimals = 18;
            
            // Parse USDC amount and convert to FormDataCoin amount (1:1 ratio but different decimals)
            const usdcAmountWei = parseUnits(bridgeAmount || '0', usdcDecimals);
            // Convert to FormDataCoin: multiply by 10^12 (18-6) to adjust decimals
            const formDataCoinAmountWei = usdcAmountWei * BigInt(10 ** (formDataCoinDecimals - usdcDecimals));
            
            console.log('Execute: Amount conversion:', {
              bridgeAmount,
              usdcAmountWei: usdcAmountWei.toString(),
              formDataCoinAmountWei: formDataCoinAmountWei.toString()
            });
            
            const params = [TOKEN_ADDRESS, userAddr, formDataCoinAmountWei];
            console.log('Execute: Vault function params:', JSON.stringify({
              tokenAddress: TOKEN_ADDRESS,
              recipient: userAddr,
              amount: formDataCoinAmountWei.toString()
            }, null, 2));
            
            // Send FormDataCoin to the user (userAddr), not treasury
            return {
              functionParams: params,
            };
          },
          tokenApproval: {
            token: 'USDC' as any,
            amount: parseUnits(amount, 6).toString(),
          },
          waitForReceipt: true,
          requiredConfirmations: 1,
        } as any,
        waitForReceipt: true,
      };

      console.log('Execute Params (full):', JSON.stringify({
        token: 'USDC',
        amount: amount,
        fromChainId: OP_SEPOLIA_CHAIN_ID,
        toChainId: SEPOLIA_CHAIN_ID,
        recipient: TREASURY_ADDRESS,
        waitForReceipt: true,
        execute: {
          contractAddress: VAULT_ADDRESS,
          functionName: 'withdrawTokens',
          tokenApproval: {
            token: 'USDC',
            amount: parseUnits(amount, 6).toString(),
          }
        }
      }, null, 2));

      console.log('Calling nexusSDK.bridgeAndExecute...');
      const result = await nexusSDK.bridgeAndExecute(executeParams);
      
      console.log('=== EXECUTION RESULT ===');
      console.log(JSON.stringify(result, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      , 2));
      
      setExecuteResult(result);
      
      if (!result.success) {
        console.error('❌ Execution failed:', result.error);
        setError(result.error || 'Execution failed');
      } else {
        console.log('✅ Execution successful!');
        if ((result as any).transactionHash) {
          console.log('Transaction Hash:', (result as any).transactionHash);
        }
      }
      
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Execution failed';
      console.error('❌ EXECUTION ERROR:', err);
      console.error('Error details:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      setError(errorMsg);
      return null;
    } finally {
      console.log('=== BRIDGE AND EXECUTE END ===');
      setIsExecuting(false);
    }
  }, [nexusSDK, address, VAULT_ADDRESS, TOKEN_ADDRESS, SEPOLIA_CHAIN_ID, OP_SEPOLIA_CHAIN_ID, TREASURY_ADDRESS]);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setSimulationResult(null);
    setExecuteResult(null);
    setError(null);
  }, []);

  /**
   * Set the source chain ID for bridging
   */
  const setSourceChain = useCallback((chainId: number) => {
    setSourceChainId(chainId);
    reset();
  }, [reset]);

  return {
    // State
    isSimulating,
    isExecuting,
    simulationResult,
    executeResult,
    error,
    sourceChainId: sourceChainId || chain?.id || null,
    
    // Actions
    simulate,
    execute,
    reset,
    setSourceChain,
    
    // Config
    vaultAddress: VAULT_ADDRESS,
    tokenAddress: TOKEN_ADDRESS,
    chainId: SEPOLIA_CHAIN_ID, // Destination chain where vault is deployed
    sourceChain: OP_SEPOLIA_CHAIN_ID, // Source chain where user has USDC
  };
}
