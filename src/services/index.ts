// Re-export all services for easy importing
export { transportService } from './transportService';
export { hotelService } from './hotelService';
export { activityService } from './activityService';
export { itineraryService, carbonService } from './itineraryService';
export { backendApi, weatherApi, openTripMapApi } from './apiClient';
export { externalApiService } from './externalApiService';
export { carbonCalculator, EMISSION_FACTORS } from './carbonCalculator';

// Mock data exports
export { mockTransportModes } from './transportService';
export { mockEcoLabels, mockHotels } from './hotelService';
export { mockActivityCategories, mockActivities } from './activityService';