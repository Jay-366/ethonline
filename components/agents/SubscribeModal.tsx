'use client';

import React, { useState } from 'react';
import { X, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { BridgeAndExecuteButton } from '@avail-project/nexus-widgets';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  agentName: string;
  subscriptionPrice: string; // e.g., "0.001 ETH"
}

// Contract address for the agent subscription contract
const AGENT_CONTRACT_ADDRESS = '0xb443CCbB2efEDf9be8Bb087e8cAA393E3faB55Db';
const SUBSCRIPTION_AMOUNT = '0.001'; // ETH
const TARGET_CHAIN_ID = 11155111; // Ethereum Sepolia

export default function SubscribeModal({ 
  isOpen, 
  onClose, 
  agentId, 
  agentName, 
  subscriptionPrice 
}: SubscribeModalProps) {
  const { isConnected } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'processing' | 'success' | 'error'>('select');

  const handleClose = () => {
    if (!isProcessing) {
      setStep('select');
      setError(null);
      setTxHash(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-[#1C1F2B] rounded-3xl border border-[#50606C] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: '0 0 20px rgba(251, 237, 224, 0.1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#50606C]">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#FBede0' }}>
              Subscribe to {agentName}
            </h2>
            <p className="text-sm mt-1" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
              {subscriptionPrice} per month
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{ 
              backgroundColor: 'transparent',
              color: 'rgba(251, 237, 224, 0.8)'
            }}
            onMouseEnter={(e) => {
              if (!isProcessing) {
                e.currentTarget.style.backgroundColor = 'rgba(80, 96, 108, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!isConnected ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: 'rgba(251, 237, 224, 0.6)' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#FBede0' }}>
                Wallet Not Connected
              </h3>
              <p style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                Please connect your wallet to subscribe to this agent
              </p>
            </div>
          ) : step === 'select' ? (
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#FBede0' }}>
                Subscribe to {agentName}
              </h3>
              <p className="text-sm mb-6" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                Pay {SUBSCRIPTION_AMOUNT} ETH to subscribe to this agent. The payment will be processed on Ethereum Sepolia.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#161823' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>Agent</span>
                    <span style={{ color: '#FBede0' }}>{agentName}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>Price</span>
                    <span style={{ color: '#FBede0' }}>{SUBSCRIPTION_AMOUNT} ETH</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>Destination</span>
                    <span style={{ color: '#FBede0' }}>Ethereum Sepolia</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>Recipient</span>
                    <span style={{ color: '#FBede0', fontSize: '12px' }}>
                      {AGENT_CONTRACT_ADDRESS.slice(0, 6)}...{AGENT_CONTRACT_ADDRESS.slice(-4)}
                    </span>
                  </div>
                </div>
              </div>

              <BridgeAndExecuteButton
                contractAddress={AGENT_CONTRACT_ADDRESS}
                contractAbi={[
                  {
                    inputs: [
                      { internalType: 'string', name: 'agentId', type: 'string' },
                      { internalType: 'string', name: 'subscriptionType', type: 'string' },
                      { internalType: 'uint256', name: 'amountWei', type: 'uint256' }
                    ],
                    name: 'subscribe',
                    outputs: [],
                    stateMutability: 'payable',
                    type: 'function' as const,
                  },
                ] as const}
                functionName="subscribe"
                buildFunctionParams={(
                  _token: string,
                  amount: string,
                  _chainId: number,
                  _userAddress: `0x${string}`,
                ) => {
                  // Convert ETH amount to wei (BigInt) for the contract
                  const amountWei = parseEther(amount);
                  return {
                    functionParams: [agentId, 'monthly', amountWei],
                  };
                }}
                prefill={{
                  toChainId: TARGET_CHAIN_ID,
                  token: 'ETH',
                  amount: SUBSCRIPTION_AMOUNT,
                }}
                onSuccess={(result) => {
                  console.log('Subscription successful:', result);
                  setTxHash(result.executeTransactionHash || result.bridgeTransactionHash || '');
                  setStep('success');
                }}
                onError={(error) => {
                  console.error('Subscription failed:', error);
                  setError(error.message || 'Subscription failed');
                  setStep('error');
                }}
                onLoadingChange={(loading) => {
                  setIsProcessing(loading);
                }}
              >
                {({ onClick, isLoading, disabled }) => (
                  <button
                    onClick={onClick}
                    disabled={disabled || isLoading}
                    className="w-full px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: isLoading ? 'rgba(251, 237, 224, 0.3)' : '#FBede0',
                      color: '#161823',
                      cursor: disabled ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (!disabled && !isLoading) {
                        e.currentTarget.style.backgroundColor = '#e8d4c5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!disabled && !isLoading) {
                        e.currentTarget.style.backgroundColor = '#FBede0';
                      }
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Subscribe & Pay {SUBSCRIPTION_AMOUNT} ETH
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </BridgeAndExecuteButton>
            </div>
          ) : step === 'processing' ? (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: '#FBede0' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#FBede0' }}>
                Processing Subscription
              </h3>
              <p style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                Please wait while we process your subscription payment...
              </p>
            </div>
          ) : step === 'success' ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#10b981' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#FBede0' }}>
                Subscription Successful!
              </h3>
              <p className="mb-4" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                You are now subscribed to {agentName}
              </p>
              {txHash && (
                <p className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.5)' }}>
                  Transaction: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline">{txHash.slice(0, 10)}...{txHash.slice(-8)}</a>
                </p>
              )}
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-3 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: '#FBede0',
                  color: '#161823'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e8d4c5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FBede0';
                }}
              >
                Close
              </button>
            </div>
          ) : step === 'error' ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#ef4444' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#FBede0' }}>
                Subscription Failed
              </h3>
              <p className="mb-4" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                {error || 'An error occurred during the subscription process'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('select')}
                  className="flex-1 px-6 py-3 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #50606C',
                    color: '#FBede0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(80, 96, 108, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: '#FBede0',
                    color: '#161823'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e8d4c5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FBede0';
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}