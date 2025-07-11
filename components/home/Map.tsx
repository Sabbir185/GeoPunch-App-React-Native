import { images } from "@/constants/images";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const defaultRegion = {
  latitude: 28.6139, // New Delhi Latitude
  longitude: 77.209, // New Delhi Longitude
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function RecentActivityMap(props: any) {
  const [region, setRegion] = useState(defaultRegion);
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    const updatedMarkers = [
      props?.checkInLat && props?.checkInLng
        ? {
            id: 1,
            title: "Check In",
            description: props?.checkIn
              ? dayjs(props.checkIn).format("hh:mm A")
              : "N/A",
            coordinate: {
              latitude: props.checkInLat,
              longitude: props.checkInLng,
            },
            icon: images.locationPinGreen,
          }
        : null,
      props?.my_location?.lat && props?.my_location?.lng
        ? {
            id: 2,
            title: "Me",
            description: props?.my_location?.address || "My Current Position",
            coordinate: {
              latitude: props.my_location.lat,
              longitude: props.my_location.lng,
            },
            icon: images.locationPin,
          }
        : null,
      props?.checkOutLat && props?.checkOutLng
        ? {
            id: 3,
            title: "Check Out",
            description: props?.checkOut
              ? dayjs(props.checkOut).format("hh:mm A")
              : "N/A",
            coordinate: {
              latitude: props.checkOutLat,
              longitude: props.checkOutLng,
            },
            icon: images.marker1,
          }
        : null,
    ].filter(Boolean);

    setMarkers(updatedMarkers);

    // Update region based on my_location if available
    if (props?.my_location?.lat && props?.my_location?.lng) {
      setRegion({
        latitude: props.my_location.lat,
        longitude: props.my_location.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [
    props?.my_location,
    props?.checkInLat,
    props?.checkInLng,
    props?.checkOutLat,
    props?.checkOutLng,
    props?.checkIn,
    props?.checkOut,
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          provider="google"
          style={styles.map}
          initialRegion={defaultRegion}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
              image={marker.icon}
            />
          ))}
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
});
