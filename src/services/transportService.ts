import { backendApi } from './apiClient';
import type { 
  TransportRoute, 
  TransportMode, 
  RouteSearch, 
  RouteComparison
} from '../types';

class TransportService {
  // Get available transport modes
  async getTransportModes(): Promise<TransportMode[]> {
    const response = await backendApi.get<TransportMode[]>('/transport/modes');
    return response.data;
  }

  // Search for transport routes
  async searchRoutes(searchParams: RouteSearch): Promise<RouteComparison> {
    const response = await backendApi.post<RouteComparison>('/transport/search', searchParams);
    return response.data;
  }

  // Get specific route details
  async getRouteDetails(routeId: string): Promise<TransportRoute> {
    const response = await backendApi.get<TransportRoute>(`/transport/routes/${routeId}`);
    return response.data;
  }

  // Compare multiple routes
  async compareRoutes(routeIds: string[]): Promise<RouteComparison> {
    const response = await backendApi.post<RouteComparison>('/transport/compare', { routeIds });
    return response.data;
  }

  // Get route suggestions based on eco-friendliness
  async getEcoRoutes(origin: string, destination: string, date: Date): Promise<TransportRoute[]> {
    const response = await backendApi.get<TransportRoute[]>('/transport/eco-routes', {
      params: { origin, destination, date: date.toISOString() }
    });
    return response.data;
  }

  // Calculate carbon footprint for a route
  async calculateCarbonFootprint(
    transportMode: string, 
    distance: number, 
    passengers: number = 1
  ): Promise<{ carbonFootprint: number; ecoScore: number }> {
    const response = await backendApi.post<{ carbonFootprint: number; ecoScore: number }>(
      '/transport/carbon-footprint',
      { transportMode, distance, passengers }
    );
    return response.data;
  }

  // Get popular destinations
  async getPopularDestinations(limit: number = 10): Promise<Location[]> {
    const response = await backendApi.get<Location[]>('/transport/popular-destinations', {
      params: { limit }
    });
    return response.data;
  }

  // Search locations for autocomplete
  async searchLocations(query: string, limit: number = 5): Promise<Location[]> {
    const response = await backendApi.get<Location[]>('/transport/locations/search', {
      params: { q: query, limit }
    });
    return response.data;
  }
}

// Mock data for development
export const mockTransportModes: TransportMode[] = [
  {
    id: 'train',
    name: 'Train',
    type: 'train',
    carbonEmissionPerKm: 0.041, // kg CO2 per km per passenger
    icon: '🚆',
    ecoScore: 9
  },
  {
    id: 'bus',
    name: 'Bus',
    type: 'bus',
    carbonEmissionPerKm: 0.089,
    icon: '🚌',
    ecoScore: 7
  },
  {
    id: 'car',
    name: 'Voiture',
    type: 'car',
    carbonEmissionPerKm: 0.171,
    icon: '🚗',
    ecoScore: 4
  },
  {
    id: 'plane',
    name: 'Avion',
    type: 'plane',
    carbonEmissionPerKm: 0.255,
    icon: '✈️',
    ecoScore: 2
  },
  {
    id: 'bike',
    name: 'Vélo',
    type: 'bike',
    carbonEmissionPerKm: 0,
    icon: '🚴',
    ecoScore: 10
  },
  {
    id: 'walk',
    name: 'Marche',
    type: 'walk',
    carbonEmissionPerKm: 0,
    icon: '🚶',
    ecoScore: 10
  }
];

export const transportService = new TransportService();