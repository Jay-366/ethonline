interface BalanceCardProps {
  balance: number;
  currency?: string;
  isLoading?: boolean;
}

export default function BalanceCard({ 
  balance, 
  currency = 'USD',
  isLoading = false 
}: BalanceCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-md text-white">
      <h3 className="text-lg font-medium mb-2">Wallet Balance</h3>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-bold">{currency}</span>
        <span className="text-3xl font-bold">{balance.toFixed(2)}</span>
      </div>
      <p className="text-blue-100 text-sm mt-2">Available for agent usage</p>
    </div>
  );
}
