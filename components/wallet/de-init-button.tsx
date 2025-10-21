'use client';
 
import { useNexus } from '@/components/nexus/NexusProvider';
 
export default function DeinitButton({
  className,
  onDone,
}: { className?: string; onDone?: () => void }) {
  const { nexusSDK, deinitializeNexus, loading } = useNexus();
  
  const onClick = async () => {
    try {
      await deinitializeNexus();
      onDone?.();
      alert('Nexus de-initialized');
    } catch (e: any) {
      alert(e?.message ?? 'De-init failed');
    }
  };
  
  return (
    <button 
      className={className} 
      onClick={onClick} 
      disabled={loading || !nexusSDK}
    >
      {loading ? 'De-initializing...' : 'De-initialize'}
    </button>
  );
}