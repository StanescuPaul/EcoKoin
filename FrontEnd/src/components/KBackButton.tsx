import { TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface KBackButtonProps {
  onPressBack: () => void;
}

export const KBackButton = ({ onPressBack }: KBackButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPressBack}>
      <Ionicons name="chevron-back" size={30} style={styles.arrowStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "27.5%",
    aspectRatio: 1,
    backgroundColor: Colors.primary,
    marginLeft: "10%",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.secundary,
    borderWidth: 0.2,
  },
  arrowStyle: {
    color: Colors.textColor,
  },
});
