import * as Location from 'expo-location';
import { sendLocationUpdate } from './api.helper';
import config from '@/config';
import { removePlusCode } from '@/utils/helper';

let locationInterval: NodeJS.Timeout | null = null;

// Function to get address from coordinates
const getAddressFromLatLng = async (latitude: number, longitude: number): Promise<string> => {
  try {
    const apiKey = config.GOOGLE_API_KEY || "";
    if (!apiKey) {
      console.warn("Google API key is missing!");
      return "Address unavailable";
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );
    const data = await response.json();
    
    if (data?.status === "OK" && data.results.length > 0) {
      const result = data?.results?.find((item: any) => !item.plus_code);
      const plainAddress = removePlusCode(
        result?.formatted_address || data.results[0].formatted_address
      );
      return plainAddress || "Address unavailable";
    } else {
      return "Address unavailable";
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Address unavailable";
  }
};

// Function to send location to server
const sendLocationToServer = async (lat: number, lng: number, address: string, isAuto: boolean) => {
  try {
    const locationData = {
      latitude: lat,
      longitude: lng,
      address,
      isAuto,
      timestamp: new Date().toISOString(),
      accuracy: 'high',
    };
    const response = await sendLocationUpdate(locationData);
    console.log('Location sent to server:', response);
  } catch (error) {
    console.error('Error sending location to server:', error);
  }
};

// Function to start background location tracking
export const startLocationTracking = async ({ isAuto, lat, lng, address }: { isAuto: boolean, lat: number, lng: number, address: string }) => {
  try {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== 'granted') {
      console.log('Foreground location permission denied');
      return false;
    }
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== 'granted') {
      console.log('Background location permission denied');
      return false;
    }
    // Start periodic location updates using setInterval
    locationInterval = setInterval(async () => {
      try {
        await sendLocationToServer(lat, lng, address, isAuto);
        console.log('Periodic location update sent:', { lat, lng, address, isAuto, timestamp: new Date().toISOString() });
      } catch (error) {
        console.error('Error getting periodic location:', error);
      }
    }, 10000); // 10 minutes
    console.log('Location tracking started successfully');
    return true;
  } catch (error) {
    console.error('Error starting location tracking:', error);
    return false;
  }
};

// Function to stop background location tracking
export const stopLocationTracking = async ({ isAuto, lat, lng, address }: { isAuto: boolean, lat: number, lng: number, address: string }) => {
  try {
    if (locationInterval) {
      clearInterval(locationInterval);
      locationInterval = null;
      console.log('Stopped location tracking interval');
    }
    // Send manual mode update to server
    await sendLocationToServer(lat, lng, address, isAuto);
    console.log('Location tracking stopped successfully');
    return true;
  } catch (error) {
    console.error('Error stopping location tracking:', error);
    return false;
  }
};

// Function to check if location tracking is active
export const isLocationTrackingActive = async (): Promise<boolean> => {
  try {
    return locationInterval !== null;
  } catch (error) {
    console.error('Error checking location tracking status:', error);
    return false;
  }
};

// Function to send immediate location update
export const sendImmediateLocationUpdate = async ({ isAuto, lat, lng, address }: { isAuto: boolean, lat: number, lng: number, address: string }) => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission not granted');
      return false;
    }
    await sendLocationToServer(lat, lng, address, isAuto);
    return true;
  } catch (error) {
    console.error('Error sending immediate location update:', error);
    return false;
  }
};
