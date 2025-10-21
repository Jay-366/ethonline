'use client';

import { useNexus } from '@/components/nexus/NexusProvider';
import { useAccount } from 'wagmi';

export default function NexusStatus() {
  const { nexusSDK, unifiedBalance, loading, network } = useNexus();
  const { isConnected } = useAccount();

  return (
    <div className="p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-3">Nexus SDK Status</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Wallet Connected:</span>
          <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
            {isConnected ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Nexus Initialized:</span>
          <span className={nexusSDK ? 'text-green-400' : 'text-red-400'}>
            {nexusSDK ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Network:</span>
          <span className="text-blue-400">
            {network || 'Not set'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Loading:</span>
          <span className={loading ? 'text-yellow-400' : 'text-gray-400'}>
            {loading ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Unified Balance:</span>
          <span className="text-blue-400">
            {unifiedBalance ? `${unifiedBalance.length} assets` : 'Not loaded'}
          </span>
        </div>
      </div>
      
      {unifiedBalance && unifiedBalance.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Assets:</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {unifiedBalance.slice(0, 5).map((asset, index) => (
              <div key={index} className="text-xs flex justify-between">
                <span>{asset.symbol}</span>
                <span>{asset.balance}</span>
              </div>
            ))}
            {unifiedBalance.length > 5 && (
              <div className="text-xs text-gray-400">
                ... and {unifiedBalance.length - 5} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
