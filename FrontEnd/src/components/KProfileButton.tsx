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
    width: "27.5%",
    aspectRatio: 1,
    borderRadius: 999,
    marginLeft: "10%",
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
});
