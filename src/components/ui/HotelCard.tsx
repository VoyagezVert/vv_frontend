import type { Hotel } from '../../types';
import { EcoScore } from './EcoScore';
import { CarbonFootprint } from './CarbonFootprint';

interface HotelCardProps {
  hotel: Hotel;
  nights?: number;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function HotelCard({ 
  hotel, 
  nights = 1, 
  isSelected = false, 
  onClick,
  className = '' 
}: HotelCardProps) {
  const formatPrice = (price: number, nights: number) => {
    const total = price * nights;
    return nights > 1 ? `${total}€ (${nights} nuits)` : `${price}€/nuit`;
  };

  const formatRating = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + (rating % 1 ? '☆' : '');
  };

  const totalCarbonFootprint = hotel.carbonFootprint * nights;

  return (
    <div 
      className={`
        bg-white rounded-lg border-2 overflow-hidden cursor-pointer transition-all hover:shadow-lg
        ${isSelected ? 'border-primary-500 shadow-md' : 'border-gray-200'}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Hotel Image */}
      {hotel.images.length > 0 && (
        <div className="h-48 bg-gray-200 relative overflow-hidden">
          <img 
            src={hotel.images[0]} 
            alt={hotel.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-hotel.jpg';
            }}
          />
          <div className="absolute top-3 right-3">
            <EcoScore score={hotel.ecoScore} size="sm" />
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Hotel Name and Rating */}
        <div className="mb-2">
          <h3 className="font-bold text-lg text-gray-800 mb-1">{hotel.name}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-yellow-500 text-sm mr-2">
                {formatRating(hotel.rating)}
              </span>
              <span className="text-sm text-gray-600">
                {hotel.reviews.totalReviews} avis
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {'city' in hotel.location ? (hotel.location as { city: string }).city : 'Lieu'}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {hotel.description}
        </p>

        {/* Eco Labels */}
        {hotel.ecoLabels.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {hotel.ecoLabels.slice(0, 3).map((label) => (
                <span 
                  key={label.id}
                  className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                >
                  <span className="mr-1">{label.icon}</span>
                  {label.name}
                </span>
              ))}
              {hotel.ecoLabels.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{hotel.ecoLabels.length - 3} autre(s)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Sustainability Features */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-2 text-xs">
            {hotel.sustainability.energySource === 'renewable' && (
              <span className="flex items-center text-green-600">
                <span className="mr-1">⚡</span>
                Énergie verte
              </span>
            )}
            {hotel.sustainability.carbonNeutral && (
              <span className="flex items-center text-green-600">
                <span className="mr-1">🌱</span>
                Neutre carbone
              </span>
            )}
            {hotel.sustainability.localSourcing && (
              <span className="flex items-center text-green-600">
                <span className="mr-1">🌾</span>
                Produits locaux
              </span>
            )}
          </div>
        </div>

        {/* Carbon Footprint */}
        <div className="mb-3">
          <CarbonFootprint 
            carbonFootprint={totalCarbonFootprint}
            size="sm"
          />
        </div>

        {/* Amenities */}
        {hotel.amenities.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {hotel.amenities.slice(0, 4).map((amenity) => (
                <span 
                  key={amenity}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {amenity}
                </span>
              ))}
              {hotel.amenities.length > 4 && (
                <span className="text-xs text-gray-500">
                  +{hotel.amenities.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price and Booking */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(hotel.pricePerNight, nights)}
            </span>
          </div>
          
          {hotel.bookingUrl && (
            <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
              Voir détails
            </button>
          )}
        </div>
      </div>
    </div>
  );
}