import { View, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

export const LoadingScreen = () => {
  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.textColor,
  },
});
