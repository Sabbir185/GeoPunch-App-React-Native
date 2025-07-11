import config from "@/config";
import axios from "axios";

export const getLocationName = async (lat: number, lng: number) => {
  const apiKey = config.GOOGLE_API_KEY || ""; // Replace with your Google API key
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const location = response.data.results[0].formatted_address;
      return location;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
};

// Example usage:
// getLocationName(40.748817, -73.985428); // Latitude and Longitude for the Empire State Building
