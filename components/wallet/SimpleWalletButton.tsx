'use client';

interface SimpleWalletButtonProps {
  className?: string;
}

export default function SimpleWalletButton({ className }: SimpleWalletButtonProps) {
  const handleConnect = () => {
    alert('Wallet connection will be implemented here');
  };

  return (
    <button 
      className={className} 
      onClick={handleConnect}
      type="button"
    >
      Connect Wallet
    </button>
  );
}
