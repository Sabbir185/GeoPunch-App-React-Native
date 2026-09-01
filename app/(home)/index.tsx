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

  const isCheckedIn = user?.activityLog?.action === "Checked-In";

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
    >
      <View style={{ flex: 1 }}>
        {/* Modern Header Card */}
        <View style={styles.headerCard}>
          {/* Top Profile + Status Pill Row */}
          <View style={styles.profileRow}>
            <View style={{ flex: 1 }}>
              <UserProfile
                name={user?.name || "--"}
                address={address || "--"}
                email={
                  user?.designation
                    ? `${user?.designation}, ${user?.department || ""}`
                    : "--"
                }
                image={user?.image}
                imgSize={46}
                nameTitleSize={17}
              />
            </View>

            {/* Live Attendance Status Badge */}
            <View
              style={[
                styles.statusBadge,
                isCheckedIn ? styles.statusBadgeActive : styles.statusBadgeInactive,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isCheckedIn ? "#10B981" : "#94A3B8" },
                ]}
              />
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: isCheckedIn ? "#047857" : "#64748B" },
                ]}
              >
                {isCheckedIn ? "Active" : "Away"}
              </Text>
            </View>
          </View>

          {/* Clock & Date Display */}
          <View style={styles.clockSection}>
            <Text style={styles.clockTime}>
              {currentTime.format("h:mm A")}
            </Text>
            <View style={styles.datePill}>
              <Text style={styles.dateText}>
                {currentTime.format("dddd, D MMMM YYYY")}
              </Text>
            </View>
          </View>

          {/* GPS Location Pill */}
          <View style={styles.locationPill}>
            <Image
              source={images.location}
              style={styles.locationIcon}
            />
            <Text
              numberOfLines={1}
              style={styles.locationText}
            >
              {address || "Locating..."}
            </Text>
          </View>

          {/* Action Buttons */}
          <CheckInOutButton
            isCheckedIn={isCheckedIn}
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

        {/* Overview (Places of Presence) */}
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
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#F8FAFC",
    paddingBottom: 120,
  },
  headerCard: {
    width: "100%",
    backgroundColor: "#E2F4F1",
    borderBottomRightRadius: 36,
    borderBottomLeftRadius: 36,
    borderBottomWidth: 1,
    borderColor: "#CCEBE5",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 24,
    shadowColor: "#0F766E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusBadgeActive: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  statusBadgeInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderColor: "#E2E8F0",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: Fonts.UrbanistBold,
    letterSpacing: 0.2,
  },
  clockSection: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 10,
  },
  clockTime: {
    fontFamily: Fonts.UrbanistBold,
    fontSize: 32,
    color: "#0F172A",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  datePill: {
    marginTop: 3,
  },
  dateText: {
    fontFamily: Fonts.SatoshiMedium,
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    gap: 7,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: 6,
    marginBottom: 14,
    maxWidth: "92%",
    shadowColor: "#0F766E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  locationIcon: {
    width: 14,
    height: 14,
    tintColor: Colors.primary,
  },
  locationText: {
    fontSize: 12,
    fontFamily: Fonts.SatoshiMedium,
    color: "#334155",
    flexShrink: 1,
  },
});
