interface EcoScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function EcoScore({ score, size = 'md', showLabel = true, className = '' }: EcoScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    if (score >= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return '🌿';
    if (score >= 6) return '🌱';
    if (score >= 4) return '⚠️';
    return '❌';
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const scoreColor = getScoreColor(score);
  const scoreIcon = getScoreIcon(score);

  return (
    <div className={`inline-flex items-center rounded-full ${scoreColor} ${sizeClasses[size]} ${className}`}>
      <span className="mr-1">{scoreIcon}</span>
      <span className="font-medium">{score.toFixed(1)}/10</span>
      {showLabel && (
        <span className="ml-1 text-xs opacity-75">
          {score >= 8 ? 'Excellent' : score >= 6 ? 'Bien' : score >= 4 ? 'Moyen' : 'Faible'}
        </span>
      )}
    </div>
  );
}