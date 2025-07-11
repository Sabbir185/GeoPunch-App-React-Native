import { useEffect, useState } from "react";
import * as Location from "expo-location";

interface LocationData {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  error: string | null;
  loading: boolean;
}

const useCurrentLocation = () => {
  const [locationData, setLocationData] = useState<LocationData>({
    latitude: null,
    longitude: null,
    address: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLocationData((prev) => ({ ...prev, loading: true }));
        // Request foreground location permission
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationData({
            latitude: null,
            longitude: null,
            address: null,
            error: "Permission denied",
            loading: false,
          });
          return;
        }
        // Get current position
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location?.Accuracy?.High,
        });
        const { latitude, longitude } = location?.coords;
        // Reverse geocoding to get address
        let geocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        let address =
          geocode?.length > 0
            ? `${geocode[0].name}, ${geocode[0].city}, ${geocode[0].region}, ${geocode[0].country}`
            : "Address not found";
        setLocationData({
          latitude,
          longitude,
          address,
          error: null,
          loading: false,
        });
      } catch (error) {
        console.error(error);
        setLocationData({
          latitude: null,
          longitude: null,
          address: null,
          error: "Failed to fetch location",
          loading: false,
        });
      }
    };
    fetchLocation();
  }, []);
  return locationData;
};

export default useCurrentLocation;
