export interface City {
  id: number;
  name: string;
  x: number;
  y: number;
  latitude?: number;
  longitude?: number;
}

export interface TSPInstance {
  id: string;
  name: string;
  cities: City[];
  distanceMatrix: number[][];
  optimalTour?: number[];
  optimalDistance?: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  estimatedTime: string;
}

export interface TSPConfig {
  cityCount: number;
  mapWidth?: number;
  mapHeight?: number;
  minDistance?: number;
  seed?: number;
  useRealCoordinates?: boolean;
  clustered?: boolean;
  clusterCount?: number;
}

// Predefined city names for more realistic instances
const CITY_NAMES = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'Austin', 'San Jose', 'Fort Worth',
  'Jacksonville', 'Columbus', 'Charlotte', 'Indianapolis', 'San Francisco',
  'Seattle', 'Denver', 'Boston', 'Nashville', 'Baltimore', 'Louisville',
  'Portland', 'Las Vegas', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno',
  'Sacramento', 'Mesa', 'Kansas City', 'Atlanta', 'Colorado Springs',
  'Omaha', 'Raleigh', 'Miami', 'Long Beach', 'Virginia Beach', 'Oakland',
  'Minneapolis', 'Tampa', 'Tulsa', 'Arlington', 'New Orleans', 'Wichita',
  'Cleveland', 'Bakersfield', 'Aurora', 'Anaheim', 'Honolulu', 'Santa Ana',
  'Corpus Christi', 'Riverside', 'Lexington', 'Stockton', 'Toledo', 'St. Paul',
  'Newark', 'Greensboro', 'Buffalo', 'Plano', 'Lincoln', 'Henderson',
  'Fort Wayne', 'Jersey City', 'St. Petersburg', 'Chula Vista', 'Orlando',
  'Norfolk', 'Chandler', 'Laredo', 'Madison', 'Durham', 'Lubbock',
  'Winston-Salem', 'Garland', 'Glendale', 'Hialeah', 'Reno', 'Baton Rouge',
  'Irvine', 'Chesapeake', 'Irving', 'Scottsdale', 'North Las Vegas',
  'Fremont', 'Gilbert', 'San Bernardino', 'Boise', 'Birmingham'
];

// Simple Linear Congruential Generator for reproducible randomness
class SeededRandom {
  private seed: number;

  constructor(seed: number = Date.now()) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }
}

/**
 * Calculate Euclidean distance between two cities
 */
export function calculateDistance(city1: City, city2: City): number {
  const dx = city1.x - city2.x;
  const dy = city1.y - city2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate distance using geographical coordinates (Haversine formula)
 */
export function calculateGeoDistance(city1: City, city2: City): number {
  if (!city1.latitude || !city1.longitude || !city2.latitude || !city2.longitude) {
    return calculateDistance(city1, city2);
  }

  const R = 6371; // Earth's radius in kilometers
  const dLat = (city2.latitude - city1.latitude) * Math.PI / 180;
  const dLon = (city2.longitude - city1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(city1.latitude * Math.PI / 180) * Math.cos(city2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Create distance matrix for a set of cities
 */
export function createDistanceMatrix(cities: City[], useGeoDistance: boolean = false): number[][] {
  const n = cities.length;
  const matrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 0;
      } else {
        const distance = useGeoDistance 
          ? calculateGeoDistance(cities[i], cities[j])
          : calculateDistance(cities[i], cities[j]);
        matrix[i][j] = Math.round(distance * 100) / 100; // Round to 2 decimal places
      }
    }
  }
  
  return matrix;
}

/**
 * Generate random cities within specified bounds
 */
export function generateRandomCities(config: TSPConfig): City[] {
  const {
    cityCount,
    mapWidth = 800,
    mapHeight = 600,
    minDistance = 30,
    seed,
    clustered = false,
    clusterCount = Math.max(2, Math.floor(cityCount / 8))
  } = config;

  const rng = new SeededRandom(seed);
  const cities: City[] = [];
  const usedNames = new Set<string>();

  // Generate cluster centers if clustered layout is requested
  const clusterCenters: { x: number; y: number; radius: number }[] = [];
  if (clustered && clusterCount > 1) {
    for (let i = 0; i < clusterCount; i++) {
      clusterCenters.push({
        x: rng.nextFloat(100, mapWidth - 100),
        y: rng.nextFloat(100, mapHeight - 100),
        radius: rng.nextFloat(50, 150)
      });
    }
  }

  for (let i = 0; i < cityCount; i++) {
    let x: number, y: number;
    let attempts = 0;
    const maxAttempts = 1000;

    do {
      if (clustered && clusterCenters.length > 0) {
        // Choose a random cluster
        const cluster = clusterCenters[rng.nextInt(0, clusterCenters.length - 1)];
        const angle = rng.nextFloat(0, 2 * Math.PI);
        const radius = rng.nextFloat(0, cluster.radius);
        x = cluster.x + radius * Math.cos(angle);
        y = cluster.y + radius * Math.sin(angle);
        
        // Ensure coordinates are within bounds
        x = Math.max(20, Math.min(mapWidth - 20, x));
        y = Math.max(20, Math.min(mapHeight - 20, y));
      } else {
        x = rng.nextFloat(20, mapWidth - 20);
        y = rng.nextFloat(20, mapHeight - 20);
      }

      attempts++;
    } while (
      attempts < maxAttempts &&
      cities.some(city => calculateDistance({ id: 0, name: '', x, y }, city) < minDistance)
    );

    // Get a unique city name
    let cityName: string;
    do {
      cityName = CITY_NAMES[rng.nextInt(0, CITY_NAMES.length - 1)];
      if (usedNames.size >= CITY_NAMES.length) {
        // If we've used all names, append a number
        cityName = `${cityName} ${i + 1}`;
        break;
      }
    } while (usedNames.has(cityName));
    
    usedNames.add(cityName);

    cities.push({
      id: i,
      name: cityName,
      x: Math.round(x),
      y: Math.round(y)
    });
  }

  return cities;
}

/**
 * Generate real-world geographical coordinates for cities
 */
export function generateRealWorldCities(cityCount: number, seed?: number): City[] {
  const rng = new SeededRandom(seed);
  const cities: City[] = [];
  const usedNames = new Set<string>();

  // Real-world coordinates for major US cities
  const realCities = [
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
    { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
    { name: 'Houston', lat: 29.7604, lon: -95.3698 },
    { name: 'Phoenix', lat: 33.4484, lon: -112.0740 },
    { name: 'Philadelphia', lat: 39.9526, lon: -75.1652 },
    { name: 'San Antonio', lat: 29.4241, lon: -98.4936 },
    { name: 'San Diego', lat: 32.7157, lon: -117.1611 },
    { name: 'Dallas', lat: 32.7767, lon: -96.7970 },
    { name: 'Austin', lat: 30.2672, lon: -97.7431 },
    { name: 'San Jose', lat: 37.3382, lon: -121.8863 },
    { name: 'Jacksonville', lat: 30.3322, lon: -81.6557 },
    { name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
    { name: 'Columbus', lat: 39.9612, lon: -82.9988 },
    { name: 'Charlotte', lat: 35.2271, lon: -80.8431 },
    { name: 'Indianapolis', lat: 39.7684, lon: -86.1581 },
    { name: 'Seattle', lat: 47.6062, lon: -122.3321 },
    { name: 'Denver', lat: 39.7392, lon: -104.9903 },
    { name: 'Boston', lat: 42.3601, lon: -71.0589 },
    { name: 'Nashville', lat: 36.1627, lon: -86.7816 },
    { name: 'Baltimore', lat: 39.2904, lon: -76.6122 },
    { name: 'Portland', lat: 45.5152, lon: -122.6784 },
    { name: 'Las Vegas', lat: 36.1699, lon: -115.1398 },
    { name: 'Milwaukee', lat: 43.0389, lon: -87.9065 },
    { name: 'Albuquerque', lat: 35.0844, lon: -106.6504 },
    { name: 'Tucson', lat: 32.2226, lon: -110.9747 },
    { name: 'Fresno', lat: 36.7378, lon: -119.7871 },
    { name: 'Sacramento', lat: 38.5816, lon: -121.4944 },
    { name: 'Kansas City', lat: 39.0997, lon: -94.5786 },
    { name: 'Mesa', lat: 33.4152, lon: -111.8315 },
    { name: 'Atlanta', lat: 33.7490, lon: -84.3880 },
    { name: 'Virginia Beach', lat: 36.8529, lon: -75.9780 },
    { name: 'Omaha', lat: 41.2565, lon: -95.9345 },
    { name: 'Colorado Springs', lat: 38.8339, lon: -104.8214 },
    { name: 'Raleigh', lat: 35.7796, lon: -78.6382 },
    { name: 'Miami', lat: 25.7617, lon: -80.1918 },
    { name: 'Oakland', lat: 37.8044, lon: -122.2711 },
    { name: 'Minneapolis', lat: 44.9778, lon: -93.2650 },
    { name: 'Tulsa', lat: 36.1540, lon: -95.9928 },
    { name: 'Cleveland', lat: 41.4993, lon: -81.6944 },
    { name: 'Wichita', lat: 37.6872, lon: -97.3301 },
    { name: 'Arlington', lat: 32.7357, lon: -97.1081 }
  ];

  // Shuffle and select cities
  const shuffled = [...realCities];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selectedCities = shuffled.slice(0, Math.min(cityCount, shuffled.length));

  // Convert to our city format and project to 2D coordinates
  // Using a simple equirectangular projection centered on the US
  const centerLat = 39.8283; // Center of continental US
  const centerLon = -98.5795;
  const scale = 8;

  for (let i = 0; i < selectedCities.length; i++) {
    const city = selectedCities[i];
    const x = (city.lon - centerLon) * scale * Math.cos(centerLat * Math.PI / 180) + 400;
    const y = (centerLat - city.lat) * scale + 300;

    cities.push({
      id: i,
      name: city.name,
      x: Math.round(x),
      y: Math.round(y),
      latitude: city.lat,
      longitude: city.lon
    });
  }

  return cities;
}

/**
 * Generate a TSP instance with specified configuration
 */
export function generateTSPInstance(config: TSPConfig): TSPInstance {
  const { cityCount, useRealCoordinates = false, seed } = config;
  
  const cities = useRealCoordinates 
    ? generateRealWorldCities(cityCount, seed)
    : generateRandomCities(config);
  
  const distanceMatrix = createDistanceMatrix(cities, useRealCoordinates);
  
  // Determine difficulty based on city count
  let difficulty: TSPInstance['difficulty'];
  let estimatedTime: string;
  
  if (cityCount <= 10) {
    difficulty = 'Easy';
    estimatedTime = '5-15 seconds';
  } else if (cityCount <= 25) {
    difficulty = 'Medium';
    estimatedTime = '15-45 seconds';
  } else if (cityCount <= 50) {
    difficulty = 'Hard';
    estimatedTime = '45-90 seconds';
  } else {
    difficulty = 'Expert';
    estimatedTime = '90+ seconds';
  }

  return {
    id: `tsp-${cityCount}-${seed || 'random'}`,
    name: `${cityCount} Cities TSP${useRealCoordinates ? ' (USA)' : ''}`,
    cities,
    distanceMatrix,
    difficulty,
    estimatedTime
  };
}

/**
 * Calculate total distance of a tour
 */
export function calculateTourDistance(tour: number[], distanceMatrix: number[][]): number {
  let totalDistance = 0;
  for (let i = 0; i < tour.length; i++) {
    const from = tour[i];
    const to = tour[(i + 1) % tour.length]; // Wrap around to start
    totalDistance += distanceMatrix[from][to];
  }
  return totalDistance;
}

/**
 * Generate a greedy nearest neighbor tour (not optimal, but reasonable starting point)
 */
export function generateGreedyTour(distanceMatrix: number[][]): number[] {
  const n = distanceMatrix.length;
  if (n === 0) return [];
  
  const tour: number[] = [0]; // Start from city 0
  const visited = new Set<number>([0]);
  
  for (let i = 1; i < n; i++) {
    const current = tour[tour.length - 1];
    let nearest = -1;
    let nearestDistance = Infinity;
    
    for (let j = 0; j < n; j++) {
      if (!visited.has(j) && distanceMatrix[current][j] < nearestDistance) {
        nearest = j;
        nearestDistance = distanceMatrix[current][j];
      }
    }
    
    if (nearest !== -1) {
      tour.push(nearest);
      visited.add(nearest);
    }
  }
  
  return tour;
}

/**
 * Validate a TSP tour
 */
export function validateTour(tour: number[], cityCount: number): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (tour.length !== cityCount) {
    errors.push(`Tour length (${tour.length}) does not match city count (${cityCount})`);
  }
  
  const visited = new Set<number>();
  for (const city of tour) {
    if (city < 0 || city >= cityCount) {
      errors.push(`Invalid city index: ${city}`);
    }
    if (visited.has(city)) {
      errors.push(`City ${city} visited multiple times`);
    }
    visited.add(city);
  }
  
  for (let i = 0; i < cityCount; i++) {
    if (!visited.has(i)) {
      errors.push(`City ${i} not visited`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get predefined TSP instances for testing
 */
export function getPredefinedInstances(): TSPInstance[] {
  return [
    generateTSPInstance({ cityCount: 8, seed: 12345, clustered: false }),
    generateTSPInstance({ cityCount: 15, seed: 67890, clustered: true, clusterCount: 3 }),
    generateTSPInstance({ cityCount: 25, seed: 11111, useRealCoordinates: true }),
    generateTSPInstance({ cityCount: 50, seed: 22222, clustered: true, clusterCount: 5 }),
  ];
}