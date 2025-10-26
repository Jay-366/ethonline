'use client';

import { X } from 'lucide-react';
import VaultWithdrawCard from './VaultWithdrawCard';

interface VaultBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionSuccess?: (transactionHash?: string) => void;
}

export default function VaultBridgeModal({ isOpen, onClose, onSubscriptionSuccess }: VaultBridgeModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={onClose}
    >
      <div 
        className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-200"
          style={{
            backgroundColor: 'rgba(251, 237, 224, 0.1)',
            color: '#FBede0',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(251, 237, 224, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(251, 237, 224, 0.1)';
          }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Vault Card */}
        <VaultWithdrawCard onSubscriptionSuccess={onSubscriptionSuccess} />
      </div>
    </div>
  );
}
