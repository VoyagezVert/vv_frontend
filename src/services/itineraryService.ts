import { backendApi } from './apiClient';
import type { 
  Itinerary, 
  ItineraryItem,
  ItineraryOptimization,
  TripPlan,
  CarbonCalculation,
  PaginatedResponse 
} from '../types';

class ItineraryService {
  // Get user's itineraries
  async getUserItineraries(userId: string, page: number = 1): Promise<PaginatedResponse<Itinerary>> {
    const response = await backendApi.get<PaginatedResponse<Itinerary>>(`/users/${userId}/itineraries`, {
      params: { page }
    });
    return response.data;
  }

  // Create new itinerary
  async createItinerary(tripPlan: TripPlan): Promise<Itinerary> {
    const response = await backendApi.post<Itinerary>('/itineraries', tripPlan);
    return response.data;
  }

  // Get itinerary details
  async getItinerary(itineraryId: string): Promise<Itinerary> {
    const response = await backendApi.get<Itinerary>(`/itineraries/${itineraryId}`);
    return response.data;
  }

  // Update itinerary
  async updateItinerary(itineraryId: string, updates: Partial<Itinerary>): Promise<Itinerary> {
    const response = await backendApi.patch<Itinerary>(`/itineraries/${itineraryId}`, updates);
    return response.data;
  }

  // Delete itinerary
  async deleteItinerary(itineraryId: string): Promise<void> {
    await backendApi.delete(`/itineraries/${itineraryId}`);
  }

  // Add item to itinerary
  async addItineraryItem(itineraryId: string, item: Omit<ItineraryItem, 'id'>): Promise<ItineraryItem> {
    const response = await backendApi.post<ItineraryItem>(`/itineraries/${itineraryId}/items`, item);
    return response.data;
  }

  // Update itinerary item
  async updateItineraryItem(
    itineraryId: string, 
    itemId: string, 
    updates: Partial<ItineraryItem>
  ): Promise<ItineraryItem> {
    const response = await backendApi.patch<ItineraryItem>(
      `/itineraries/${itineraryId}/items/${itemId}`, 
      updates
    );
    return response.data;
  }

  // Remove item from itinerary
  async removeItineraryItem(itineraryId: string, itemId: string): Promise<void> {
    await backendApi.delete(`/itineraries/${itineraryId}/items/${itemId}`);
  }

  // Reorder itinerary items
  async reorderItineraryItems(
    itineraryId: string, 
    items: { id: string; order: number }[]
  ): Promise<ItineraryItem[]> {
    const response = await backendApi.put<ItineraryItem[]>(
      `/itineraries/${itineraryId}/items/reorder`, 
      { items }
    );
    return response.data;
  }

  // Optimize itinerary for eco-friendliness
  async optimizeItinerary(itineraryId: string): Promise<ItineraryOptimization> {
    const response = await backendApi.post<ItineraryOptimization>(
      `/itineraries/${itineraryId}/optimize`
    );
    return response.data;
  }

  // Calculate total carbon footprint
  async calculateCarbonFootprint(itineraryId: string): Promise<CarbonCalculation> {
    const response = await backendApi.get<CarbonCalculation>(
      `/itineraries/${itineraryId}/carbon-footprint`
    );
    return response.data;
  }

  // Get alternative suggestions for itinerary item
  async getAlternatives(
    itineraryId: string, 
    itemId: string,
    type: 'eco' | 'budget' | 'comfort'
  ): Promise<ItineraryItem[]> {
    const response = await backendApi.get<ItineraryItem[]>(
      `/itineraries/${itineraryId}/items/${itemId}/alternatives`,
      { params: { type } }
    );
    return response.data;
  }

  // Share itinerary
  async shareItinerary(itineraryId: string, emails: string[]): Promise<{ shareUrl: string }> {
    const response = await backendApi.post<{ shareUrl: string }>(
      `/itineraries/${itineraryId}/share`,
      { emails }
    );
    return response.data;
  }

  // Clone itinerary
  async cloneItinerary(itineraryId: string, newName?: string): Promise<Itinerary> {
    const response = await backendApi.post<Itinerary>(
      `/itineraries/${itineraryId}/clone`,
      { name: newName }
    );
    return response.data;
  }
}

// Carbon footprint calculation service
class CarbonService {
  // Calculate transport carbon footprint
  async calculateTransportEmissions(
    mode: string,
    distance: number,
    passengers: number = 1
  ): Promise<number> {
    const response = await backendApi.post<{ emissions: number }>('/carbon/transport', {
      mode,
      distance,
      passengers
    });
    return response.data.emissions;
  }

  // Calculate accommodation emissions
  async calculateAccommodationEmissions(
    hotelId: string,
    nights: number,
    guests: number
  ): Promise<number> {
    const response = await backendApi.post<{ emissions: number }>('/carbon/accommodation', {
      hotelId,
      nights,
      guests
    });
    return response.data.emissions;
  }

  // Calculate activity emissions
  async calculateActivityEmissions(
    activityId: string,
    participants: number,
    duration: number
  ): Promise<number> {
    const response = await backendApi.post<{ emissions: number }>('/carbon/activity', {
      activityId,
      participants,
      duration
    });
    return response.data.emissions;
  }

  // Get carbon offset recommendations
  async getCarbonOffsetOptions(totalEmissions: number): Promise<{
    options: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      type: 'forest' | 'renewable' | 'technology';
      certification: string;
    }>;
  }> {
    const response = await backendApi.get<{
      options: Array<{
        id: string;
        name: string;
        description: string;
        price: number;
        type: 'forest' | 'renewable' | 'technology';
        certification: string;
      }>;
    }>(`/carbon/offsets`, {
      params: { emissions: totalEmissions }
    });
    return response.data;
  }
}

export const itineraryService = new ItineraryService();
export const carbonService = new CarbonService();