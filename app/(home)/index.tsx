import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { images } from "@/constants/images";
import UserProfile from "@/components/home/Profile";
import dayjs from "dayjs";
import Overview from "@/components/home/Overview";
import { UserContext } from "@/contexts/user";
import { useLocation } from "@/contexts/LocationContext";
import { fetchPlaceOfPresence } from "@/services/api.helper";
import CheckInOutButton from "@/components/home/CheckInOutButton";
import LoadingOverlay from "@/components/common/LoadingOverlay";

export default function Home() {
  const { user, fetchUserProfile } = useContext(UserContext);
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const { lat, lng, address, setLocation } = useLocation();
  const [checkInIndicator, setCheckInIndicator] = useState(false);
  const [checkOutIndicator, setCheckOutIndicator] = useState(false);
  const [placeOfPresence, setPlaceOfPresence] = useState({
    common: [],
    additional: [],
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchUserProfile();
    setTimeout(async () => {
      setRefreshing(!refreshing);
    }, 2000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchPlaceOfPresence();
        if (res?.status === 200) {
          setPlaceOfPresence(res?.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setRefreshing(false);
      }
    })();
  }, [refreshing]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ flex: 1, marginBottom: 100 }}>
        {/* header -> checked in and out */}
        <View style={styles.container}>
          {/* profile info */}
          <View>
            <UserProfile
              name={user?.name || "--"}
              address={address || "--"}
              email={
                user?.designation
                  ? `${user?.designation}, ${user?.department}`
                  : "--"
              }
              image={user?.image}
            />

            {/* date time */}
            <Text style={styles.dateTime}>
              {currentTime.format("ddd, D MMM YYYY, h:mm A")}
            </Text>

            {/* location */}
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              <Image
                source={images.location}
                style={{
                  width: 18,
                  height: 18,
                  tintColor: Colors.primary,
                }}
              />
              <Text style={{ color: Colors.text.secondary }}>
                {address || ""}
              </Text>
            </View>
          </View>

          {/* check in, out button */}
          <CheckInOutButton
            isCheckedIn={user?.activityLog?.action === "Checked-In"}
            fetchUserProfile={fetchUserProfile}
            isLoading={!user}
            user={user}
            location={{ lat, lng, address }}
            setCheckInIndicator={setCheckInIndicator}
            setCheckOutIndicator={setCheckOutIndicator}
          />

          {checkInIndicator && <LoadingOverlay message="Checking in..." />}
          {checkOutIndicator && <LoadingOverlay message="Checking out..." />}
        </View>

        {/* Overview */}
        <Overview
          mostUsedItems={(placeOfPresence?.common || [])
            .slice()
            .sort(
              (a: any, b: any) =>
                (a?.name?.length || 0) - (b?.name?.length || 0)
            )}
          additionalItems={(placeOfPresence?.additional || [])
            .slice()
            .sort(
              (a: any, b: any) =>
                (a?.name?.length || 0) - (b?.name?.length || 0)
            )}
          fetchUserProfile={fetchUserProfile}
          user={user}
          setRefreshing={setRefreshing}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 320,
    backgroundColor: "#DAF3F3",
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderWidth: 0.5,
    borderColor: "#fff",
    position: "relative",
    padding: 20,
    paddingTop: 64,
  },
  mainText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    fontSize: 20,
  },
  dateTime: {
    fontFamily: Fonts.UrbanistSemibold,
    color: Colors.text.primary,
    fontWeight: 600,
    fontSize: 20,
    marginTop: 15,
    textAlign: "center",
  },
  mapActivity: {
    width: "100%",
    height: 300,
    marginTop: 20,
    padding: 20,
    marginBottom: 100,
    borderRadius: 20,
  },
});
