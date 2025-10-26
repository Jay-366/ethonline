import type {
  ExecuteParams,
  BridgeAndExecuteParams,
  BridgeAndExecuteResult,
  BridgeAndExecuteSimulationResult,
  SUPPORTED_TOKENS,
  SUPPORTED_CHAINS_IDS,
} from '@avail-project/nexus-core';
import { parseUnits, getAddress } from 'viem';

/**
 * Test implementation following official Nexus docs example
 * Adapted for PublicDataCoinVault on Sepolia
 */
export async function testBridgeAndExecuteVault(
  sdk: any,
  userAddress: `0x${string}`,
  amount: string = '1' // 1 token with 6 decimals
) {
  const VAULT_ADDRESS = getAddress('0xc526E6dC5Ed1BAA9dBd1476E328e987387927e9f') as `0x${string}`;
  const TOKEN_ADDRESS = getAddress('0x0b782612ff5e4E012485F85a80c5427C8A59A899') as `0x${string}`;
  const SEPOLIA_CHAIN_ID = 11155111 as SUPPORTED_CHAINS_IDS;

  // Import ABI
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

  // Step 1: Simulate the bridgeAndExecute to check costs and approvals
  console.log('=== Step 1: Simulating bridgeAndExecute ===');
  
  const simulateParams: BridgeAndExecuteParams = {
    token: 'USDC' as SUPPORTED_TOKENS,
    amount: amount, // e.g., '1' (in human-readable units with 6 decimals)
    toChainId: SEPOLIA_CHAIN_ID,
    recipient: userAddress,
    execute: {
      contractAddress: VAULT_ADDRESS,
      contractAbi: PublicDataCoinVaultABI as any,
      functionName: 'withdrawTokens',
      buildFunctionParams: (
        token: SUPPORTED_TOKENS,
        bridgeAmount: string,
        chainId: SUPPORTED_CHAINS_IDS,
        userAddr: 0x${string},
      ) => {
        console.log('Simulate buildFunctionParams:', { token, bridgeAmount, chainId, userAddr });
        
        // USDC has 6 decimals, but FormDataCoin has 18 decimals
        // We need to convert the USDC amount (6 decimals) to FormDataCoin amount (18 decimals)
        const usdcDecimals = 6;
        const formDataCoinDecimals = 18;
        
        // Parse USDC amount and convert to FormDataCoin amount (1:1 ratio but different decimals)
        const usdcAmountWei = parseUnits(bridgeAmount || '0', usdcDecimals);
        // Convert to FormDataCoin: multiply by 10^12 (18-6) to adjust decimals
        const formDataCoinAmountWei = usdcAmountWei * BigInt(10 ** (formDataCoinDecimals - usdcDecimals));
        
        console.log('Simulate: Parsed amount:', bridgeAmount, '-> USDC wei:', usdcAmountWei.toString(), '-> FormDataCoin wei:', formDataCoinAmountWei.toString());
        
        return {
          functionParams: [TOKEN_ADDRESS, userAddr, formDataCoinAmountWei],
        };
      },
      tokenApproval: {
        token: 'USDC' as SUPPORTED_TOKENS,
        amount: parseUnits(amount, 6).toString(), // Amount in token units
      },
      waitForReceipt: true,
      requiredConfirmations: 1,
    } as any,
    waitForReceipt: true,
  };

  try {
    const simulation: BridgeAndExecuteSimulationResult = await sdk.simulateBridgeAndExecute(simulateParams);
    console.log('Simulation result:', simulation);
    console.log('Approval required:', simulation.metadata?.approvalRequired);
    console.log('Bridge receive amount:', simulation.metadata?.bridgeReceiveAmount);
    console.log('Total estimated cost:', simulation.totalEstimatedCost);
    
    if (!simulation.success) {
      console.error('Simulation failed:', simulation.error);
      return;
    }
  } catch (err) {
    console.error('Simulation error:', err);
    return;
  }

  // Step 2: Execute the bridgeAndExecute
  console.log('\n=== Step 2: Executing bridgeAndExecute ===');
  
  const executeParams: BridgeAndExecuteParams = {
    token: 'USDC' as SUPPORTED_TOKENS,
    amount: amount,
    toChainId: SEPOLIA_CHAIN_ID,
    recipient: userAddress,
    execute: {
      contractAddress: VAULT_ADDRESS,
      contractAbi: PublicDataCoinVaultABI as any,
      functionName: 'withdrawTokens',
      buildFunctionParams: (
        token: SUPPORTED_TOKENS,
        bridgeAmount: string,
        chainId: SUPPORTED_CHAINS_IDS,
        userAddr: `0x${string}`,
      ) => {
        console.log('Execute buildFunctionParams:', { token, bridgeAmount, chainId, userAddr });
        
        // USDC has 6 decimals, but FormDataCoin has 18 decimals
        // We need to convert the USDC amount (6 decimals) to FormDataCoin amount (18 decimals)
        const usdcDecimals = 6;
        const formDataCoinDecimals = 18;
        
        // Parse USDC amount and convert to FormDataCoin amount (1:1 ratio but different decimals)
        const usdcAmountWei = parseUnits(bridgeAmount || '0', usdcDecimals);
        // Convert to FormDataCoin: multiply by 10^12 (18-6) to adjust decimals
        const formDataCoinAmountWei = usdcAmountWei * BigInt(10 ** (formDataCoinDecimals - usdcDecimals));
        
        console.log('Execute: Parsed amount:', bridgeAmount, '-> USDC wei:', usdcAmountWei.toString(), '-> FormDataCoin wei:', formDataCoinAmountWei.toString());
        
        // withdrawTokens(tokenAddress, recipient, amount)
        return {
          functionParams: [TOKEN_ADDRESS, userAddr, formDataCoinAmountWei],
        };
      },
      tokenApproval: {
        token: 'USDC' as SUPPORTED_TOKENS,
        amount: parseUnits(amount, 6).toString(),
      },
      waitForReceipt: true,
      requiredConfirmations: 1,
    } as any,
    waitForReceipt: true,
  };

  try {
    const result: BridgeAndExecuteResult = await sdk.bridgeAndExecute(executeParams);
    console.log('BridgeAndExecute result:', result);
    console.log('Success:', result.success);
    console.log('Bridge skipped:', result.bridgeSkipped);
    console.log('Execute transaction:', result.executeTransactionHash);
    console.log('Bridge transaction:', result.bridgeTransactionHash);
    return result;
  } catch (err) {
    console.error('BridgeAndExecute error:', err);
    throw err;
  }
}

export default testBridgeAndExecuteVault;