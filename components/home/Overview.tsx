import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Fonts } from "@/constants/Fonts";
import { Colors } from "@/constants/Colors";

interface ItemProps {
  name: string;
  id: string;
}

interface IProps {
  mostUsedItems: ItemProps[];
  additionalItems: ItemProps[];
}

export default function Overview({ mostUsedItems, additionalItems }: IProps) {
  const handlePress = (item: ItemProps) => {
    console.log("Pressed:", item.name, "ID:", item.id);
    // Handle button press here
  };

  const renderButtons = (items: ItemProps[]) => 
    items.map((item) => (
      <TouchableOpacity
        key={item.id}
        style={styles.button}
        onPress={() => handlePress(item)}
      >
        <Text style={styles.buttonText}>{item.name}</Text>
      </TouchableOpacity>
    ));

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
