import { useEffect, useState } from "react";
import { Button, Image, View, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Alert } from "react-native";

interface ImagePickerProps {
  imageValue?: any;
  setImageValue?: (value: any) => void;
}

export default function ImagePickerInput({
  imageValue,
  setImageValue = () => {},
}: ImagePickerProps) {
  const [image, setImage] = useState<any>();

  useEffect(() => {
    if (imageValue) {
      setImage(imageValue);
    }
  }, [imageValue]);

  const pickImage = async () => {
    const options = ["Take Photo", "Choose from Library", "Cancel"];
    const cancelIndex = 2;

    Alert.alert("Upload Image", "Choose an option", [
      {
        text: options[0],
        onPress: async () => {
          const cameraPermission =
            await ImagePicker.requestCameraPermissionsAsync();
          if (!cameraPermission.granted) {
            alert("Camera access is required to take photos.");
            return;
          }

          let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
          });

          if (!result.canceled) {
            setImage(result.assets[0].uri);
            setImageValue(result);
          }
        },
      },
      {
        text: options[1],
        onPress: async () => {
          const mediaPermission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!mediaPermission.granted) {
            alert("Media library access is required to select images.");
            return;
          }

          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images","videos"],
            allowsEditing: true,
            quality: 1,
          });

          if (!result.canceled) {
            setImage(result.assets[0].uri);
            setImageValue(result);
          }
        },
      },
      {
        text: options[2],
        style: "cancel",
      },
    ]);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={
            image ? { uri: typeof image === "string" ? image : image?.assets[0]?.uri } : require("../../assets/images/user.png")
          }
          style={styles.image}
        />
        <View style={styles.cameraIcon} onTouchStart={pickImage}>
          <Icon name="camera" color={"white"} size={25} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  imageContainer: {
    position: "relative",
    marginTop: 30,
  },
  cameraIcon: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 100,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});
