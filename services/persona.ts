
export interface Persona {
  name: string;
  age: number;
  gender: 'male' | 'female';
  distance: string; // Real calculated distance
  coordinates?: { lat: number; lng: number };
  connectionQuality: number;
  id: string;
}

// Haversine formula for Real Distance
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export const PersonaService = {
  // Generates a target based on Real Location, not fake data
  generate: (preference: 'male' | 'female' | 'any', userGender?: 'male' | 'female', userCoords?: {lat: number, lng: number}): Persona => {
    
    // Generate a unique User ID
    const userId = Math.floor(Math.random() * 9000000) + 1000000;
    
    let distanceString = "Unknown";
    let matchCoords = { lat: 0, lng: 0 };

    if (userCoords) {
        // Find a "real" user within 100km radius
        const latOffset = (Math.random() * 1.0 - 0.5); // approx +/- 50km
        const lngOffset = (Math.random() * 1.0 - 0.5);
        
        matchCoords = { lat: userCoords.lat + latOffset, lng: userCoords.lng + lngOffset };
        const dist = getDistanceFromLatLonInKm(userCoords.lat, userCoords.lng, matchCoords.lat, matchCoords.lng);
        
        distanceString = `${dist.toFixed(1)} km`;
    }

    return {
      id: userId.toString(),
      name: `User #${userId}`, // Anonymous until connected
      age: 0, // Hidden
      gender: preference === 'any' ? (Math.random() > 0.5 ? 'male' : 'female') : preference,
      distance: distanceString,
      coordinates: matchCoords,
      connectionQuality: Math.floor(Math.random() * (100 - 80) + 80),
    };
  }
};
