import React, { createContext, useContext, useState, useEffect } from "react";
import * as Location from "expo-location";
import config from "@/config";
import { removePlusCode } from "@/utils/helper";

interface LocationContextType {
  lat: number | null;
  lng: number | null;
  address: string | null;
  setLocation: (latitude: number, longitude: number) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const apiKey = config.GOOGLE_API_KEY || "";

  if (!apiKey) {
    console.warn("Google API key is missing!");
  }

  const getAddressFromLatLng = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      const data = await response.json();
      if (data?.status === "OK" && data.results.length > 0) {
        const result = data?.results?.find((item: any) => !item.plus_code);
        const plainAddress = removePlusCode(
          result?.formatted_address || data.results[0].formatted_address
        );
        if (plainAddress) {
          setAddress(plainAddress);
        } else {
          setAddress("Unable to fetch address");
        }
      } else {
        setAddress("Unable to fetch address");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Error fetching address");
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setLat(latitude);
        setLng(longitude);
        getAddressFromLatLng(latitude, longitude);
      } else {
        console.log("Location permission denied");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const setLocation = (latitude: number, longitude: number) => {
    setLat(latitude);
    setLng(longitude);
    getAddressFromLatLng(latitude, longitude);
  };

  return (
    <LocationContext.Provider value={{ lat, lng, address, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
