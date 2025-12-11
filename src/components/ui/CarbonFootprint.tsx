interface CarbonFootprintProps {
  carbonFootprint: number; // kg CO2
  comparison?: {
    conventional: number;
    savings: number;
    percentage: number;
  };
  size?: 'sm' | 'md' | 'lg';
  showComparison?: boolean;
  className?: string;
}

export function CarbonFootprint({ 
  carbonFootprint, 
  comparison, 
  size = 'md', 
  showComparison = true,
  className = '' 
}: CarbonFootprintProps) {
  const formatCarbonAmount = (amount: number) => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(2)} t`;
    }
    return `${amount.toFixed(1)} kg`;
  };

  const getEmissionLevel = (amount: number) => {
    if (amount <= 10) return { level: 'low', color: 'text-green-600', icon: '🌱' };
    if (amount <= 50) return { level: 'medium', color: 'text-yellow-600', icon: '⚡' };
    if (amount <= 100) return { level: 'high', color: 'text-orange-600', icon: '⚠️' };
    return { level: 'very-high', color: 'text-red-600', icon: '🔥' };
  };

  const emissionLevel = getEmissionLevel(carbonFootprint);

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`${className}`}>
      <div className={`flex items-center ${sizeClasses[size]}`}>
        <span className="mr-1">{emissionLevel.icon}</span>
        <span className={`font-medium ${emissionLevel.color}`}>
          {formatCarbonAmount(carbonFootprint)} CO₂
        </span>
      </div>
      
      {comparison && showComparison && comparison.savings > 0 && (
        <div className={`flex items-center mt-1 ${sizeClasses[size]} text-green-600`}>
          <span className="mr-1">💚</span>
          <span className="text-xs">
            -{formatCarbonAmount(comparison.savings)} vs conventionnel (-{comparison.percentage.toFixed(0)}%)
          </span>
        </div>
      )}
      
      <div className={`text-xs text-gray-500 mt-1`}>
        Équivalent: {Math.round(carbonFootprint * 0.00004)} arbre(s) planté(s)
      </div>
    </div>
  );
}