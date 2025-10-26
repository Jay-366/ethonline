'use client';

import { useState } from 'react';
import { useBridgeAndExecuteVault } from '@/hooks/nexus/useBridgeAndExecuteVault';
import { useNexus } from '@/components/nexus/NexusProvider';
import { useAccount } from 'wagmi';
import { Loader2, ArrowRight, CheckCircle, AlertCircle, Wallet } from 'lucide-react';

// Supported chains for bridging
const SUPPORTED_CHAINS = [
  { id: 11155420, name: 'Optimism Sepolia', currency: 'ETH' },
  { id: 80002, name: 'Polygon Amoy', currency: 'MATIC' },
  { id: 421614, name: 'Arbitrum Sepolia', currency: 'ETH' },
  { id: 84532, name: 'Base Sepolia', currency: 'ETH' },
  { id: 11155111, name: 'Sepolia', currency: 'ETH' },
  { id: 10143, name: 'Monad Testnet', currency: 'MON' },
];

interface VaultWithdrawCardProps {
  onSubscriptionSuccess?: (transactionHash?: string) => void;
}

export default function VaultWithdrawCard({ onSubscriptionSuccess }: VaultWithdrawCardProps) {
  const [amount, setAmount] = useState('1');
  const { nexusSDK, handleInit, loading } = useNexus();
  const { address, connector, chain } = useAccount();
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
    await simulate(amount);
  };

  const handleExecute = async () => {
    // Inform user about the bridge flow
    console.log('🚀 Starting bridge from OP Sepolia to Sepolia. Your USDC will be taken from OP Sepolia and bridged to Sepolia.');
    console.log('ℹ️ Nexus SDK will automatically handle chain switching during execution.');
    
    const result = await execute(amount);
    
    console.log('📦 Execute result:', result);
    
    // If execution was successful, call the success callback with transaction hash
    if (result && result.success && onSubscriptionSuccess) {
      console.log('✅ Subscription successful! Calling success callback...');
      const txHash = result.executeTransactionHash || result.bridgeTransactionHash;
      console.log('🔗 Transaction hash:', txHash);
      console.log('📋 Full result object:', JSON.stringify(result, null, 2));
      onSubscriptionSuccess(txHash);
    } else {
      console.log('❌ Result check failed:', {
        hasResult: !!result,
        success: result?.success,
        hasCallback: !!onSubscriptionSuccess
      });
    }
  };

  const handleInitializeNexus = async () => {
    if (!connector) {
      alert('Please connect your wallet first');
      return;
    }
    try {
      const provider = await connector.getProvider();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await handleInit(provider as any);
    } catch (err) {
      console.error('Failed to initialize Nexus:', err);
    }
  };

  const isNexusInitialized = !!nexusSDK;

  return (
    <div 
      className="bg-[#1C1F2B] rounded-3xl border border-[#50606C] p-6 max-w-2xl w-full"
      style={{ boxShadow: '0 0 20px rgba(251, 237, 224, 0.1)' }}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#FBede0' }}>
          Bridge & Withdraw from Vault
        </h2>
        <p className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
          Bridge USDC from OP Sepolia to Sepolia and automatically withdraw FormDataCoin from the vault
        </p>
        <div 
          className="mt-3 p-3 rounded-lg"
          style={{ 
            backgroundColor: 'rgba(251, 237, 224, 0.05)',
            border: '1px solid rgba(251, 237, 224, 0.1)'
          }}
        >
          <p className="text-xs" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
            💡 Your USDC will be bridged from OP Sepolia to Sepolia treasury, and you&apos;ll receive FormDataCoin tokens on Sepolia in return
          </p>
        </div>
      </div>

      {/* Nexus Initialization Check */}
      {!isNexusInitialized && (
        <div 
          className="p-4 rounded-xl mb-6"
          style={{ 
            backgroundColor: 'rgba(251, 237, 224, 0.05)',
            border: '1px solid rgba(251, 237, 224, 0.2)'
          }}
        >
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'rgba(251, 237, 224, 0.8)' }} />
            <div className="flex-1">
              <h4 className="font-semibold mb-1" style={{ color: '#FBede0' }}>
                Nexus SDK Not Initialized
              </h4>
              <p className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                {!address 
                  ? 'Please connect your wallet first, then initialize Nexus SDK to use bridge & execute functionality.'
                  : 'Click the button below to initialize Nexus SDK and start bridging.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleInitializeNexus}
            disabled={!address || loading}
            className="w-full px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              backgroundColor: loading ? 'rgba(251, 237, 224, 0.3)' : '#FBede0',
              color: '#161823',
              cursor: (!address || loading) ? 'not-allowed' : 'pointer',
              opacity: !address ? 0.5 : 1
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Initializing Nexus...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                Initialize Nexus SDK
              </>
            )}
          </button>
        </div>
      )}

      {/* Vault Info */}
      <div 
        className="p-4 rounded-xl mb-6"
        style={{ backgroundColor: '#161823' }}
      >
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>Source Chain</span>
            <span style={{ color: '#FBede0', fontSize: '12px' }}>
              OP Sepolia (ID: 11155420)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>Destination Chain</span>
            <span style={{ color: '#FBede0', fontSize: '12px' }}>
              Sepolia (ID: 11155111)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>Vault Address</span>
            <span style={{ color: '#FBede0', fontSize: '12px' }}>
              {vaultAddress.slice(0, 6)}...{vaultAddress.slice(-4)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>Token Address</span>
            <span style={{ color: '#FBede0', fontSize: '12px' }}>
              {tokenAddress.slice(0, 6)}...{tokenAddress.slice(-4)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>USDC Recipient (Treasury)</span>
            <span style={{ color: '#FBede0', fontSize: '12px' }}>
              0x3324...8C66A
            </span>
          </div>
        </div>
      </div>

      {/* Wallet Connection Status */}
      {chain?.id !== 11155420 && chain?.id !== 11155111 && (
        <div 
          className="p-4 rounded-xl mb-6"
          style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}
        >
          <p className="text-sm" style={{ color: '#ef4444' }}>
            ⚠️ Please switch your wallet to OP Sepolia to start the bridge. Nexus will automatically handle chain switching during execution.
          </p>
        </div>
      )}

      {chain?.id === 11155420 && (
        <div 
          className="p-4 rounded-xl mb-6"
          style={{ 
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}
        >
          <p className="text-sm" style={{ color: '#10b981' }}>
            ✅ Wallet connected to OP Sepolia. Ready to bridge! (SDK will handle chain switching)
          </p>
        </div>
      )}

      {chain?.id === 11155111 && (
        <div 
          className="p-4 rounded-xl mb-6"
          style={{ 
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}
        >
          <p className="text-sm" style={{ color: '#3b82f6' }}>
            ℹ️ You&apos;re on Sepolia (destination chain). Please switch to OP Sepolia to start the bridge.
          </p>
        </div>
      )}

      {/* Amount Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(251, 237, 224, 0.8)' }}>
          Amount (USDC)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.1"
          min="0"
          className="w-full px-4 py-3 rounded-xl border transition-colors"
          style={{
            backgroundColor: '#161823',
            borderColor: '#50606C',
            color: '#FBede0',
          }}
          placeholder="1.0"
        />
      </div>

      {/* Simulation Result */}
      {simulationResult && (
        <div 
          className="p-4 rounded-xl mb-6"
          style={{ 
            backgroundColor: simulationResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${simulationResult.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}
        >
          <div className="flex items-start gap-3">
            {simulationResult.success ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#10b981' }} />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
            )}
            <div className="flex-1">
              <h4 className="font-semibold mb-1" style={{ color: '#FBede0' }}>
                Simulation {simulationResult.success ? 'Successful' : 'Failed'}
              </h4>
              {simulationResult.success && simulationResult.totalEstimatedCost && (
                <p className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                  Estimated cost: {typeof simulationResult.totalEstimatedCost === 'object' 
                    ? simulationResult.totalEstimatedCost.total 
                    : simulationResult.totalEstimatedCost}
                </p>
              )}
              {simulationResult.metadata?.approvalRequired && (
                <p className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                  ⚠️ Token approval required
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Execute Result */}
      {executeResult && (
        <div 
          className="p-4 rounded-xl mb-6"
          style={{ 
            backgroundColor: executeResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${executeResult.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}
        >
          <div className="flex items-start gap-3">
            {executeResult.success ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#10b981' }} />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
            )}
            <div className="flex-1">
              <h4 className="font-semibold mb-2" style={{ color: '#FBede0' }}>
                Transaction {executeResult.success ? 'Successful' : 'Failed'}
              </h4>
              {executeResult.executeTransactionHash && (
                <div className="space-y-1">
                  <p className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                    Tx: {executeResult.executeTransactionHash.slice(0, 10)}...{executeResult.executeTransactionHash.slice(-8)}
                  </p>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${executeResult.executeTransactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg transition-all duration-200 hover:opacity-80"
                    style={{
                      backgroundColor: 'rgba(251, 237, 224, 0.1)',
                      color: '#FBede0',
                      border: '1px solid rgba(251, 237, 224, 0.2)'
                    }}
                  >
                    View on Sepolia Etherscan →
                  </a>
                </div>
              )}
              {executeResult.bridgeTransactionHash && (
                <div className="space-y-1 mt-3">
                  <p className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                    Bridge Tx: {executeResult.bridgeTransactionHash.slice(0, 10)}...{executeResult.bridgeTransactionHash.slice(-8)}
                  </p>
                  <a
                    href={`https://optimism-sepolia.etherscan.io/tx/${executeResult.bridgeTransactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg transition-all duration-200 hover:opacity-80"
                    style={{
                      backgroundColor: 'rgba(251, 237, 224, 0.1)',
                      color: '#FBede0',
                      border: '1px solid rgba(251, 237, 224, 0.2)'
                    }}
                  >
                    View on OP Sepolia Etherscan →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div 
          className="p-4 rounded-xl mb-6"
          style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
            <div className="flex-1">
              <h4 className="font-semibold mb-1" style={{ color: '#FBede0' }}>
                Error
              </h4>
              <p className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSimulate}
          disabled={isSimulating || isExecuting || !amount || !isNexusInitialized}
          className="flex-1 px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            backgroundColor: isSimulating ? 'rgba(251, 237, 224, 0.3)' : 'transparent',
            border: '1px solid #50606C',
            color: '#FBede0',
            cursor: (isSimulating || isExecuting || !amount || !isNexusInitialized) ? 'not-allowed' : 'pointer',
            opacity: (!isNexusInitialized) ? 0.5 : 1
          }}
        >
          {isSimulating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Simulating...
            </>
          ) : (
            <>
              Simulate
            </>
          )}
        </button>

        <button
          onClick={handleExecute}
          disabled={isExecuting || isSimulating || !amount || !isNexusInitialized}
          className="flex-1 px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            backgroundColor: isExecuting ? 'rgba(251, 237, 224, 0.3)' : '#FBede0',
            color: '#161823',
            cursor: (isExecuting || isSimulating || !amount || !isNexusInitialized) ? 'not-allowed' : 'pointer',
            opacity: (!isNexusInitialized) ? 0.5 : 1
          }}
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              Execute
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Reset Button */}
      {(simulationResult || executeResult || error) && (
        <button
          onClick={reset}
          className="w-full mt-3 px-6 py-2 rounded-xl transition-all duration-200"
          style={{
            backgroundColor: 'transparent',
            border: '1px solid rgba(80, 96, 108, 0.5)',
            color: 'rgba(251, 237, 224, 0.7)',
            fontSize: '14px'
          }}
        >
          Reset
        </button>
      )}
    </div>
  );
}
