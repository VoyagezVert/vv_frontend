import type { Place } from './transport';

export interface EcoLabel {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'environmental' | 'social' | 'economic';
  weight: number; // importance weight for scoring
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  location: Place;
  images: string[];
  rating: number; // 1-5 stars
  ecoScore: number; // 1-10 eco-friendly score
  ecoLabels: EcoLabel[];
  amenities: string[];
  pricePerNight: number;
  carbonFootprint: number; // kg CO2 per night
  sustainability: {
    energySource: 'renewable' | 'mixed' | 'fossil';
    waterConservation: boolean;
    wasteReduction: boolean;
    localSourcing: boolean;
    carbonNeutral: boolean;
  };
  reviews: {
    overall: number;
    eco: number;
    comfort: number;
    service: number;
    totalReviews: number;
  };
  bookingUrl?: string;
  availableFrom?: Date;
  availableTo?: Date;
}

export interface HotelSearch {
  location: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  rooms: number;
  minEcoScore?: number;
  maxPrice?: number;
  ecoLabels?: string[]; // filter by specific eco labels
  amenities?: string[];
  sortBy: 'eco' | 'price' | 'rating' | 'distance';
  radius?: number; // search radius in km
}

export interface HotelFilter {
  ecoLabels: EcoLabel[];
  priceRange: [number, number];
  ecoScoreRange: [number, number];
  sustainability: Partial<Hotel['sustainability']>;
  amenities: string[];
  rating: number;
}