import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";

interface ProfileBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  focusedField: string | null;
}

const ProfileBottomSheet: React.FC<ProfileBottomSheetProps> = ({
  isVisible,
  onClose,
  focusedField,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Snap points for the bottom sheet
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // Handle close event
  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
    onClose();
  }, [onClose]);

  // Render backdrop for the bottom sheet
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  // Content based on the focused field
  const renderContent = () => {
    switch (focusedField) {
      case "name":
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Edit Full Name</Text>
            <Text style={styles.subtitle}>
              Update your full name to keep your profile up to date.
            </Text>
            {/* Add your input field or other components here */}
          </View>
        );
      case "email":
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Edit Email</Text>
            <Text style={styles.subtitle}>
              Update your email address to receive important notifications.
            </Text>
            {/* Add your input field or other components here */}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {isVisible && (
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          onClose={handleClose}
          enablePanDownToClose={true}
        >
          <View style={styles.container}>
            {renderContent()}
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: Fonts.UrbanistBold,
    fontSize: 20,
    color: Colors.text.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: Fonts.Urbanist,
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: Colors.light,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    fontFamily: Fonts.UrbanistSemibold,
    fontSize: 16,
    color: Colors.text.primary,
  },
});

export default ProfileBottomSheet;
