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
import CheckedInOutButton from "@/components/common/checkedInOut";
import UserProfile from "@/components/home/Profile";
import dayjs from "dayjs";
import Overview from "@/components/home/Overview";
import { UserContext } from "@/contexts/user";
import { useLocation } from "@/contexts/LocationContext";
import {
  fetchAttendanceStatus,
  requestAutoAttendance,
  requestManualAttendance,
} from "@/services/api.helper";
import { showToast } from "@/services/toastConfig";
import axios from "axios";
import CheckInOutButton from "@/components/home/CheckInOutButton";

export default function Home() {
  const [attendenceStatus, setAttendenceStatus] = useState<any>();
  const [checkedStatus, setCheckedStatus] = useState("in");
  const { user, fetchUserProfile } = useContext(UserContext);
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const { lat, lng, address, setLocation } = useLocation();
  const [checkIndicator, setCheckIndicator] = useState(false);

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
      if (lat && lng && address) {
        try {
          const res = await requestAutoAttendance({
            location: {
              lat: lat,
              lng: lng,
              address: address,
            },
          });
          if (res?.statusCode === 400) {
            showToast("error", res?.message);
          }
          if (res?.status) {
            setCheckedStatus(res?.status);
            setRefreshing(!refreshing);
          }
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [lat, lng, address]);

  useEffect(() => {
    (async () => {
      try {
        const attendence = await fetchAttendanceStatus();
        setAttendenceStatus({
          ...attendence,
          my_location: { lat, lng, address },
        });
        if (attendence?.checkStatus === "in") {
          setCheckedStatus("in");
          setRefreshing(false);
        } else if (attendence?.checkStatus === "out") {
          setCheckedStatus("out");
          setRefreshing(false);
        }
      } catch (error) {
        console.log(error);
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
            isCheckedIn={false}
            onCheckIn={() => console.log("Check In pressed")}
            onCheckOut={() => console.log("Check out pressed")}
            isLoading={false}
          />
        </View>

        {/* Overview */}
        <Overview
          mostUsedItems={[
            { name: "Check In", id: "1" },
            { name: "Check Out", id: "2" },
            { name: "Break", id: "3" },
          ]}
          additionalItems={[
            { name: "Report", id: "4" },
            { name: "Settings", id: "5" },
            { name: "Help", id: "6" },
          ]}
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
