import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { Colors } from "../constants/Colors";

interface KButtonSaveData {
  handleSaveData: () => void;
}

export const KButtonSaveData = ({ handleSaveData }: KButtonSaveData) => {
  return (
    <TouchableOpacity onPress={handleSaveData} style={styles.container}>
      <Text style={styles.textStyle}>Save budget</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "85%",
    aspectRatio: 16 / 2.5,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    borderWidth: 0.2,
    borderColor: Colors.secundary,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    color: Colors.textColor,
    fontSize: 20,
  },
});
