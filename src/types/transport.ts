export interface TransportMode {
  id: string;
  name: string;
  type: 'train' | 'bus' | 'car' | 'plane' | 'bike' | 'walk';
  carbonEmissionPerKm: number; // kg CO2 per km
  icon: string;
  ecoScore: number; // 1-10, 10 being most eco-friendly
}

export interface TransportRoute {
  id: string;
  origin: Place;
  destination: Place;
  transportMode: TransportMode;
  distance: number; // in km
  duration: number; // in minutes
  price: number; // in euros
  carbonFootprint: number; // total kg CO2
  ecoScore: number; // calculated based on carbon footprint
  provider?: string;
  departureTime?: Date;
  arrivalTime?: Date;
  bookingUrl?: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  country: string;
  city: string;
}

export interface RouteSearch {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengers: number;
  transportTypes: TransportMode['type'][];
  maxPrice?: number;
  sortBy: 'eco' | 'price' | 'duration';
}

export interface RouteComparison {
  routes: TransportRoute[];
  summary: {
    mostEcoFriendly: TransportRoute;
    fastest: TransportRoute;
    cheapest: TransportRoute;
    totalCarbonSaved: number; // compared to worst option
  };
}