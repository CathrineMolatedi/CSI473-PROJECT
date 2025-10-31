// Geolocation Service for Patrol Validation
export class GeolocationService {
  
  // Get Current Position
  async getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  // Calculate Distance Between Two Points (Haversine Formula)
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  // Validate Scan Location
  validateScanLocation(
    scanLat: number,
    scanLon: number,
    houseLat: number,
    houseLon: number,
    maxDistanceMeters: number = 50
  ): { isValid: boolean; distance: number } {
    const distance = this.calculateDistance(scanLat, scanLon, houseLat, houseLon);
    
    return {
      isValid: distance <= maxDistanceMeters,
      distance: Math.round(distance)
    };
  }

  // Watch Position (for continuous tracking during patrol)
  watchPosition(
    onPositionUpdate: (position: { latitude: number; longitude: number }) => void,
    onError?: (error: Error) => void
  ): number {
    if (!navigator.geolocation) {
      if (onError) {
        onError(new Error('Geolocation is not supported'));
      }
      return -1;
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        onPositionUpdate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        if (onError) {
          onError(new Error(`Watch position error: ${error.message}`));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }

  // Stop Watching Position
  clearWatch(watchId: number): void {
    navigator.geolocation.clearWatch(watchId);
  }

  // Request Location Permission
  async requestLocationPermission(): Promise<boolean> {
    try {
      const position = await this.getCurrentPosition();
      return true;
    } catch (error) {
      console.error('Location permission denied:', error);
      return false;
    }
  }
}

export const geolocationService = new GeolocationService();
