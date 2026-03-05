import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

interface KButtonSearchBudgetsProps {
  onPress: () => void;
}

export const KButtonSearchBudgets = ({
  onPress,
}: KButtonSearchBudgetsProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={require("../../assets/searchBudget.png")}
        style={styles.imageStyle}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "12%",
    aspectRatio: 1,
    backgroundColor: Colors.primary,
    borderRadius: 999,
    borderWidth: 0.2,
    borderColor: Colors.secundary,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.7,
  },
  imageStyle: {
    height: "45%",
    aspectRatio: 1,
    tintColor: Colors.textColor,
  },
});
