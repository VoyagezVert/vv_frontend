import { weatherApi, openTripMapApi } from './apiClient';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface WeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

interface POI {
  xid: string;
  name: string;
  wikidata?: string;
  rate: string;
  kinds: string;
  dist: number;
  point: {
    lon: number;
    lat: number;
  };
}

class ExternalApiService {
  private readonly OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo_key';
  private readonly OPENTRIPMAP_API_KEY = import.meta.env.VITE_OPENTRIPMAP_API_KEY || 'demo_key';

  // Weather API integration
  async getWeatherByLocation(latitude: number, longitude: number): Promise<WeatherData | null> {
    try {
      const response = await weatherApi.get<WeatherResponse>(
        `/weather?lat=${latitude}&lon=${longitude}&appid=${this.OPENWEATHER_API_KEY}&units=metric&lang=fr`
      );

      return {
        temperature: response.data.main?.temp || 0,
        condition: response.data.weather?.[0]?.description || 'Unknown',
        humidity: response.data.main?.humidity || 0,
        windSpeed: response.data.wind?.speed || 0,
        icon: response.data.weather?.[0]?.icon || '01d'
      };
    } catch (error) {
      console.error('Weather API error:', error);
      return null;
    }
  }

  async getWeatherByCity(city: string): Promise<WeatherData | null> {
    try {
      const response = await weatherApi.get(`/weather`, {
        params: {
          q: city,
          appid: this.OPENWEATHER_API_KEY,
          units: 'metric',
          lang: 'fr'
        }
      });

      return {
        temperature: response.data.main?.temp || 0,
        condition: response.data.weather?.[0]?.description || 'Unknown',
        humidity: response.data.main?.humidity || 0,
        windSpeed: response.data.wind?.speed || 0,
        icon: response.data.weather?.[0]?.icon || '01d'
      };
    } catch (error) {
      console.error('Weather API error:', error);
      return null;
    }
  }

  // OpenTripMap API integration
  async searchPOIsByLocation(
    latitude: number,
    longitude: number,
    radius: number = 10000, // meters
    kinds: string = 'interesting_places',
    limit: number = 20
  ): Promise<POI[]> {
    try {
      const response = await openTripMapApi.get(`/places/radius`, {
        params: {
          apikey: this.OPENTRIPMAP_API_KEY,
          radius,
          lat: latitude,
          lon: longitude,
          kinds,
          format: 'json',
          limit
        }
      });

      return response.data.features?.map((feature: any) => ({
        xid: feature.properties.xid,
        name: feature.properties.name,
        wikidata: feature.properties.wikidata,
        rate: feature.properties.rate,
        kinds: feature.properties.kinds,
        dist: feature.properties.dist,
        point: {
          lon: feature.geometry.coordinates[0],
          lat: feature.geometry.coordinates[1]
        }
      })) || [];
    } catch (error) {
      console.error('OpenTripMap API error:', error);
      return [];
    }
  }

  async getPOIDetails(xid: string): Promise<Record<string, unknown> | null> {
    try {
      const response = await openTripMapApi.get(`/places/xid/${xid}`, {
        params: {
          apikey: this.OPENTRIPMAP_API_KEY,
          format: 'json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('OpenTripMap POI details error:', error);
      return null;
    }
  }

  // Search POIs by bounding box
  async searchPOIsByBounds(
    lonMin: number,
    latMin: number,
    lonMax: number,
    latMax: number,
    kinds: string = 'interesting_places'
  ): Promise<POI[]> {
    try {
      const response = await openTripMapApi.get(`/places/bbox`, {
        params: {
          apikey: this.OPENTRIPMAP_API_KEY,
          lon_min: lonMin,
          lat_min: latMin,
          lon_max: lonMax,
          lat_max: latMax,
          kinds,
          format: 'json'
        }
      });

      return response.data.features?.map((feature: any) => ({
        xid: feature.properties.xid,
        name: feature.properties.name,
        wikidata: feature.properties.wikidata,
        rate: feature.properties.rate,
        kinds: feature.properties.kinds,
        dist: feature.properties.dist,
        point: {
          lon: feature.geometry.coordinates[0],
          lat: feature.geometry.coordinates[1]
        }
      })) || [];
    } catch (error) {
      console.error('OpenTripMap bbox search error:', error);
      return [];
    }
  }
}

export const externalApiService = new ExternalApiService();