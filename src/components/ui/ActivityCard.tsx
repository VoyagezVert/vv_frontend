import type { Activity } from '../../types';
import { EcoScore } from './EcoScore';
import { CarbonFootprint } from './CarbonFootprint';

interface ActivityCardProps {
  activity: Activity;
  participants?: number;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ActivityCard({ 
  activity, 
  participants = 1, 
  isSelected = false, 
  onClick,
  className = '' 
}: ActivityCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
    return `${mins}min`;
  };

  const formatPrice = (price: number, participants: number) => {
    const total = price * participants;
    return participants > 1 ? `${total}€ (${participants} pers.)` : `${price}€`;
  };

  const formatDifficulty = (difficulty: string) => {
    const levels = {
      easy: { label: 'Facile', color: 'text-green-600', icon: '🟢' },
      moderate: { label: 'Modéré', color: 'text-yellow-600', icon: '🟡' },
      challenging: { label: 'Difficile', color: 'text-red-600', icon: '🔴' }
    };
    return levels[difficulty as keyof typeof levels] || levels.easy;
  };

  const difficultyInfo = formatDifficulty(activity.difficulty);
  const totalCarbonImpact = activity.carbonImpact * participants;

  return (
    <div 
      className={`
        bg-white rounded-lg border-2 overflow-hidden cursor-pointer transition-all hover:shadow-lg
        ${isSelected ? 'border-primary-500 shadow-md' : 'border-gray-200'}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Activity Image */}
      {activity.images.length > 0 && (
        <div className="h-40 bg-gray-200 relative overflow-hidden">
          <img 
            src={activity.images[0]} 
            alt={activity.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-activity.jpg';
            }}
          />
          <div className="absolute top-3 right-3">
            <EcoScore score={activity.ecoScore} size="sm" />
          </div>
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-1 bg-white/90 rounded-full text-xs">
              <span className="mr-1">{activity.category.icon}</span>
              {activity.category.name}
            </span>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Activity Name and Difficulty */}
        <div className="mb-2">
          <h3 className="font-bold text-lg text-gray-800 mb-1">{activity.name}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <span className="mr-1">{difficultyInfo.icon}</span>
              <span className={difficultyInfo.color}>{difficultyInfo.label}</span>
            </div>
            <span className="text-sm text-gray-500">
              {'city' in activity.location ? (activity.location as { city: string }).city : 'Lieu'}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {activity.description}
        </p>

        {/* Duration and Group Size */}
        <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="mr-1">⏱️</span>
            <span>{formatDuration(activity.duration)}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">👥</span>
            <span>{activity.groupSize.min}-{activity.groupSize.max} pers.</span>
          </div>
        </div>

        {/* Sustainability Features */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-2 text-xs">
            {activity.sustainability.supportsLocalCommunity && (
              <span className="flex items-center text-green-600">
                <span className="mr-1">🤝</span>
                Local
              </span>
            )}
            {activity.sustainability.educationalValue && (
              <span className="flex items-center text-blue-600">
                <span className="mr-1">🎓</span>
                Éducatif
              </span>
            )}
            {activity.sustainability.wildlifeConservation && (
              <span className="flex items-center text-green-600">
                <span className="mr-1">🦋</span>
                Conservation
              </span>
            )}
            {activity.sustainability.environmentallyFriendly && (
              <span className="flex items-center text-green-600">
                <span className="mr-1">🌱</span>
                Éco-friendly
              </span>
            )}
          </div>
        </div>

        {/* Carbon Impact */}
        <div className="mb-3">
          <CarbonFootprint 
            carbonFootprint={totalCarbonImpact}
            size="sm"
          />
        </div>

        {/* Tags */}
        {activity.tags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {activity.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
              {activity.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{activity.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Provider and Rating */}
        <div className="mb-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Par {activity.provider.name}</span>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span>{activity.provider.rating}/5</span>
            </div>
          </div>
        </div>

        {/* Price and Booking */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(activity.price, participants)}
            </span>
          </div>
          
          {activity.bookingUrl && (
            <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
              Réserver
            </button>
          )}
        </div>
      </div>
    </div>
  );
}