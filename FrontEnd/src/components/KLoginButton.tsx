import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

interface AuthButtonInterface {
  placeHolderButton: string;
  onPress: () => void;
}

export const KLoginButton = ({
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
    width: "70%",
    aspectRatio: 16 / 2.5,
    borderWidth: 1,
    backgroundColor: Colors.primary,
    borderColor: Colors.backgroundColor,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 3, height: 3 },
    shadowColor: Colors.shadowColorSecundary,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginTop: "10%",
  },
  placeHolderStyle: {
    color: Colors.backgroundColor,
    fontFamily: "bold",
    fontSize: 32,
    fontWeight: 500,
  },
});
