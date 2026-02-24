import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

interface AuthButtonInterface {
  placeHolderButton: string;
  onPress: () => void;
}

export const KSignupButton = ({
  placeHolderButton,
  onPress,
}: AuthButtonInterface) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.placeHolderStyle}>{placeHolderButton}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "60%",
    aspectRatio: 16 / 2.5,
    borderWidth: 1,
    backgroundColor: Colors.backgroundColor,
    borderColor: Colors.primary,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 5, height: 5 },
    shadowColor: Colors.shadowColorPrimary,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  placeHolderStyle: {
    color: Colors.primary,
    fontFamily: "bold",
    fontSize: 32,
    fontWeight: 500,
  },
});
