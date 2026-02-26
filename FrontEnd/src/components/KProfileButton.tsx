import { TouchableOpacity, StyleSheet, Image } from "react-native";

interface KProfileButtonProps {
  onProfileButton: () => void;
}

export const KProfileButton = ({ onProfileButton }: KProfileButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onProfileButton}>
      <Image
        style={styles.imageStyle}
        source={require("../../assets/ProfileButtonImage.jpg")}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "4%",
    aspectRatio: 1,
    borderRadius: 999,
    position: "absolute",
    top: "7%",
    left: "3.5%",
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
});
