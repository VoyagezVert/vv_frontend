export type UserRole = 'traveler' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  preferences: UserPreferences;
  ecoProfile: EcoProfile;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface UserPreferences {
  currency: 'EUR' | 'USD' | 'GBP';
  language: 'fr' | 'en' | 'es' | 'de';
  units: 'metric' | 'imperial';
  notifications: {
    email: boolean;
    push: boolean;
    ecoTips: boolean;
    bookingReminders: boolean;
    priceAlerts: boolean;
  };
  travel: {
    defaultBudget: number;
    preferredTransport: string[];
    accessibilityNeeds: boolean;
    dietaryRestrictions: string[];
    accommodationPreferences: string[];
  };
  privacy: {
    shareProfile: boolean;
    shareTrips: boolean;
    allowRecommendations: boolean;
  };
}

export interface EcoProfile {
  ecoScore: number; // overall user eco score based on trip history
  carbonFootprint: {
    total: number; // lifetime total kg CO2
    thisYear: number;
    thisMonth: number;
    average: number; // per trip
  };
  achievements: EcoAchievement[];
  goals: EcoGoal[];
  stats: {
    totalTrips: number;
    ecoTrips: number; // trips with high eco score
    carbonSaved: number; // compared to conventional options
    favoriteEcoTransport: string;
    treesEquivalent: number; // carbon saved equivalent
  };
}

export interface EcoAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'transport' | 'accommodation' | 'activities' | 'general';
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt: Date;
  progress?: {
    current: number;
    target: number;
    unit: string;
  };
}

export interface EcoGoal {
  id: string;
  title: string;
  description: string;
  type: 'carbon_reduction' | 'eco_score' | 'sustainable_trips' | 'local_activities';
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
}

export interface AdminUser extends User {
  role: 'admin';
  permissions: AdminPermission[];
  adminProfile: {
    department: string;
    lastActivity: Date;
    accessLevel: 'read' | 'write' | 'admin';
  };
}

export interface AdminPermission {
  resource: 'hotels' | 'activities' | 'transport' | 'users' | 'content' | 'analytics';
  actions: ('create' | 'read' | 'update' | 'delete' | 'moderate')[];
}

// Enhanced auth interfaces
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  preferences?: Partial<UserPreferences>;
}