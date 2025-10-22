interface PricingBadgeProps {
  price: number;
  currency?: string;
  period?: string;
  variant?: 'default' | 'premium' | 'free';
}

export default function PricingBadge({ 
  price, 
  currency = '$', 
  period = 'per use',
  variant = 'default' 
}: PricingBadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'premium':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'free':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getVariantStyles()}`}>
      <span className="font-bold text-lg">{currency}{price}</span>
      <span className="ml-1 text-xs opacity-90">{period}</span>
    </div>
  );
}








