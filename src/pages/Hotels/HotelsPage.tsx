import { useState, useEffect } from 'react';
import type { Hotel, HotelSearch } from '../../types';
import { mockEcoLabels, mockHotels } from '../../services';
import { 
  HotelCard, 
  FilterPanel, 
  SearchInput, 
  CheckboxFilter, 
  RangeSlider, 
  Button, 
  LoadingSpinner, 
  Alert 
} from '../../components/ui';

export default function HotelsPage() {
  const [searchParams, setSearchParams] = useState<HotelSearch>({
    location: '',
    checkIn: new Date(),
    checkOut: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // tomorrow
    guests: 2,
    rooms: 1,
    sortBy: 'eco'
  });

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [ecoScoreRange, setEcoScoreRange] = useState<[number, number]>([0, 10]);
  const [selectedEcoLabels, setSelectedEcoLabels] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sustainabilityFilters, setSustainabilityFilters] = useState({
    renewable: false,
    carbonNeutral: false,
    localSourcing: false,
    waterConservation: false,
    wasteReduction: false
  });

  // Mock data for development
  useEffect(() => {
    const expandedMockHotels: Hotel[] = [
      ...mockHotels,
      {
        id: 'hotel-2',
        name: 'Hôtel Écologique Nice',
        location: {
          id: 'loc-nice',
          name: 'Nice Centre',
          address: '45 Promenade des Anglais, 06000 Nice',
          latitude: 43.6962,
          longitude: 7.2644,
          country: 'France',
          city: 'Nice'
        } as unknown as Hotel['location'],
        description: 'Hôtel moderne avec certification Green Key et vue sur la Méditerranée',
        images: ['/images/hotels/eco-nice-1.jpg'],
        rating: 4.2,
        ecoScore: 8.1,
        ecoLabels: [mockEcoLabels[1], mockEcoLabels[2]],
        amenities: ['wifi', 'piscine-naturelle', 'restaurant-bio', 'parking-vélo'],
        pricePerNight: 89,
        carbonFootprint: 8.3,
        sustainability: {
          energySource: 'renewable',
          waterConservation: true,
          wasteReduction: true,
          localSourcing: true,
          carbonNeutral: false
        },
        reviews: {
          overall: 4.2,
          eco: 4.5,
          comfort: 4.0,
          service: 4.3,
          totalReviews: 189
        }
      },
      {
        id: 'hotel-3',
        name: 'B&B Durable Paris',
        location: {
          id: 'loc-paris-marais',
          name: 'Le Marais',
          address: '12 Rue des Rosiers, 75004 Paris',
          latitude: 48.8566,
          longitude: 2.3522,
          country: 'France',
          city: 'Paris'
        } as unknown as Hotel['location'],
        description: 'Bed & Breakfast familial avec produits locaux et architecture éco-responsable',
        images: ['/images/hotels/bb-paris-1.jpg'],
        rating: 4.7,
        ecoScore: 7.8,
        ecoLabels: [mockEcoLabels[0], mockEcoLabels[4]],
        amenities: ['wifi', 'petit-déjeuner-bio', 'vélos-gratuits', 'jardin'],
        pricePerNight: 65,
        carbonFootprint: 6.1,
        sustainability: {
          energySource: 'mixed',
          waterConservation: true,
          wasteReduction: true,
          localSourcing: true,
          carbonNeutral: false
        },
        reviews: {
          overall: 4.7,
          eco: 4.8,
          comfort: 4.5,
          service: 4.9,
          totalReviews: 312
        }
      }
    ];

    setHotels(expandedMockHotels);
  }, []);

  const handleSearch = async () => {
    if (!searchParams.location) {
      setError('Veuillez renseigner une destination');
      return;
    }

    if (searchParams.checkIn >= searchParams.checkOut) {
      setError('La date d\'arrivée doit être antérieure à la date de départ');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call the actual service
      // const result = await hotelService.searchHotels(searchParams);
      // setHotels(result.data);
      
      // For now, simulate search delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err: unknown) {
      console.error('Search error:', err);
      setError('Erreur lors de la recherche d\'hôtels');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHotels = hotels.filter(hotel => {
    // Price filter
    const priceMatch = hotel.pricePerNight >= priceRange[0] && hotel.pricePerNight <= priceRange[1];
    
    // Eco score filter
    const ecoScoreMatch = hotel.ecoScore >= ecoScoreRange[0] && hotel.ecoScore <= ecoScoreRange[1];
    
    // Eco labels filter
    const ecoLabelMatch = selectedEcoLabels.length === 0 || 
      selectedEcoLabels.some(labelId => hotel.ecoLabels.some(label => label.id === labelId));
    
    // Amenities filter
    const amenitiesMatch = selectedAmenities.length === 0 ||
      selectedAmenities.every(amenity => hotel.amenities.includes(amenity));
    
    // Sustainability filters
    const sustainabilityMatch = Object.entries(sustainabilityFilters).every(([key, value]) => {
      if (!value) return true; // Filter not active
      
      switch (key) {
        case 'renewable':
          return hotel.sustainability.energySource === 'renewable';
        case 'carbonNeutral':
          return hotel.sustainability.carbonNeutral;
        case 'localSourcing':
          return hotel.sustainability.localSourcing;
        case 'waterConservation':
          return hotel.sustainability.waterConservation;
        case 'wasteReduction':
          return hotel.sustainability.wasteReduction;
        default:
          return true;
      }
    });
    
    return priceMatch && ecoScoreMatch && ecoLabelMatch && amenitiesMatch && sustainabilityMatch;
  });

  const sortedHotels = [...filteredHotels].sort((a, b) => {
    switch (searchParams.sortBy) {
      case 'eco':
        return b.ecoScore - a.ecoScore;
      case 'price':
        return a.pricePerNight - b.pricePerNight;
      case 'rating':
        return b.rating - a.rating;
      default:
        return b.ecoScore - a.ecoScore;
    }
  });

  const nights = Math.ceil((searchParams.checkOut.getTime() - searchParams.checkIn.getTime()) / (1000 * 60 * 60 * 24));

  const ecoLabelOptions = mockEcoLabels.map(label => ({
    id: label.id,
    label: label.name,
    count: hotels.filter(h => h.ecoLabels.some(l => l.id === label.id)).length
  }));

  const amenityOptions = Array.from(new Set(hotels.flatMap(h => h.amenities)))
    .map(amenity => ({
      id: amenity,
      label: amenity,
      count: hotels.filter(h => h.amenities.includes(amenity)).length
    }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hôtels Écoresponsables
          </h1>
          <p className="text-gray-600">
            Trouvez un hébergement respectueux de l'environnement avec des labels écologiques certifiés
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
            <SearchInput
              placeholder="Destination"
              value={searchParams.location}
              onChange={(value) => setSearchParams({ ...searchParams, location: value })}
              className="lg:col-span-2"
            />
            
            <input
              type="date"
              value={searchParams.checkIn.toISOString().split('T')[0]}
              onChange={(e) => setSearchParams({ 
                ...searchParams, 
                checkIn: new Date(e.target.value) 
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            
            <input
              type="date"
              value={searchParams.checkOut.toISOString().split('T')[0]}
              onChange={(e) => setSearchParams({ 
                ...searchParams, 
                checkOut: new Date(e.target.value) 
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            
            <select
              value={searchParams.guests}
              onChange={(e) => setSearchParams({ 
                ...searchParams, 
                guests: parseInt(e.target.value) 
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} voyageur{num > 1 ? 's' : ''}</option>
              ))}
            </select>
            
            <Button 
              onClick={handleSearch} 
              loading={isLoading}
              className="w-full"
            >
              Rechercher
            </Button>
          </div>

          {/* Sort Options */}
          <div className="flex gap-2">
            {[
              { value: 'eco', label: 'Plus écologique' },
              { value: 'price', label: 'Prix croissant' },
              { value: 'rating', label: 'Mieux noté' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setSearchParams({ ...searchParams, sortBy: option.value as 'eco' | 'price' | 'rating' })}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  searchParams.sortBy === option.value
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <FilterPanel title="Prix par nuit">
                <RangeSlider
                  label="Budget"
                  min={0}
                  max={300}
                  value={priceRange}
                  onChange={setPriceRange}
                  formatValue={(val) => `${val}€`}
                />
              </FilterPanel>

              <FilterPanel title="Score écologique">
                <RangeSlider
                  label="Score minimum"
                  min={0}
                  max={10}
                  step={0.1}
                  value={ecoScoreRange}
                  onChange={setEcoScoreRange}
                  formatValue={(val) => `${val}/10`}
                />
              </FilterPanel>

              <FilterPanel title="Labels écologiques">
                <CheckboxFilter
                  options={ecoLabelOptions}
                  selectedIds={selectedEcoLabels}
                  onChange={setSelectedEcoLabels}
                />
              </FilterPanel>

              <FilterPanel title="Caractéristiques durables">
                <div className="space-y-2">
                  {[
                    { key: 'renewable', label: 'Énergie renouvelable', icon: '⚡' },
                    { key: 'carbonNeutral', label: 'Neutre en carbone', icon: '🌱' },
                    { key: 'localSourcing', label: 'Produits locaux', icon: '🌾' },
                    { key: 'waterConservation', label: 'Économie d\'eau', icon: '💧' },
                    { key: 'wasteReduction', label: 'Réduction déchets', icon: '♻️' }
                  ].map(filter => (
                    <label key={filter.key} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sustainabilityFilters[filter.key as keyof typeof sustainabilityFilters]}
                        onChange={(e) => setSustainabilityFilters({
                          ...sustainabilityFilters,
                          [filter.key]: e.target.checked
                        })}
                        className="mr-3 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 flex items-center">
                        <span className="mr-2">{filter.icon}</span>
                        {filter.label}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterPanel>

              <FilterPanel title="Équipements">
                <CheckboxFilter
                  options={amenityOptions.slice(0, 8)} // Limit display
                  selectedIds={selectedAmenities}
                  onChange={setSelectedAmenities}
                />
              </FilterPanel>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            {error && (
              <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />
            )}

            {isLoading ? (
              <div className="text-center py-12">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Recherche d'hôtels écoresponsables...</p>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    {sortedHotels.length} hôtel{sortedHotels.length > 1 ? 's' : ''} trouvé{sortedHotels.length > 1 ? 's' : ''}
                  </h2>
                  
                  {nights > 1 && (
                    <p className="text-sm text-gray-600">
                      {nights} nuit{nights > 1 ? 's' : ''} • {searchParams.guests} voyageur{searchParams.guests > 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {/* Hotels Grid */}
                {sortedHotels.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <div className="text-6xl mb-4">🏨</div>
                    <p className="text-gray-600 mb-2">Aucun hôtel ne correspond à vos critères</p>
                    <p className="text-sm text-gray-500">Essayez de modifier vos filtres ou votre destination</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedHotels.map((hotel) => (
                      <HotelCard
                        key={hotel.id}
                        hotel={hotel}
                        nights={nights}
                        isSelected={selectedHotelId === hotel.id}
                        onClick={() => setSelectedHotelId(
                          selectedHotelId === hotel.id ? null : hotel.id
                        )}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}