import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

interface KButtonCloseProps {
  handleOnClose: () => void;
}

export const KButtonClose = ({ handleOnClose }: KButtonCloseProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={handleOnClose}>
      <Image
        source={require("../../assets/close.png")}
        style={styles.imageStyle}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "8%",
    aspectRatio: 1,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "5%",
    right: "5%",
  },
  imageStyle: {
    height: "80%",
    aspectRatio: 1,
    tintColor: Colors.textColor,
  },
});
