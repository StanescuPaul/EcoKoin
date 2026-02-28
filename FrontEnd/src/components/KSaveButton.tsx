import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

interface KSaveButtonProps {
  onPressSave: () => void;
}

export const KSaveButton = ({ onPressSave }: KSaveButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPressSave}>
      <Text style={styles.textStyle}>Save</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "60%",
    aspectRatio: 16 / 6,
    backgroundColor: Colors.primary,
    marginRight: "10%",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.secundary,
    borderWidth: 0.2,
  },
  textStyle: {
    color: Colors.textColor,
    fontSize: 20,
    fontWeight: 500,
  },
});
