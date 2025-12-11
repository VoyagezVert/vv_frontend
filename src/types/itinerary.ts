export interface Itinerary {
  id: string;
  name: string;
  description?: string;
  userId: string;
  destination: Place;
  startDate: Date;
  endDate: Date;
  totalDuration: number; // in days
  status: 'draft' | 'confirmed' | 'completed' | 'cancelled';
  budget: {
    total: number;
    spent: number;
    currency: string;
  };
  ecoScore: number; // overall eco score
  carbonFootprint: number; // total kg CO2
  carbonSaved: number; // compared to conventional options
  participants: number;
  items: ItineraryItem[];
  summary: ItinerarySummary;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItineraryItem {
  id: string;
  type: 'transport' | 'accommodation' | 'activity';
  date: Date;
  startTime?: Date;
  endTime?: Date;
  order: number;
  data: TransportRoute | Hotel | Activity;
  status: 'planned' | 'booked' | 'completed' | 'cancelled';
  notes?: string;
  cost: number;
  carbonFootprint: number;
  ecoScore: number;
}

export interface ItinerarySummary {
  totalCost: number;
  totalCarbonFootprint: number;
  averageEcoScore: number;
  accommodationNights: number;
  activitiesCount: number;
  transportRoutes: number;
  topEcoChoices: ItineraryItem[];
  improvementSuggestions: string[];
}

export interface ItineraryOptimization {
  currentScore: number;
  optimizedScore: number;
  suggestions: OptimizationSuggestion[];
  alternativeItems: ItineraryItem[];
  potentialSavings: {
    carbon: number;
    cost: number;
  };
}

export interface OptimizationSuggestion {
  id: string;
  type: 'transport' | 'accommodation' | 'activity' | 'general';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  impact: {
    carbonReduction: number;
    costChange: number;
    ecoScoreImprovement: number;
  };
  alternative?: ItineraryItem;
}

export interface TripPlan {
  destination: string;
  dates: {
    start: Date;
    end: Date;
  };
  preferences: {
    budget: number;
    ecoFriendliness: number; // 1-10 priority
    comfort: number; // 1-10 priority
    adventure: number; // 1-10 priority
    culture: number; // 1-10 priority
  };
  requirements: {
    groupSize: number;
    accessibility: boolean;
    dietaryRestrictions: string[];
    languages: string[];
  };
}

// Import related types
import type { Place, TransportRoute } from './transport';
import type { Hotel } from './hotel';
import type { Activity } from './activity';

// Re-export related types
export type { Place, TransportRoute } from './transport';
export type { Hotel } from './hotel';
export type { Activity } from './activity';