import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

interface AuthButtonInterface {
  placeHolderButton: string;
  onPressLogIn: () => void;
}

export const KLoginButton = ({
  placeHolderButton,
  onPressLogIn,
}: AuthButtonInterface) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPressLogIn}>
      <Text style={styles.placeHolderStyle}>{placeHolderButton}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "70%",
    aspectRatio: 16 / 2.5,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.3,
    borderColor: Colors.secundary,
    marginTop: "10%",
  },
  placeHolderStyle: {
    color: Colors.textColor,
    fontFamily: "bold",
    fontSize: 30,
    fontWeight: 400,
  },
});
