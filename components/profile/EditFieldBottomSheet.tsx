import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import Modal from "react-native-modal";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { showToast } from "@/services/toastConfig";
import axios from "axios";
import { updateProfile } from "@/services/api.helper";
import { UserContext } from "@/contexts/user";

interface EditFieldBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  fieldName: string;
  fieldValue: string;
  onSave?: (value: string) => void;
  label: string;
  inputType?: "text" | "email" | "phone";
  setIsUpdated?: (value: boolean) => void;
  isUpdated?: boolean;
}

const EditFieldBottomSheet: React.FC<EditFieldBottomSheetProps> = ({
  visible,
  onClose,
  fieldName,
  fieldValue,
  onSave = () => {},
  label,
  inputType = "text",
  setIsUpdated = () => {},
  isUpdated = false,
}) => {
  const [value, setValue] = React.useState(fieldValue);
  const [isIndicator, setIsIndicator] = useState(false);
  const { fetchUserProfile } = useContext(UserContext);

  React.useEffect(() => {
    setValue(fieldValue);
  }, [fieldValue]);

  const handleSave = async () => {
    const payload: any = {};
    payload[fieldName] = value;
    try {
      setIsIndicator(true);
      const res = await updateProfile(payload);
      if (res?.statusCode === 400) {
        showToast("error", res?.message);
      } else if (res?.statusCode === 401) {
        showToast("error", res?.message);
      } else {
        showToast("success", res?.message || "Data updated successfully");
        await fetchUserProfile();
        setIsUpdated(!isUpdated);
        onClose();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showToast(
          "error",
          error.response?.data?.message || "Failed to update, Please try again."
        );
      } else {
        showToast("error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsIndicator(false);
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit {label}</Text>
          <View style={styles.dragHandle} />
        </View>

        <View style={styles.content}>
          <TextInput
            label={label}
            value={value}
            onChangeText={setValue}
            mode="outlined"
            style={styles.input}
            outlineColor={Colors.boarder}
            activeOutlineColor={Colors.light}
            keyboardType={
              inputType === "email"
                ? "email-address"
                : inputType === "phone"
                ? "phone-pad"
                : "default"
            }
            autoCapitalize={inputType === "email" ? "none" : "words"}
          />

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={onClose}
              style={[styles.button, styles.cancelButton]}
              labelStyle={styles.cancelButtonText}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={[styles.button, styles.saveButton]}
              labelStyle={styles.saveButtonText}
            >
              Save
            </Button>
          </View>
        </View>
        {isIndicator && (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={Colors.primary}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.UrbanistBold,
    color: Colors.text.primary,
    marginBottom: 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: Colors.text.tertiary,
    borderRadius: 5,
  },
  content: {
    paddingHorizontal: 10,
  },
  input: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  cancelButton: {
    borderColor: Colors.light,
  },
  cancelButtonText: {
    color: Colors.text.primary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  saveButtonText: {
    color: Colors.white,
  },
});

export default EditFieldBottomSheet;
