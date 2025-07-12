import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Fonts } from "@/constants/Fonts";
import { Colors } from "@/constants/Colors";
import LoadingOverlay from "../common/LoadingOverlay";
import { updatePlaceOfPresence } from "@/services/api.helper";
import { showToast } from "@/services/toastConfig";

interface ItemProps {
  name: string;
  id: string;
}

interface IProps {
  mostUsedItems: ItemProps[];
  additionalItems: ItemProps[];
  fetchUserProfile: () => void;
  user?: any;
}

export default function Overview({
  mostUsedItems,
  additionalItems,
  fetchUserProfile,
  user,
}: IProps) {
  const [activityLoader, setActivityLoader] = React.useState(false);
  const [currentId, setCurrentId] = React.useState<
    undefined | number | string
  >();

  const handlePress = async (item: ItemProps) => {
    // console.log("Pressed:", item.name, "ID:", item.id);
    setCurrentId(item.id);
    setActivityLoader(true);
    try {
      const response = await updatePlaceOfPresence({ activityId: item.id });
      if (response?.status === 200) {
        showToast("success", response?.msg || "Place updated successfully");
        await fetchUserProfile();
      } else {
        showToast(
          "error",
          response?.msg || "Failed to update place. Please try again."
        );
      }
    } catch (error) {
      console.error("Error handling place:", error);
      showToast("error", "Failed to update place. Please try again.");
    } finally {
      setActivityLoader(false);
    }
  };

  const renderButtons = (items: ItemProps[]) =>
    items.map((item) => (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.button,
          {
            backgroundColor:
              user?.activityId === item.id ? Colors.primary : "#FFFFFF",
          },
        ]}
        onPress={() => handlePress(item)}
      >
        <View style={{flexDirection: "row", alignItems: "center", gap: 3}}>
          <Text
          style={[
            styles.buttonText,
            {
              color:
                user?.activityId === item.id ? "#ffffff" : Colors.text.primary,
            },
          ]}
        >
          {item.name}
        </Text>
        {activityLoader && currentId === item.id && (
          <ActivityIndicator size="small" />
        )}
        </View>
      </TouchableOpacity>
    ));

  if (mostUsedItems?.length === 0 || additionalItems?.length === 0) {
    return <LoadingOverlay message="Checking in..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Place Of Presence</Text>

      {/* Most Used Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Most Used</Text>
        <View style={styles.buttonsContainer}>
          {renderButtons(mostUsedItems)}
        </View>
      </View>

      {/* Additional Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional</Text>
        <View style={styles.buttonsContainer}>
          {renderButtons(additionalItems)}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 10,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.UrbanistSemibold,
    color: Colors.text.primary,
    fontWeight: 700,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.SatoshiMedium,
    color: Colors.text.secondary,
    fontWeight: 600,
    marginBottom: 16,
    opacity: 0.8,
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: Fonts.UrbanistSemibold,
    color: Colors.text.primary,
    textAlign: "center",
    fontWeight: 500,
  },
});
