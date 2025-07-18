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
    try {
      const result = await addPlaceOfPresence({
        name: newPlaceName,
        type: selectedType === "Most Used" ? "common" : "additional",
      });
      if (result?.status === 200) {
        showToast("success", result?.msg || "Place added successfully");
        setRefreshing(true);
        await fetchUserProfile();
      } else {
        showToast(
          "error",
          result?.msg || "Failed to add place. Please try again."
        );
      }
    } catch (error) {
      console.error("Error adding place:", error);
      showToast("error", "Failed to add place. Please try again.");
      return;
    }

    // Reset form and close modal
    setNewPlaceName("");
    setSelectedType("Most Used");
    setDropdownVisible(false);
    setModalVisible(false);
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          <Text
            style={[
              styles.buttonText,
              {
                color:
                  user?.activityId === item.id
                    ? "#ffffff"
                    : Colors.text.primary,
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
      {/* Title */}
      <Text style={styles.title}>Place Of Presence</Text>

      {/* Switch and Add Button Row */}
      <View style={styles.controlsRow}>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Manual</Text>
          <Switch
            value={isAutoMode}
            onValueChange={setIsAutoMode}
            trackColor={{ false: Colors.primary, true: "#4CAF50" }}
            thumbColor={isAutoMode ? "#FFFFFF" : "#FFFFFF"}
            ios_backgroundColor="#E8EAE8"
          />
          <Text style={styles.switchLabel}>Auto</Text>
        </View>

        {!isAutoMode && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        )}
      </View>

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

      {/* Add Place Modal */}
      <Modal
        animationType="slide"
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
                placeholder="Enter place name"
                placeholderTextColor={Colors.text.tertiary}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Type</Text>
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
                      Most Used
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
                      Additional
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
              >
                <Text style={styles.addModalButtonText}>Add Place</Text>
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
    marginTop: 10,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.UrbanistSemibold,
    color: Colors.text.primary,
    fontWeight: 700,
    marginBottom: 16,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  switchLabel: {
    fontSize: 14,
    fontFamily: Fonts.SatoshiMedium,
    color: Colors.text.secondary,
    fontWeight: 500,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 22,
    color: "#FFFFFF",
    fontFamily: Fonts.UrbanistSemibold,
    fontWeight: 600,
    textAlign: "center",
    lineHeight: 22,
    includeFontPadding: false,
    textAlignVertical: "center",
    marginTop: 1,
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
