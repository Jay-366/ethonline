'use client';
 
import { useNexus } from '@/components/nexus/NexusProvider';
 
export default function FetchUnifiedBalanceButton({
  className,
  onResult,
}: { className?: string; onResult?: (r: any) => void }) {
  const { nexusSDK, fetchUnifiedBalance, unifiedBalance, loading } = useNexus();
  
  const onClick = async () => {
    if (!nexusSDK) return alert('Initialize first');
    try {
      await fetchUnifiedBalance();
      onResult?.(unifiedBalance);
      console.log('Unified balances:', unifiedBalance);
    } catch (e: any) {
      alert(e?.message ?? 'Failed to fetch balances');
    }
  };
  
  return (
    <button 
      className={className} 
      onClick={onClick} 
      disabled={loading || !nexusSDK}
    >
      {loading ? 'Fetching...' : 'Fetch Unified Balances'}
    </button>
  );
}