import { backendApi } from './apiClient';
import type { 
  Activity, 
  ActivitySearch, 
  ActivityCategory,
  ActivityFilter,
  PaginatedResponse 
} from '../types';

class ActivityService {
  // Search activities with filters
  async searchActivities(searchParams: ActivitySearch, page: number = 1, limit: number = 20): Promise<PaginatedResponse<Activity>> {
    const response = await backendApi.post<PaginatedResponse<Activity>>('/activities/search', {
      ...searchParams,
      pagination: { page, limit }
    });
    return response.data;
  }

  // Get activity details by ID
  async getActivityDetails(activityId: string): Promise<Activity> {
    const response = await backendApi.get<Activity>(`/activities/${activityId}`);
    return response.data;
  }

  // Get available activity categories
  async getCategories(): Promise<ActivityCategory[]> {
    const response = await backendApi.get<ActivityCategory[]>('/activities/categories');
    return response.data;
  }

  // Get activities by category
  async getActivitiesByCategory(categoryId: string, page: number = 1): Promise<PaginatedResponse<Activity>> {
    const response = await backendApi.get<PaginatedResponse<Activity>>(`/activities/categories/${categoryId}/activities`, {
      params: { page }
    });
    return response.data;
  }

  // Get eco-friendly activity recommendations
  async getEcoRecommendations(
    location: string, 
    date: Date,
    ecoScore: number = 7, 
    limit: number = 10
  ): Promise<Activity[]> {
    const response = await backendApi.get<Activity[]>('/activities/eco-recommendations', {
      params: { 
        location, 
        date: date.toISOString(), 
        ecoScore, 
        limit 
      }
    });
    return response.data;
  }

  // Calculate activity carbon impact
  async calculateCarbonImpact(
    activityId: string, 
    participants: number,
    duration: number
  ): Promise<{ carbonImpact: number; ecoScore: number }> {
    const response = await backendApi.post<{ carbonImpact: number; ecoScore: number }>(
      `/activities/${activityId}/carbon-impact`,
      { participants, duration }
    );
    return response.data;
  }

  // Get activities near location
  async getActivitiesNearby(
    latitude: number,
    longitude: number,
    radius: number = 10,
    limit: number = 20
  ): Promise<Activity[]> {
    const response = await backendApi.get<Activity[]>('/activities/nearby', {
      params: { latitude, longitude, radius, limit }
    });
    return response.data;
  }

  // Filter activities by criteria
  async filterActivities(filters: Partial<ActivityFilter>): Promise<Activity[]> {
    const response = await backendApi.post<Activity[]>('/activities/filter', filters);
    return response.data;
  }

  // Get seasonal activities
  async getSeasonalActivities(season: string, location?: string): Promise<Activity[]> {
    const response = await backendApi.get<Activity[]>('/activities/seasonal', {
      params: { season, location }
    });
    return response.data;
  }
}

// Mock data for development
export const mockActivityCategories: ActivityCategory[] = [
  {
    id: 'nature',
    name: 'Nature & Randonnée',
    icon: '🥾',
    description: 'Activités de plein air respectueuses de l\'environnement'
  },
  {
    id: 'cultural',
    name: 'Culture & Patrimoine',
    icon: '🏛️',
    description: 'Découverte du patrimoine local et des traditions'
  },
  {
    id: 'adventure',
    name: 'Aventure Douce',
    icon: '🚴',
    description: 'Activités sportives à faible impact environnemental'
  },
  {
    id: 'wellness',
    name: 'Bien-être',
    icon: '🧘',
    description: 'Activités de détente en harmonie avec la nature'
  },
  {
    id: 'educational',
    name: 'Éducatif',
    icon: '🎓',
    description: 'Apprentissage et sensibilisation à l\'environnement'
  }
];

export const mockActivities: Activity[] = [
  {
    id: 'activity-1',
    name: 'Randonnée Guidée - Sentier des Glaciers',
    description: 'Découverte des glaciers alpins avec un guide local certifié. Sensibilisation à l\'impact climatique.',
    location: {
      id: 'loc-chamonix-trail',
      name: 'Sentier des Glaciers',
      address: 'Départ téléphérique Aiguille du Midi, Chamonix',
      latitude: 45.9053,
      longitude: 6.8946,
      country: 'France',
      city: 'Chamonix'
    },
    category: mockActivityCategories[0],
    images: ['/images/activities/glacier-trail-1.jpg'],
    duration: 240, // 4 hours
    price: 65,
    ecoScore: 8.5,
    carbonImpact: 2.1, // kg CO2
    groupSize: { min: 4, max: 12 },
    difficulty: 'moderate',
    seasonality: [
      { id: 'summer', name: 'summer', months: [6, 7, 8, 9] },
      { id: 'autumn', name: 'autumn', months: [9, 10] }
    ],
    tags: ['nature', 'éducatif', 'montagne', 'glacier'],
    sustainability: {
      supportsLocalCommunity: true,
      environmentallyFriendly: true,
      educationalValue: true,
      wildlifeConservation: true,
      culturalPreservation: false
    },
    provider: {
      name: 'Guides de Chamonix',
      rating: 4.7,
      certifications: ['Guide Montagne Certifié', 'Éco-guide']
    }
  }
];

export const activityService = new ActivityService();