import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Fonts } from "@/constants/Fonts";
import ActivityCard from "@/components/activity/ActivityCard";
import dayjs from "dayjs";
import { fetchAttendanceLogs } from "@/services/api.helper";
import LoadingOverlay from "@/components/common/LoadingOverlay";

export default function Activity() {
  const [activities, setActivities] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState({
    year: dayjs().year(),
    month: dayjs().month() + 1,
  });

  const months = [
    { name: "January", number: 1 },
    { name: "February", number: 2 },
    { name: "March", number: 3 },
    { name: "April", number: 4 },
    { name: "May", number: 5 },
    { name: "June", number: 6 },
    { name: "July", number: 7 },
    { name: "August", number: 8 },
    { name: "September", number: 9 },
    { name: "October", number: 10 },
    { name: "November", number: 11 },
    { name: "December", number: 12 },
  ];

  const years = Array.from({ length: 6 }, (_, i) => dayjs().year() - i);

  const fetchActivities = async () => {
    try {
      const res = await fetchAttendanceLogs({
        year: filter.year,
        month: filter.month,
      });
      if (res?.data) {
        setActivities(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [filter, refreshing]);

  const [loader, setLoader] = useState(true);
  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      setLoader(false);
    }, 5000);
    return () => clearTimeout(loaderTimer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleFilterChange = (key: string, value: number) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
    setShowFilter(false);
  };

  const getCurrentMonthName = () => {
    const month = months.find((m) => m.number === filter.month);
    return month ? month.name : "";
  };

  const showLoader = () => {
    return <LoadingOverlay message="Data is loading..." />;
  };

  return (
    <View style={styles.container}>
      {/* Header and filter section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Activity</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilter(true)}
        >
          <Text>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilter}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilter(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Activities</Text>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Year:</Text>
              <View style={styles.filterOptions}>
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.filterOption,
                      filter.year === year && styles.selectedOption,
                    ]}
                    onPress={() => handleFilterChange("year", year)}
                  >
                    <Text style={filter.year === year && styles.selectedText}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Month:</Text>
              <View style={styles.filterOptions}>
                {months.map((month) => (
                  <TouchableOpacity
                    key={month.number}
                    style={[
                      styles.filterOption,
                      filter.month === month.number && styles.selectedOption,
                    ]}
                    onPress={() => handleFilterChange("month", month.number)}
                  >
                    <Text
                      style={
                        filter.month === month.number && styles.selectedText
                      }
                    >
                      {month.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFilter(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Activity list */}
      <View style={styles.activityContainer}>
        {activities.length === 0 && !loader ? (
          <Text style={{ textAlign: "center", color: "#888" }}>
            No activity found for {getCurrentMonthName()} {filter.year}
          </Text>
        ) : (
          <>
            {activities?.length === 0 && loader ? (
              showLoader()
            ) : (
              <FlatList
                data={activities}
                keyExtractor={(item) => item.id}
                renderItem={({ item }: { item: any }) => (
                  <ActivityCard
                    date={dayjs(item.date).format("MMMM D, YYYY")}
                    location={item?.checkedInPlace?.address}
                    checkIn={
                      item?.checkedInTime
                        ? dayjs(item.checkedInTime).format("hh:mm A")
                        : "N/A"
                    }
                    checkOut={
                      item?.checkedOutTime
                        ? dayjs(item.checkedOutTime).format("hh:mm A")
                        : "N/A"
                    }
                  />
                )}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 135 }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
              />
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 70,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    position: "relative",
    marginBottom: 15,
    alignItems: "center",
  },
  headerText: {
    fontFamily: Fonts.UrbanistSemibold,
    fontSize: 20,
    fontWeight: "700",
    width: "100%",
    textAlign: "center",
  },
  filterButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activityContainer: {
    marginTop: 5,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontWeight: "600",
    marginBottom: 10,
    fontSize: 16,
    color: "#444",
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  filterOption: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedOption: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  selectedText: {
    color: "white",
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
