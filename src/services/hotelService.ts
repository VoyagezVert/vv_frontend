import { backendApi } from './apiClient';
import type { 
  Hotel, 
  HotelSearch, 
  HotelFilter,
  EcoLabel,
  PaginatedResponse 
} from '../types';

class HotelService {
  // Search hotels with filters
  async searchHotels(searchParams: HotelSearch, page: number = 1, limit: number = 20): Promise<PaginatedResponse<Hotel>> {
    const response = await backendApi.post<PaginatedResponse<Hotel>>('/hotels/search', {
      ...searchParams,
      pagination: { page, limit }
    });
    return response.data;
  }

  // Get hotel details by ID
  async getHotelDetails(hotelId: string): Promise<Hotel> {
    const response = await backendApi.get<Hotel>(`/hotels/${hotelId}`);
    return response.data;
  }

  // Get available eco labels
  async getEcoLabels(): Promise<EcoLabel[]> {
    const response = await backendApi.get<EcoLabel[]>('/hotels/eco-labels');
    return response.data;
  }

  // Get hotels by eco label
  async getHotelsByEcoLabel(labelId: string, page: number = 1): Promise<PaginatedResponse<Hotel>> {
    const response = await backendApi.get<PaginatedResponse<Hotel>>(`/hotels/eco-labels/${labelId}/hotels`, {
      params: { page }
    });
    return response.data;
  }

  // Get hotel recommendations based on location and preferences
  async getRecommendations(
    location: string, 
    ecoScore: number = 7, 
    limit: number = 10
  ): Promise<Hotel[]> {
    const response = await backendApi.get<Hotel[]>('/hotels/recommendations', {
      params: { location, ecoScore, limit }
    });
    return response.data;
  }

  // Get popular eco-friendly hotels
  async getPopularEcoHotels(limit: number = 10): Promise<Hotel[]> {
    const response = await backendApi.get<Hotel[]>('/hotels/popular-eco', {
      params: { limit }
    });
    return response.data;
  }

  // Calculate hotel carbon footprint per night
  async calculateHotelCarbonFootprint(
    hotelId: string, 
    nights: number, 
    guests: number
  ): Promise<{ carbonFootprint: number; ecoScore: number }> {
    const response = await backendApi.post<{ carbonFootprint: number; ecoScore: number }>(
      `/hotels/${hotelId}/carbon-footprint`,
      { nights, guests }
    );
    return response.data;
  }

  // Filter hotels by criteria
  async filterHotels(filters: Partial<HotelFilter>): Promise<Hotel[]> {
    const response = await backendApi.post<Hotel[]>('/hotels/filter', filters);
    return response.data;
  }
}

// Mock data for development
export const mockEcoLabels: EcoLabel[] = [
  {
    id: 'eu-ecolabel',
    name: 'EU Ecolabel',
    description: 'Label écologique officiel de l\'Union européenne',
    icon: '🌿',
    category: 'environmental',
    weight: 0.9
  },
  {
    id: 'green-key',
    name: 'Green Key',
    description: 'Certification internationale pour le tourisme durable',
    icon: '🔑',
    category: 'environmental',
    weight: 0.8
  },
  {
    id: 'travelife',
    name: 'Travelife',
    description: 'Certification pour la durabilité dans le tourisme',
    icon: '🌍',
    category: 'social',
    weight: 0.7
  },
  {
    id: 'iso14001',
    name: 'ISO 14001',
    description: 'Norme de management environnemental',
    icon: '📋',
    category: 'environmental',
    weight: 0.85
  },
  {
    id: 'biosphere',
    name: 'Biosphere',
    description: 'Certification pour le tourisme responsable',
    icon: '🌱',
    category: 'environmental',
    weight: 0.75
  }
];

export const mockHotels: Hotel[] = [
  {
    id: 'hotel-1',
    name: 'Éco-Lodge des Alpes',
    location: {
      id: 'loc-chamonix',
      name: 'Chamonix, France',
      address: 'Centre-ville de Chamonix',
      latitude: 45.9237,
      longitude: 6.8694,
      country: 'France',
      city: 'Chamonix'
    },
    description: 'Un lodge écologique au cœur des Alpes, utilisant 100% d\'énergie renouvelable',
    images: ['/images/hotels/eco-lodge-1.jpg'],
    rating: 4.5,
    ecoScore: 9.2,
    ecoLabels: [mockEcoLabels[0], mockEcoLabels[1]],
    amenities: ['wifi', 'restaurant-bio', 'spa-naturel', 'vélos-gratuits'],
    pricePerNight: 120,
    carbonFootprint: 5.2,
    sustainability: {
      energySource: 'renewable',
      waterConservation: true,
      wasteReduction: true,
      localSourcing: true,
      carbonNeutral: true
    },
    reviews: {
      overall: 4.5,
      eco: 4.8,
      comfort: 4.3,
      service: 4.6,
      totalReviews: 245
    }
  }
];

export const hotelService = new HotelService();