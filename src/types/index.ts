// Re-export all types from individual modules
export * from './transport';
export * from './hotel';
export * from './activity';
export * from './itinerary';
export * from './user';

// Import types for internal use
import type { Hotel } from './hotel';
import type { Activity } from './activity';
import type { TransportRoute } from './transport';

// Common utility types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchFilters {
  query?: string;
  location?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  priceRange?: [number, number];
  ecoScoreRange?: [number, number];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ErrorResponse {
  error: string;
  code: string;
  details?: unknown;
  timestamp: Date;
}

// Carbon footprint calculation types
export interface CarbonCalculation {
  totalEmissions: number; // kg CO2
  breakdown: {
    transport: number;
    accommodation: number;
    activities: number;
  };
  comparison: {
    conventional: number;
    savings: number;
    percentage: number;
  };
  recommendations: string[];
}

// Map and location types
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapMarker {
  id: string;
  type: 'hotel' | 'activity' | 'transport';
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  description?: string;
  ecoScore: number;
  data: Hotel | Activity | TransportRoute;
}