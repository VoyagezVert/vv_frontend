import { useState, useEffect } from 'react';
import type { Activity, ActivitySearch } from '../../types';
import { mockActivityCategories, mockActivities } from '../../services';
import { 
  ActivityCard, 
  FilterPanel, 
  SearchInput, 
  CheckboxFilter, 
  RangeSlider, 
  Button, 
  LoadingSpinner, 
  Alert 
} from '../../components/ui';

export default function ActivitiesPage() {
  const [searchParams, setSearchParams] = useState<ActivitySearch>({
    location: '',
    date: new Date(),
    groupSize: 2,
    categories: [],
    difficulty: ['easy'],
    sortBy: 'eco'
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [ecoScoreRange, setEcoScoreRange] = useState<[number, number]>([0, 10]);
  const [durationRange, setDurationRange] = useState<[number, number]>([1, 8]); // in hours
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [sustainabilityFilters, setSustainabilityFilters] = useState({
    supportsLocal: false,
    educational: false,
    conservation: false,
    environmentallyFriendly: false
  });

  // Mock data for development
  useEffect(() => {
    const loadMockData = async () => {
      setIsLoading(true);
      
      // Simulate API loading time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const expandedMockActivities: Activity[] = [
        ...mockActivities,
        {
          id: 'activity-2',
          name: 'Atelier Cuisine Bio Locale',
          description: 'Apprenez à cuisiner avec des produits locaux et de saison dans une ferme biologique.',
          location: {
            id: 'loc-provence',
            name: 'Ferme Bio Provence',
            address: 'Chemin des Oliviers, 84220 Gordes',
            latitude: 43.9094,
            longitude: 5.1989,
            country: 'France',
            city: 'Gordes'
          },
          category: mockActivityCategories[3], // Wellness
          images: ['/images/activities/cooking-workshop-1.jpg'],
          duration: 180, // 3 hours
          price: 45,
          ecoScore: 9.1,
          carbonImpact: 1.2,
          groupSize: { min: 2, max: 8 },
          difficulty: 'easy',
          seasonality: [
            { id: 'spring', name: 'spring', months: [3, 4, 5] },
            { id: 'summer', name: 'summer', months: [6, 7, 8] },
            { id: 'autumn', name: 'autumn', months: [9, 10, 11] }
          ],
          tags: ['cuisine', 'bio', 'local', 'apprentissage'],
          sustainability: {
            supportsLocalCommunity: true,
            environmentallyFriendly: true,
            educationalValue: true,
            wildlifeConservation: false,
            culturalPreservation: true
          },
          provider: {
            name: 'Ferme Bio Provence',
            rating: 4.8,
            certifications: ['Agriculture Biologique', 'Accueil Paysan']
          }
        },
        {
          id: 'activity-3',
          name: 'Observation des Oiseaux Migrateurs',
          description: 'Découverte de l\'avifaune locale avec un ornithologue expert dans une réserve naturelle.',
          location: {
            id: 'loc-camargue',
            name: 'Réserve Naturelle Camargue',
            address: 'Route du Phare de la Gacholle, 13460 Saintes-Maries-de-la-Mer',
            latitude: 43.4503,
            longitude: 4.3792,
            country: 'France',
            city: 'Saintes-Maries-de-la-Mer'
          },
          category: mockActivityCategories[0], // Nature
          images: ['/images/activities/birdwatching-1.jpg'],
          duration: 240, // 4 hours
          price: 35,
          ecoScore: 9.5,
          carbonImpact: 0.8,
          groupSize: { min: 3, max: 15 },
          difficulty: 'easy',
          seasonality: [
            { id: 'spring', name: 'spring', months: [3, 4, 5] },
            { id: 'autumn', name: 'autumn', months: [9, 10, 11] }
          ],
          tags: ['nature', 'oiseaux', 'observation', 'éducatif'],
          sustainability: {
            supportsLocalCommunity: true,
            environmentallyFriendly: true,
            educationalValue: true,
            wildlifeConservation: true,
            culturalPreservation: false
          },
          provider: {
            name: 'Nature Camargue',
            rating: 4.9,
            certifications: ['Guide Naturaliste', 'Parc Naturel Régional']
          }
        },
        {
          id: 'activity-4',
          name: 'Vélo Électrique - Circuit des Villages',
          description: 'Circuit en vélo électrique à travers les plus beaux villages de Provence.',
          location: {
            id: 'loc-luberon',
            name: 'Parc du Luberon',
            address: 'Place Jean Jaurès, 84400 Apt',
            latitude: 43.8767,
            longitude: 5.3958,
            country: 'France',
            city: 'Apt'
          },
          category: mockActivityCategories[2], // Adventure
          images: ['/images/activities/ebike-tour-1.jpg'],
          duration: 360, // 6 hours
          price: 75,
          ecoScore: 8.3,
          carbonImpact: 2.5,
          groupSize: { min: 2, max: 12 },
          difficulty: 'moderate',
          seasonality: [
            { id: 'spring', name: 'spring', months: [3, 4, 5] },
            { id: 'summer', name: 'summer', months: [6, 7, 8] },
            { id: 'autumn', name: 'autumn', months: [9, 10] }
          ],
          tags: ['vélo', 'villages', 'patrimoine', 'électrique'],
          sustainability: {
            supportsLocalCommunity: true,
            environmentallyFriendly: true,
            educationalValue: true,
            wildlifeConservation: false,
            culturalPreservation: true
          },
          provider: {
            name: 'Provence E-Bike',
            rating: 4.6,
            certifications: ['Tourisme Durable', 'Vélo & Territoires']
          }
        }
      ];

      setActivities(expandedMockActivities);
      setIsLoading(false);
    };
    
    loadMockData();
  }, []);

  const handleSearch = async () => {
    if (!searchParams.location) {
      setError('Veuillez renseigner une destination');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call the actual service
      // const result = await activityService.searchActivities(searchParams);
      // setActivities(result.data);
      
      // For now, simulate search delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err: unknown) {
      console.error('Search error:', err);
      setError('Erreur lors de la recherche d\'activités');
    } finally {
      setIsLoading(false);
    }
  };

  const addToItinerary = (activity: Activity) => {
    if (!selectedActivities.find(a => a.id === activity.id)) {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const removeFromItinerary = (activityId: string) => {
    setSelectedActivities(selectedActivities.filter(a => a.id !== activityId));
  };

  const calculateTotalImpact = () => {
    return {
      totalCost: selectedActivities.reduce((sum, a) => sum + a.price, 0),
      totalCarbon: selectedActivities.reduce((sum, a) => sum + a.carbonImpact, 0),
      averageEcoScore: selectedActivities.length > 0 
        ? selectedActivities.reduce((sum, a) => sum + a.ecoScore, 0) / selectedActivities.length 
        : 0,
      totalDuration: selectedActivities.reduce((sum, a) => sum + a.duration, 0)
    };
  };

  const filteredActivities = activities.filter(activity => {
    // Price filter
    const priceMatch = activity.price >= priceRange[0] && activity.price <= priceRange[1];
    
    // Eco score filter
    const ecoScoreMatch = activity.ecoScore >= ecoScoreRange[0] && activity.ecoScore <= ecoScoreRange[1];
    
    // Duration filter (convert minutes to hours)
    const durationHours = activity.duration / 60;
    const durationMatch = durationHours >= durationRange[0] && durationHours <= durationRange[1];
    
    // Categories filter
    const categoryMatch = selectedCategories.length === 0 || 
      selectedCategories.includes(activity.category.id);
    
    // Difficulty filter
    const difficultyMatch = selectedDifficulties.length === 0 ||
      selectedDifficulties.includes(activity.difficulty);
    
    // Sustainability filters
    const sustainabilityMatch = Object.entries(sustainabilityFilters).every(([key, value]) => {
      if (!value) return true; // Filter not active
      
      switch (key) {
        case 'supportsLocal':
          return activity.sustainability.supportsLocalCommunity;
        case 'educational':
          return activity.sustainability.educationalValue;
        case 'conservation':
          return activity.sustainability.wildlifeConservation;
        case 'environmentallyFriendly':
          return activity.sustainability.environmentallyFriendly;
        default:
          return true;
      }
    });
    
    return priceMatch && ecoScoreMatch && durationMatch && categoryMatch && difficultyMatch && sustainabilityMatch;
  });

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    switch (searchParams.sortBy) {
      case 'eco':
        return b.ecoScore - a.ecoScore;
      case 'price':
        return a.price - b.price;
      case 'duration':
        return a.duration - b.duration;
      case 'rating':
        return b.provider.rating - a.provider.rating;
      default:
        return b.ecoScore - a.ecoScore;
    }
  });

  const categoryOptions = mockActivityCategories.map(category => ({
    id: category.id,
    label: category.name,
    count: activities.filter(a => a.category.id === category.id).length
  }));

  const difficultyOptions = [
    { id: 'easy', label: 'Facile', count: activities.filter(a => a.difficulty === 'easy').length },
    { id: 'moderate', label: 'Modéré', count: activities.filter(a => a.difficulty === 'moderate').length },
    { id: 'challenging', label: 'Difficile', count: activities.filter(a => a.difficulty === 'challenging').length }
  ];

  const itinerarySummary = calculateTotalImpact();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Activités Écoresponsables
              </h1>
              <p className="text-gray-600">
                Découvrez des activités durables qui minimisent votre impact environnemental
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-4 mt-4 lg:mt-0">
              <div className="flex items-center text-sm text-gray-500">
                <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                Score éco élevé
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                Soutien local
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="w-3 h-3 bg-purple-400 rounded-full mr-2"></span>
                Éducatif
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <SearchInput
              placeholder="Destination"
              value={searchParams.location}
              onChange={(value) => setSearchParams({ ...searchParams, location: value })}
            />
            
            <input
              type="date"
              value={searchParams.date.toISOString().split('T')[0]}
              onChange={(e) => setSearchParams({ 
                ...searchParams, 
                date: new Date(e.target.value) 
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            
            <select
              value={searchParams.groupSize}
              onChange={(e) => setSearchParams({ 
                ...searchParams, 
                groupSize: parseInt(e.target.value) 
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6, 8, 10].map(num => (
                <option key={num} value={num}>{num} personne{num > 1 ? 's' : ''}</option>
              ))}
            </select>
            
            <select
              value={searchParams.duration || ''}
              onChange={(e) => setSearchParams({ 
                ...searchParams, 
                duration: e.target.value ? parseInt(e.target.value) : undefined 
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Toute durée</option>
              <option value="2">Demi-journée</option>
              <option value="6">Journée</option>
              <option value="8">Journée complète</option>
            </select>
            
            <Button 
              onClick={handleSearch} 
              loading={isLoading}
              className="w-full"
            >
              Rechercher
            </Button>
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'eco', label: 'Plus écologique' },
              { value: 'price', label: 'Prix croissant' },
              { value: 'duration', label: 'Plus courte' },
              { value: 'rating', label: 'Mieux noté' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setSearchParams({ ...searchParams, sortBy: option.value as 'eco' | 'price' | 'duration' | 'rating' })}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  searchParams.sortBy === option.value
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Itinerary Summary */}
              {selectedActivities.length > 0 && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <h3 className="font-semibold text-primary-800 mb-3 flex items-center">
                    <span className="mr-2">📋</span>
                    Mon Itinéraire
                  </h3>
                  <div className="space-y-2 text-sm text-primary-700">
                    <div className="flex justify-between">
                      <span>Activités:</span>
                      <span className="font-medium">{selectedActivities.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Durée:</span>
                      <span className="font-medium">{Math.round(itinerarySummary.totalDuration / 60)}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coût total:</span>
                      <span className="font-medium">{itinerarySummary.totalCost}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Impact carbone:</span>
                      <span className="font-medium text-green-600">{itinerarySummary.totalCarbon.toFixed(1)} kg CO₂</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Score éco moyen:</span>
                      <span className="font-medium text-green-600">{itinerarySummary.averageEcoScore.toFixed(1)}/10</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    {selectedActivities.map(activity => (
                      <div key={activity.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 text-xs shadow-sm">
                        <span className="truncate font-medium">{activity.name}</span>
                        <button
                          onClick={() => removeFromItinerary(activity.id)}
                          className="text-red-500 hover:text-red-700 ml-2 p-1"
                          title="Retirer de l'itinéraire"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <FilterPanel title="💰 Prix">
                <RangeSlider
                  label="Budget par activité"
                  min={0}
                  max={200}
                  value={priceRange}
                  onChange={setPriceRange}
                  formatValue={(val) => `${val}€`}
                />
              </FilterPanel>

              <FilterPanel title="🌱 Score écologique">
                <RangeSlider
                  label="Score minimum"
                  min={0}
                  max={10}
                  step={0.1}
                  value={ecoScoreRange}
                  onChange={setEcoScoreRange}
                  formatValue={(val) => `${val}/10`}
                />
              </FilterPanel>

              <FilterPanel title="⏱️ Durée">
                <RangeSlider
                  label="Durée en heures"
                  min={1}
                  max={8}
                  value={durationRange}
                  onChange={setDurationRange}
                  formatValue={(val) => `${val}h`}
                />
              </FilterPanel>

              <FilterPanel title="🎯 Catégories">
                <CheckboxFilter
                  options={categoryOptions}
                  selectedIds={selectedCategories}
                  onChange={setSelectedCategories}
                />
              </FilterPanel>

              <FilterPanel title="💪 Niveau de difficulté">
                <CheckboxFilter
                  options={difficultyOptions}
                  selectedIds={selectedDifficulties}
                  onChange={setSelectedDifficulties}
                />
              </FilterPanel>

              <FilterPanel title="🌍 Caractéristiques durables">
                <div className="space-y-3">
                  {[
                    { key: 'supportsLocal', label: 'Soutient la communauté locale', icon: '🤝' },
                    { key: 'educational', label: 'Valeur éducative', icon: '🎓' },
                    { key: 'conservation', label: 'Conservation de la faune', icon: '🦋' },
                    { key: 'environmentallyFriendly', label: 'Respectueux de l\'environnement', icon: '🌱' }
                  ].map(filter => (
                    <label key={filter.key} className="flex items-start cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={sustainabilityFilters[filter.key as keyof typeof sustainabilityFilters]}
                        onChange={(e) => setSustainabilityFilters({
                          ...sustainabilityFilters,
                          [filter.key]: e.target.checked
                        })}
                        className="mt-0.5 mr-3 text-primary-600 focus:ring-primary-500 rounded"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                        <span className="mr-2">{filter.icon}</span>
                        {filter.label}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterPanel>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            {error && (
              <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />
            )}

            {isLoading ? (
              <div className="text-center py-12">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Recherche d'activités écoresponsables...</p>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {sortedActivities.length} activité{sortedActivities.length > 1 ? 's' : ''} trouvée{sortedActivities.length > 1 ? 's' : ''}
                  </h2>
                  
                  {sortedActivities.length > 0 && (
                    <div className="mt-2 sm:mt-0 text-sm text-gray-500">
                      Triées par {searchParams.sortBy === 'eco' ? 'score écologique' : 
                                 searchParams.sortBy === 'price' ? 'prix' :
                                 searchParams.sortBy === 'duration' ? 'durée' : 'note'}
                    </div>
                  )}
                </div>

                {/* Activities Grid */}
                {sortedActivities.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <div className="text-6xl mb-4">🏃‍♀️</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune activité trouvée</h3>
                    <p className="text-gray-600 mb-4">Aucune activité ne correspond à vos critères</p>
                    <p className="text-sm text-gray-500">Essayez de modifier vos filtres ou votre destination</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedActivities.map((activity) => (
                      <div key={activity.id} className="relative group">
                        <ActivityCard
                          activity={activity}
                          participants={searchParams.groupSize}
                          isSelected={selectedActivityId === activity.id}
                          onClick={() => setSelectedActivityId(
                            selectedActivityId === activity.id ? null : activity.id
                          )}
                        />
                        
                        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant={selectedActivities.find(a => a.id === activity.id) ? 'secondary' : 'primary'}
                            onClick={() => {
                              if (selectedActivities.find(a => a.id === activity.id)) {
                                removeFromItinerary(activity.id);
                              } else {
                                addToItinerary(activity);
                              }
                            }}
                            className="shadow-lg"
                          >
                            {selectedActivities.find(a => a.id === activity.id) ? (
                              <>
                                <span className="mr-1">✓</span>
                                Ajouté
                              </>
                            ) : (
                              <>
                                <span className="mr-1">+</span>
                                Ajouter
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}