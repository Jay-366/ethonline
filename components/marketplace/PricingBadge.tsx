interface PricingBadgeProps {
  price: number | string;
  currency?: string;
  period?: string;
  variant?: 'default' | 'premium' | 'free';
}

export default function PricingBadge({ 
  price, 
  currency = '', 
  period = 'per query',
  variant = 'default' 
}: PricingBadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'premium':
        return 'bg-gradient-to-r from-[#5C4F3D] to-[#FBede0] text-[#161823]';
      case 'free':
        return 'bg-[#2F3A3D] text-[#A3FFBD]';
      default:
        return 'bg-[#50606C] text-[#FBede0]';
    }
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getVariantStyles()}`}>
      <span className="font-bold text-lg">{currency}{price}</span>
      <span className="ml-1 text-xs opacity-90"> {period}</span>
    </div>
  );
}
