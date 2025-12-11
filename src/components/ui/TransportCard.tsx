import type { TransportRoute } from '../../types';
import { EcoScore } from './EcoScore';
import { CarbonFootprint } from './CarbonFootprint';

interface TransportCardProps {
  route: TransportRoute;
  isSelected?: boolean;
  onClick?: () => void;
  showComparison?: boolean;
  className?: string;
}

export function TransportCard({ 
  route, 
  isSelected = false, 
  onClick,
  showComparison = true,
  className = '' 
}: TransportCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
    return `${mins}min`;
  };

  const formatPrice = (price: number) => {
    return `${price}€`;
  };

  const formatDistance = (distance: number) => {
    return `${distance} km`;
  };

  return (
    <div 
      className={`
        bg-white rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-md
        ${isSelected ? 'border-primary-500 shadow-md' : 'border-gray-200'}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Header with transport mode */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{route.transportMode.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-800">{route.transportMode.name}</h3>
            <p className="text-xs text-gray-500">{route.provider}</p>
          </div>
        </div>
        <EcoScore score={route.ecoScore} size="sm" showLabel={false} />
      </div>

      {/* Route details */}
      <div className="mb-3">
        <div className="text-sm text-gray-600 mb-1">
          <span className="font-medium">{route.origin.city}</span>
          <span className="mx-2">→</span>
          <span className="font-medium">{route.destination.city}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatDistance(route.distance)}</span>
          <span>{formatDuration(route.duration)}</span>
        </div>
      </div>

      {/* Times */}
      {route.departureTime && route.arrivalTime && (
        <div className="flex items-center justify-between mb-3 text-sm">
          <div>
            <span className="text-gray-500">Départ:</span>
            <span className="ml-1 font-medium">
              {route.departureTime.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Arrivée:</span>
            <span className="ml-1 font-medium">
              {route.arrivalTime.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      )}

      {/* Carbon footprint */}
      <div className="mb-3">
        <CarbonFootprint 
          carbonFootprint={route.carbonFootprint}
          size="sm"
          showComparison={showComparison}
        />
      </div>

      {/* Price and booking */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-lg font-bold text-primary-600">
          {formatPrice(route.price)}
        </span>
        
        {route.bookingUrl && (
          <button className="px-3 py-1 bg-primary-500 text-white rounded text-sm hover:bg-primary-600 transition-colors">
            Réserver
          </button>
        )}
      </div>
    </div>
  );
}