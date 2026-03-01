import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

interface KLogOutButtonProps {
  placeHolder: string;
  onPressLogOut: () => void;
}

export const KLogOutButton = ({
  placeHolder,
  onPressLogOut,
}: KLogOutButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPressLogOut}>
      <Text style={styles.placeHolderStyle}>{placeHolder}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "95%",
    aspectRatio: 16 / 2,
    backgroundColor: "#960303",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  placeHolderStyle: {
    fontSize: 25,
    fontWeight: 500,
    color: Colors.textColor,
  },
});
