/**
 * Location Service
 * Handles GPS location validation for attendance
 */

export const locationService = {
  // Get current position
  async getCurrentPosition(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minute cache
    }

    const config = { ...defaultOptions, ...options }

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          })
        },
        error => {
          let message = 'Location access failed'

          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location access denied by user'
              break
            case error.POSITION_UNAVAILABLE:
              message = 'Location information is unavailable'
              break
            case error.TIMEOUT:
              message = 'Location request timed out'
              break
          }

          reject(new Error(message))
        },
        config
      )
    })
  },

  // Calculate distance between two points (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Distance in meters
  },

  // Validate if location is within allowed area
  validateLocation(currentLat, currentLon, allowedLocations, toleranceMeters = 100) {
    for (const location of allowedLocations) {
      const distance = this.calculateDistance(
        currentLat,
        currentLon,
        location.latitude,
        location.longitude
      )

      if (distance <= (location.radius || toleranceMeters)) {
        return {
          valid: true,
          location: location.name,
          distance: Math.round(distance),
          accuracy: 'within_bounds'
        }
      }
    }

    // Find nearest location for reference
    let nearestLocation = null
    let nearestDistance = Infinity

    for (const location of allowedLocations) {
      const distance = this.calculateDistance(
        currentLat,
        currentLon,
        location.latitude,
        location.longitude
      )

      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestLocation = location
      }
    }

    return {
      valid: false,
      location: nearestLocation?.name || 'Unknown',
      distance: Math.round(nearestDistance),
      accuracy: 'outside_bounds',
      message: `You are ${Math.round(nearestDistance)}m away from ${nearestLocation?.name || 'the nearest allowed location'}`
    }
  },

  // Get location name from coordinates (reverse geocoding)
  async getLocationName(latitude, longitude) {
    try {
      // Using a simple reverse geocoding service
      // In production, you might want to use Google Maps API or similar
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      )

      if (!response.ok) {
        throw new Error('Geocoding service unavailable')
      }

      const data = await response.json()

      return {
        address: data.locality || data.city || 'Unknown location',
        city: data.city,
        country: data.countryName,
        fullAddress: `${data.localityInfo?.administrative?.[2]?.name}, ${
          data.localityInfo?.administrative?.[1]?.name
        }, ${data.countryName}`
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
      return {
        address: 'Unknown location',
        city: 'Unknown',
        country: 'Unknown',
        fullAddress: 'Location details unavailable'
      }
    }
  },

  // Default school locations (can be configured)
  getDefaultSchoolLocations() {
    return [
      {
        name: 'Main School Building',
        latitude: -6.2088, // Jakarta coordinates (example)
        longitude: 106.8456,
        radius: 100, // 100 meters radius
        description: 'Primary school campus'
      },
      {
        name: 'School Office',
        latitude: -6.209,
        longitude: 106.8458,
        radius: 50,
        description: 'Administrative building'
      },
      {
        name: 'Sports Complex',
        latitude: -6.2085,
        longitude: 106.846,
        radius: 150,
        description: 'Sports and recreation area'
      }
    ]
  },

  // Check if browser supports geolocation
  isGeolocationSupported() {
    return 'geolocation' in navigator
  },

  // Request permission for location access
  async requestLocationPermission() {
    if (!this.isGeolocationSupported()) {
      throw new Error('Geolocation not supported')
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' })
      return {
        state: permission.state,
        granted: permission.state === 'granted',
        prompt: permission.state === 'prompt',
        denied: permission.state === 'denied'
      }
    } catch (error) {
      // Fallback for browsers that don't support permissions API
      return {
        state: 'unknown',
        granted: false,
        prompt: true,
        denied: false
      }
    }
  },

  // Format location for display
  formatLocationForDisplay(location) {
    const { latitude, longitude, accuracy } = location

    return {
      coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      accuracy: accuracy ? `±${Math.round(accuracy)}m` : 'Unknown',
      quality: this.getLocationQuality(accuracy)
    }
  },

  // Determine location accuracy quality
  getLocationQuality(accuracy) {
    if (!accuracy) return 'unknown'

    if (accuracy <= 5) return 'excellent'
    if (accuracy <= 20) return 'good'
    if (accuracy <= 50) return 'fair'
    return 'poor'
  }
}

export default locationService
