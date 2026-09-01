import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import React from "react";
import { Fonts } from "@/constants/Fonts";
import { Colors } from "@/constants/Colors";
import LoadingOverlay from "../common/LoadingOverlay";
import {
  addPlaceOfPresence,
  updatePlaceOfPresence,
} from "@/services/api.helper";
import { showToast } from "@/services/toastConfig";
import config from "@/config";

interface ItemProps {
  name: string;
  id: string;
}

interface IProps {
  mostUsedItems: ItemProps[];
  additionalItems: ItemProps[];
  fetchUserProfile: () => void;
  user?: any;
  setRefreshing: (value: boolean) => void | boolean;
}

export default function Overview({
  mostUsedItems,
  additionalItems,
  fetchUserProfile,
  user,
  setRefreshing,
}: IProps) {
  const [activityLoader, setActivityLoader] = React.useState(false);
  const [currentId, setCurrentId] = React.useState<
    undefined | number | string
  >();
  const [isAutoMode, setIsAutoMode] = React.useState(false); // Default to manual mode (false = manual)
  const [modalVisible, setModalVisible] = React.useState(false);
  const [newPlaceName, setNewPlaceName] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("Most Used");
  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const [addPlaceLoading, setAddPlaceLoading] = React.useState(false);

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

  const handleAddPlace = async () => {
    if (!newPlaceName.trim()) {
      Alert.alert("Error", "Please enter a place name");
      return;
    }
    
    setAddPlaceLoading(true);
    
    try {
      const result = await addPlaceOfPresence({
        name: newPlaceName,
        type: selectedType === "Most Used" ? "common" : "additional",
      });
      if (result?.status === 200) {
        showToast("success", result?.msg || "Place added successfully");
        setRefreshing(true);
        await fetchUserProfile();
        
        // Reset form and close modal
        setNewPlaceName("");
        setSelectedType("Most Used");
        setDropdownVisible(false);
        setModalVisible(false);
      } else {
        showToast(
          "error",
          result?.msg || "Failed to add place. Please try again."
        );
      }
    } catch (error) {
      console.error("Error adding place:", error);
      showToast("error", "Failed to add place. Please try again.");
    } finally {
      setAddPlaceLoading(false);
    }
  };

  const renderButtons = (items: ItemProps[]) =>
    items.map((item) => {
      const isSelected = user?.activityId === item.id;
      const isLoadingThis = activityLoader && currentId === item.id;

      return (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.75}
          style={[
            styles.button,
            isSelected ? styles.buttonSelected : styles.buttonUnselected,
          ]}
          onPress={() => handlePress(item)}
        >
          <View style={styles.buttonContent}>
            {isSelected && !isLoadingThis && (
              <View style={styles.selectedDot}>
                <Text style={styles.checkIcon}>✓</Text>
              </View>
            )}
            <Text
              style={[
                styles.buttonText,
                isSelected ? styles.buttonTextSelected : styles.buttonTextUnselected,
              ]}
            >
              {item.name}
            </Text>
            {isLoadingThis && (
              <ActivityIndicator
                size="small"
                color={isSelected ? "#FFFFFF" : Colors.primary}
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
        </TouchableOpacity>
      );
    });

  if (mostUsedItems?.length === 0 || additionalItems?.length === 0) {
    return <LoadingOverlay message="Checking in..." />;
  }

  // Find current active place name
  const currentActivePlace =
    [...mostUsedItems, ...additionalItems].find(
      (item) => item.id === user?.activityId
    )?.name;

  return (
    <View style={styles.container}>
      {/* Section Header Row */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Place of Presence</Text>
          <Text style={styles.subtitle}>Select your active workspace</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addPlaceBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addPlacePlus}>+</Text>
          <Text style={styles.addPlaceText}>Add Place</Text>
        </TouchableOpacity>
      </View>

      {/* Active Place Pill Banner (if any) */}
      {currentActivePlace && (
        <View style={styles.activeBanner}>
          <View style={styles.activeBannerPulse} />
          <Text style={styles.activeBannerLabel}>Currently at:</Text>
          <Text style={styles.activeBannerValue}>{currentActivePlace}</Text>
        </View>
      )}

      {/* Most Used Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🔥</Text>
          <Text style={styles.sectionTitle}>Frequently Visited</Text>
        </View>
        <View style={styles.buttonsContainer}>
          {renderButtons(mostUsedItems)}
        </View>
      </View>

      {/* Additional Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>📍</Text>
          <Text style={styles.sectionTitle}>Additional Areas</Text>
        </View>
        <View style={styles.buttonsContainer}>
          {renderButtons(additionalItems)}
        </View>
      </View>

      {/* Add Place Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Place</Text>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Place Name</Text>
              <TextInput
                style={styles.textInput}
                value={newPlaceName}
                onChangeText={setNewPlaceName}
                placeholder="e.g. Lab 3, Conference Room"
                placeholderTextColor={Colors.text.tertiary}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Category</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setDropdownVisible(!dropdownVisible)}
              >
                <Text style={styles.dropdownText}>{selectedType}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>

              {dropdownVisible && (
                <View style={styles.dropdownOptions}>
                  <TouchableOpacity
                    style={[styles.dropdownOption, styles.mostUsedOption]}
                    onPress={() => {
                      setSelectedType("Most Used");
                      setDropdownVisible(false);
                    }}
                  >
                    <Text
                      style={[styles.dropdownOptionText, styles.mostUsedText]}
                    >
                      Frequently Visited (Most Used)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.dropdownOption, styles.additionalOption]}
                    onPress={() => {
                      setSelectedType("Additional");
                      setDropdownVisible(false);
                    }}
                  >
                    <Text
                      style={[styles.dropdownOptionText, styles.additionalText]}
                    >
                      Additional Area
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addModalButton]}
                onPress={handleAddPlace}
                disabled={addPlaceLoading}
              >
                {addPlaceLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.addModalButtonText}>Save Place</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 18,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.UrbanistBold,
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: Fonts.SatoshiMedium,
    color: "#64748B",
    marginTop: 2,
  },
  addPlaceBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF1EB",
    borderWidth: 1,
    borderColor: "#FED7AA",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  addPlacePlus: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: Fonts.UrbanistBold,
    lineHeight: 18,
  },
  addPlaceText: {
    fontSize: 12,
    color: Colors.primary,
    fontFamily: Fonts.UrbanistBold,
  },
  activeBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  activeBannerPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3B82F6",
  },
  activeBannerLabel: {
    fontSize: 12,
    fontFamily: Fonts.SatoshiMedium,
    color: "#475569",
  },
  activeBannerValue: {
    fontSize: 13,
    fontFamily: Fonts.UrbanistBold,
    color: "#1D4ED8",
  },
  section: {
    marginBottom: 22,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: Fonts.UrbanistBold,
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSelected: {
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonUnselected: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  selectedDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    lineHeight: 12,
  },
  buttonText: {
    fontSize: 14,
    letterSpacing: -0.2,
  },
  buttonTextSelected: {
    color: "#FFFFFF",
    fontFamily: Fonts.UrbanistBold,
  },
  buttonTextUnselected: {
    color: "#334155",
    fontFamily: Fonts.UrbanistSemibold,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: "90%",
    maxWidth: 400,
    minHeight: 350,
    maxHeight: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: Fonts.UrbanistSemibold,
    color: Colors.text.primary,
    fontWeight: 600,
    marginBottom: 24,
    textAlign: "center",
  },
  formField: {
    marginBottom: 20,
    position: "relative",
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: Fonts.SatoshiMedium,
    color: Colors.text.primary,
    fontWeight: 500,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E8EAE8",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: Fonts.SatoshiMedium,
    color: Colors.text.primary,
    backgroundColor: "#FFFFFF",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#E8EAE8",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: Fonts.SatoshiMedium,
    color: Colors.text.primary,
  },
  dropdownArrow: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  dropdownOptions: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: "#E8EAE8",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginTop: 4,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 1000,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dropdownOptionText: {
    fontSize: 16,
    fontFamily: Fonts.SatoshiMedium,
    color: Colors.text.primary,
  },
  mostUsedOption: {
    backgroundColor: "#FFF5F2",
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  mostUsedText: {
    color: Colors.primary,
    fontWeight: 600,
  },
  additionalOption: {
    backgroundColor: "#F0F9FF",
    borderLeftWidth: 3,
    borderLeftColor: "#2196F3",
  },
  additionalText: {
    color: "#2196F3",
    fontWeight: 600,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E8EAE8",
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: Fonts.SatoshiMedium,
    color: Colors.text.secondary,
    fontWeight: 500,
  },
  addModalButton: {
    backgroundColor: Colors.primary,
  },
  addModalButtonText: {
    fontSize: 16,
    fontFamily: Fonts.SatoshiMedium,
    color: "#FFFFFF",
    fontWeight: 600,
  },
});
