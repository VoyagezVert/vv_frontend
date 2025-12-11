// Carbon footprint emission factors (kg CO2 per unit)
export const EMISSION_FACTORS = {
  // Transport modes (kg CO2 per km per passenger)
  transport: {
    walk: 0,
    bike: 0,
    train: 0.041,
    bus: 0.089,
    car_petrol: 0.171,
    car_diesel: 0.152,
    car_electric: 0.053, // depends on electricity grid
    plane_domestic: 0.255,
    plane_short: 0.195,
    plane_medium: 0.156,
    plane_long: 0.195,
    metro: 0.034,
    tram: 0.029
  },
  
  // Accommodation (kg CO2 per night per guest)
  accommodation: {
    camping: 2.8,
    hostel: 4.6,
    hotel_budget: 8.3,
    hotel_standard: 12.2,
    hotel_luxury: 18.7,
    hotel_eco: 6.1,
    bnb: 7.2,
    apartment: 5.9
  },
  
  // Activities (kg CO2 per hour per participant)
  activities: {
    museum_visit: 0.8,
    city_tour: 1.2,
    hiking: 0.3,
    cycling: 0.1,
    boat_tour: 2.8,
    helicopter_tour: 15.6,
    skiing: 3.2,
    swimming_pool: 0.9,
    spa: 1.8,
    cooking_class: 0.6,
    wildlife_watching: 0.4,
    adventure_sports: 2.1
  },
  
  // Food (kg CO2 per meal)
  food: {
    local_vegetarian: 0.9,
    local_omnivore: 2.8,
    imported_vegetarian: 1.8,
    imported_omnivore: 4.2,
    fast_food: 3.1,
    fine_dining: 5.6
  }
};

export interface CarbonCalculationInput {
  type: 'transport' | 'accommodation' | 'activity' | 'food';
  category: string;
  value: number; // distance (km), nights, duration (hours), or meals
  passengers?: number;
  multiplier?: number;
}

export interface CarbonResult {
  emissions: number; // kg CO2
  category: string;
  details: {
    value: number;
    unit: string;
    emissionFactor: number;
    passengers: number;
  };
}

export class CarbonCalculator {
  // Calculate carbon footprint for transport
  calculateTransport(
    mode: keyof typeof EMISSION_FACTORS.transport,
    distance: number,
    passengers: number = 1
  ): CarbonResult {
    const emissionFactor = EMISSION_FACTORS.transport[mode];
    const emissions = distance * emissionFactor * passengers;
    
    return {
      emissions,
      category: 'transport',
      details: {
        value: distance,
        unit: 'km',
        emissionFactor,
        passengers
      }
    };
  }

  // Calculate carbon footprint for accommodation
  calculateAccommodation(
    type: keyof typeof EMISSION_FACTORS.accommodation,
    nights: number,
    guests: number = 1
  ): CarbonResult {
    const emissionFactor = EMISSION_FACTORS.accommodation[type];
    const emissions = nights * emissionFactor * guests;
    
    return {
      emissions,
      category: 'accommodation',
      details: {
        value: nights,
        unit: 'nights',
        emissionFactor,
        passengers: guests
      }
    };
  }

  // Calculate carbon footprint for activities
  calculateActivity(
    type: keyof typeof EMISSION_FACTORS.activities,
    duration: number, // in hours
    participants: number = 1
  ): CarbonResult {
    const emissionFactor = EMISSION_FACTORS.activities[type];
    const emissions = duration * emissionFactor * participants;
    
    return {
      emissions,
      category: 'activity',
      details: {
        value: duration,
        unit: 'hours',
        emissionFactor,
        passengers: participants
      }
    };
  }

  // Calculate total emissions from multiple sources
  calculateTotal(calculations: CarbonResult[]): {
    totalEmissions: number;
    breakdown: Record<string, number>;
    details: CarbonResult[];
  } {
    const totalEmissions = calculations.reduce((sum, calc) => sum + calc.emissions, 0);
    
    const breakdown = calculations.reduce((acc, calc) => {
      acc[calc.category] = (acc[calc.category] || 0) + calc.emissions;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalEmissions,
      breakdown,
      details: calculations
    };
  }

  // Get eco-score based on carbon emissions per category
  calculateEcoScore(
    emissions: number,
    category: 'transport' | 'accommodation' | 'activity',
    baselineValue: number
  ): number {
    // Baseline emissions for "average" choice in each category
    const baselines = {
      transport: 0.15, // kg CO2 per km (average car)
      accommodation: 10, // kg CO2 per night (standard hotel)
      activity: 1.5 // kg CO2 per hour (average activity)
    };
    
    const baseline = baselines[category];
    const emissionsPerUnit = emissions / baselineValue;
    
    // Calculate score: 10 = zero emissions, 5 = baseline, 1 = 2x baseline or more
    const score = 10 - (emissionsPerUnit / baseline) * 4.5;
    
    // Clamp between 1 and 10
    return Math.max(1, Math.min(10, score));
  }

  // Calculate carbon offset cost (approximate prices in EUR)
  calculateOffsetCost(emissions: number): {
    forestProject: { cost: number; description: string };
    renewableEnergy: { cost: number; description: string };
    technologyProject: { cost: number; description: string };
  } {
    // Prices per tonne CO2 (approximations)
    const pricesPerTonne = {
      forest: 15, // EUR per tonne
      renewable: 25, // EUR per tonne
      technology: 45 // EUR per tonne
    };
    
    const emissionsInTonnes = emissions / 1000;
    
    return {
      forestProject: {
        cost: emissionsInTonnes * pricesPerTonne.forest,
        description: 'Reforestation et conservation forestière'
      },
      renewableEnergy: {
        cost: emissionsInTonnes * pricesPerTonne.renewable,
        description: 'Projets d\'énergie renouvelable'
      },
      technologyProject: {
        cost: emissionsInTonnes * pricesPerTonne.technology,
        description: 'Capture et stockage du carbone'
      }
    };
  }

  // Convert carbon emissions to equivalent metrics
  convertToEquivalents(emissions: number): {
    treesNeeded: number;
    carKmEquivalent: number;
    householdDays: number;
  } {
    // Conversion factors
    const treeAbsorption = 22; // kg CO2 per year per tree
    const carEmissionPerKm = 0.171; // kg CO2 per km (average car)
    const householdEmissionPerDay = 11; // kg CO2 per day (average EU household)
    
    return {
      treesNeeded: Math.round(emissions / treeAbsorption * 365), // trees for one year
      carKmEquivalent: Math.round(emissions / carEmissionPerKm),
      householdDays: Math.round(emissions / householdEmissionPerDay)
    };
  }

  // Get improvement suggestions based on emissions
  getImprovementSuggestions(
    calculations: CarbonResult[]
  ): Array<{
    category: string;
    currentEmissions: number;
    suggestion: string;
    potentialReduction: number;
    ecoAlternative: string;
  }> {
    const suggestions: Array<{
      category: string;
      currentEmissions: number;
      suggestion: string;
      potentialReduction: number;
      ecoAlternative: string;
    }> = [];
    
    calculations.forEach(calc => {
      if (calc.category === 'transport' && calc.emissions > 20) {
        suggestions.push({
          category: 'transport',
          currentEmissions: calc.emissions,
          suggestion: 'Considérez le train ou le covoiturage',
          potentialReduction: calc.emissions * 0.7, // 70% reduction
          ecoAlternative: 'Train ou bus'
        });
      }
      
      if (calc.category === 'accommodation' && calc.emissions > 15) {
        suggestions.push({
          category: 'accommodation',
          currentEmissions: calc.emissions,
          suggestion: 'Choisissez un hébergement éco-certifié',
          potentialReduction: calc.emissions * 0.4, // 40% reduction
          ecoAlternative: 'Hôtel éco-responsable ou éco-lodge'
        });
      }
      
      if (calc.category === 'activity' && calc.emissions > 10) {
        suggestions.push({
          category: 'activity',
          currentEmissions: calc.emissions,
          suggestion: 'Optez pour des activités nature et locales',
          potentialReduction: calc.emissions * 0.6, // 60% reduction
          ecoAlternative: 'Randonnée, vélo, ou activités culturelles locales'
        });
      }
    });
    
    return suggestions;
  }
}

export const carbonCalculator = new CarbonCalculator();