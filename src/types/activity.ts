import type { Place } from './transport';

export interface ActivityCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Season {
  id: string;
  name: 'spring' | 'summer' | 'autumn' | 'winter';
  months: number[]; // month numbers (1-12)
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  location: Place;
  category: ActivityCategory;
  images: string[];
  duration: number; // in minutes
  price: number;
  ecoScore: number; // 1-10
  carbonImpact: number; // kg CO2
  groupSize: {
    min: number;
    max: number;
  };
  difficulty: 'easy' | 'moderate' | 'challenging';
  seasonality: Season[];
  tags: string[];
  sustainability: {
    supportsLocalCommunity: boolean;
    environmentallyFriendly: boolean;
    educationalValue: boolean;
    wildlifeConservation: boolean;
    culturalPreservation: boolean;
  };
  provider: {
    name: string;
    rating: number;
    certifications: string[];
  };
  bookingUrl?: string;
  availableDates?: Date[];
}

export interface ActivitySearch {
  location: string;
  date: Date;
  duration?: number; // preferred duration in hours
  groupSize: number;
  categories: string[];
  maxPrice?: number;
  minEcoScore?: number;
  difficulty: ('easy' | 'moderate' | 'challenging')[];
  sortBy: 'eco' | 'price' | 'rating' | 'duration';
  radius?: number;
}

export interface ActivityFilter {
  categories: ActivityCategory[];
  priceRange: [number, number];
  ecoScoreRange: [number, number];
  duration: [number, number]; // min and max hours
  difficulty: ('easy' | 'moderate' | 'challenging')[];
  sustainability: Partial<Activity['sustainability']>;
  seasons: Season[];
}