import { View, StyleSheet, Button } from "react-native";
import { Colors } from "../constants/Colors";

interface UserProfileScreenProps {
  onLogOut: () => void;
}

export const UserProfileScreen = ({ onLogOut }: UserProfileScreenProps) => {
  return (
    <View style={styles.container}>
      <Button title="Back" onPress={onLogOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    justifyContent: "center",
    alignItems: "center",
  },
});
