'use client';
 
import { useAccount } from 'wagmi';
import { useNexus } from '@/components/nexus/NexusProvider';
 
export default function InitButton({
  className,
  onReady,
}: { className?: string; onReady?: () => void }) {
  const { connector } = useAccount();
  const { nexusSDK, handleInit, loading } = useNexus();
  
  const onClick = async () => {
    try {
      // Get the provider from the connected wallet
      const provider = await connector?.getProvider();
      if (!provider) throw new Error('No provider found');
      
      // Use the NexusProvider's handleInit method
      await handleInit(provider as any);
      onReady?.();
      alert('Nexus initialized');
    } catch (e: any) {
      alert(e?.message ?? 'Init failed');
    }
  };
  
  return (
    <button 
      className={className} 
      onClick={onClick} 
      disabled={loading || !!nexusSDK}
    >
      {loading ? 'Initializing...' : 'Initialize Nexus'}
    </button>
  );
}