import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

function LoadingOverlay({ message }: { message?: string }) {
  return (
    <View style={styles.rootContainer}>
      {message && <Text style={styles.message}>{message}</Text>}
      <ActivityIndicator size="large" />
    </View>
  );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
  },
});
