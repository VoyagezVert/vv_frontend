import { useState, useEffect } from 'react';
import type { TransportRoute, RouteSearch, RouteComparison } from '../../types';
import { mockTransportModes } from '../../services';
import { 
  TransportCard, 
  FilterPanel, 
  SearchInput, 
  CheckboxFilter, 
  RangeSlider, 
  Button, 
  LoadingSpinner, 
  Alert 
} from '../../components/ui';

export default function TransportPage() {
  const [searchParams, setSearchParams] = useState<RouteSearch>({
    origin: '',
    destination: '',
    departureDate: new Date(),
    passengers: 1,
    transportTypes: [],
    sortBy: 'eco'
  });

  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [comparison, setComparison] = useState<RouteComparison | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  // Filter states
  const [maxPrice, setMaxPrice] = useState<[number, number]>([0, 500]);
  const [selectedTransportTypes, setSelectedTransportTypes] = useState<string[]>([]);

  // Mock data for development
  useEffect(() => {
    // Initialize with mock routes for demonstration
    const mockRoutes: TransportRoute[] = [
      {
        id: 'route-1',
        origin: {
          id: 'paris',
          name: 'Paris Gare de Lyon',
          address: 'Place Louis Armand, 75012 Paris',
          latitude: 48.8439,
          longitude: 2.3724,
          country: 'France',
          city: 'Paris'
        },
        destination: {
          id: 'lyon',
          name: 'Lyon Part-Dieu',
          address: 'Place Charles Béraudier, 69003 Lyon',
          latitude: 45.7603,
          longitude: 4.8590,
          country: 'France',
          city: 'Lyon'
        },
        transportMode: mockTransportModes[0], // Train
        distance: 462,
        duration: 120, // 2 hours
        price: 89,
        carbonFootprint: 18.9, // kg CO2
        ecoScore: 9.2,
        provider: 'SNCF Connect',
        departureTime: new Date(2025, 11, 15, 9, 0),
        arrivalTime: new Date(2025, 11, 15, 11, 0),
        bookingUrl: 'https://www.oui.sncf'
      },
      {
        id: 'route-2',
        origin: {
          id: 'paris',
          name: 'Paris Orly',
          address: 'Aéroport Orly, 94390 Orly',
          latitude: 48.7262,
          longitude: 2.3656,
          country: 'France',
          city: 'Paris'
        },
        destination: {
          id: 'lyon',
          name: 'Lyon Saint-Exupéry',
          address: 'Aéroport Lyon Saint-Exupéry, 69125 Colombier-Saugnieu',
          latitude: 45.7256,
          longitude: 5.0811,
          country: 'France',
          city: 'Lyon'
        },
        transportMode: mockTransportModes[3], // Plane
        distance: 462,
        duration: 80, // 1h20
        price: 159,
        carbonFootprint: 117.8, // kg CO2
        ecoScore: 2.1,
        provider: 'Air France',
        departureTime: new Date(2025, 11, 15, 10, 30),
        arrivalTime: new Date(2025, 11, 15, 11, 50),
        bookingUrl: 'https://www.airfrance.fr'
      },
      {
        id: 'route-3',
        origin: {
          id: 'paris',
          name: 'Paris Bercy',
          address: 'Gare de Paris Bercy, 75012 Paris',
          latitude: 48.8398,
          longitude: 2.3846,
          country: 'France',
          city: 'Paris'
        },
        destination: {
          id: 'lyon',
          name: 'Lyon Part-Dieu',
          address: 'Place Charles Béraudier, 69003 Lyon',
          latitude: 45.7603,
          longitude: 4.8590,
          country: 'France',
          city: 'Lyon'
        },
        transportMode: mockTransportModes[1], // Bus
        distance: 462,
        duration: 360, // 6 hours
        price: 25,
        carbonFootprint: 41.1, // kg CO2
        ecoScore: 7.3,
        provider: 'FlixBus',
        departureTime: new Date(2025, 11, 15, 8, 0),
        arrivalTime: new Date(2025, 11, 15, 14, 0),
        bookingUrl: 'https://www.flixbus.fr'
      }
    ];

    setRoutes(mockRoutes);
    setComparison({
      routes: mockRoutes,
      summary: {
        mostEcoFriendly: mockRoutes[0],
        fastest: mockRoutes[1],
        cheapest: mockRoutes[2],
        totalCarbonSaved: 98.9 // compared to worst option (plane)
      }
    });
  }, []);

  const handleSearch = async () => {
    if (!searchParams.origin || !searchParams.destination) {
      setError('Veuillez renseigner une origine et une destination');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call the actual service
      // const result = await transportService.searchRoutes(searchParams);
      // setRoutes(result.routes);
      // setComparison(result);
      
      // For now, simulate search delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err: unknown) {
      console.error('Search error:', err);
      setError('Erreur lors de la recherche des trajets');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRoutes = routes.filter(route => {
    const priceMatch = route.price >= maxPrice[0] && route.price <= maxPrice[1];
    const typeMatch = selectedTransportTypes.length === 0 || 
      selectedTransportTypes.includes(route.transportMode.type);
    return priceMatch && typeMatch;
  });

  const sortedRoutes = [...filteredRoutes].sort((a, b) => {
    switch (searchParams.sortBy) {
      case 'eco':
        return b.ecoScore - a.ecoScore;
      case 'price':
        return a.price - b.price;
      case 'duration':
        return a.duration - b.duration;
      default:
        return b.ecoScore - a.ecoScore;
    }
  });

  const transportTypeOptions = mockTransportModes.map(mode => ({
    id: mode.type,
    label: mode.name,
    count: routes.filter(r => r.transportMode.type === mode.type).length
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Recherche de Trajets Écoresponsables
          </h1>
          <p className="text-gray-600">
            Comparez les moyens de transport selon leur impact environnemental
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <SearchInput
              placeholder="Origine"
              value={searchParams.origin}
              onChange={(value) => setSearchParams({ ...searchParams, origin: value })}
            />
            
            <SearchInput
              placeholder="Destination"
              value={searchParams.destination}
              onChange={(value) => setSearchParams({ ...searchParams, destination: value })}
            />
            
            <input
              type="date"
              value={searchParams.departureDate.toISOString().split('T')[0]}
              onChange={(e) => setSearchParams({ 
                ...searchParams, 
                departureDate: new Date(e.target.value) 
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            
            <select
              value={searchParams.passengers}
              onChange={(e) => setSearchParams({ 
                ...searchParams, 
                passengers: parseInt(e.target.value) 
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} passager{num > 1 ? 's' : ''}</option>
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
              { value: 'price', label: 'Moins cher' },
              { value: 'duration', label: 'Plus rapide' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setSearchParams({ ...searchParams, sortBy: option.value as 'eco' | 'price' | 'duration' })}
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
              <FilterPanel title="Prix">
                <RangeSlider
                  label="Budget maximum"
                  min={0}
                  max={500}
                  value={maxPrice}
                  onChange={setMaxPrice}
                  formatValue={(val) => `${val}€`}
                />
              </FilterPanel>

              <FilterPanel title="Moyens de transport">
                <CheckboxFilter
                  options={transportTypeOptions}
                  selectedIds={selectedTransportTypes}
                  onChange={setSelectedTransportTypes}
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
                <p className="mt-4 text-gray-600">Recherche des meilleurs trajets...</p>
              </div>
            ) : (
              <>
                {/* Summary */}
                {comparison && (
                  <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Résumé de la recherche</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-green-600 text-2xl mb-2">🌱</div>
                        <div className="text-sm text-gray-600">Plus écologique</div>
                        <div className="font-semibold">{comparison.summary.mostEcoFriendly.transportMode.name}</div>
                        <div className="text-sm text-green-600">Score: {comparison.summary.mostEcoFriendly.ecoScore}/10</div>
                      </div>
                      
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-blue-600 text-2xl mb-2">⚡</div>
                        <div className="text-sm text-gray-600">Plus rapide</div>
                        <div className="font-semibold">{comparison.summary.fastest.transportMode.name}</div>
                        <div className="text-sm text-blue-600">{Math.floor(comparison.summary.fastest.duration / 60)}h {comparison.summary.fastest.duration % 60}min</div>
                      </div>
                      
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-yellow-600 text-2xl mb-2">💰</div>
                        <div className="text-sm text-gray-600">Moins cher</div>
                        <div className="font-semibold">{comparison.summary.cheapest.transportMode.name}</div>
                        <div className="text-sm text-yellow-600">{comparison.summary.cheapest.price}€</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Routes List */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      {sortedRoutes.length} trajet{sortedRoutes.length > 1 ? 's' : ''} trouvé{sortedRoutes.length > 1 ? 's' : ''}
                    </h2>
                  </div>

                  {sortedRoutes.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border">
                      <p className="text-gray-600">Aucun trajet ne correspond à vos critères</p>
                    </div>
                  ) : (
                    sortedRoutes.map((route) => (
                      <TransportCard
                        key={route.id}
                        route={route}
                        isSelected={selectedRouteId === route.id}
                        onClick={() => setSelectedRouteId(
                          selectedRouteId === route.id ? null : route.id
                        )}
                        showComparison={true}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}