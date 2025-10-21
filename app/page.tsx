'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to chat page since that's the main interface
    router.push('/chat');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#161823' }}>
      <div style={{ color: '#FBede0' }}>Redirecting to chat...</div>
    </div>
  );
}