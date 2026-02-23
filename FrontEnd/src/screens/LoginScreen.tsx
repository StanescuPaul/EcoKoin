import { View, Text, StyleSheet, Image } from "react-native";
import { Colors } from "../constants/Colors";

export const LoginScreen = () => {
  return <View style={styles.mainConstainer}></View>;
};

const styles = StyleSheet.create({
  mainConstainer: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
});
