import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

interface AuthButtonInterface {
  placeHolderButton: string;
  onPressSignUp: () => void;
}

export const KSignupButton = ({
  placeHolderButton,
  onPressSignUp,
}: AuthButtonInterface) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPressSignUp}>
      <Text style={styles.placeHolderStyle}>{placeHolderButton}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "55%",
    aspectRatio: 16 / 2.6,
    borderWidth: 0.3,
    backgroundColor: Colors.backgroundColor,
    borderColor: Colors.secundary,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  placeHolderStyle: {
    color: Colors.textColor,
    fontFamily: "bold",
    fontSize: 30,
    fontWeight: 400,
  },
});
