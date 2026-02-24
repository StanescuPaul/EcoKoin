import { Button, StyleSheet, View } from "react-native";

interface onLogOutInterface {
  onLogOut: () => void;
}

export const HomeScreen = ({ onLogOut }: onLogOutInterface) => {
  return (
    <View style={styles.container}>
      <Button title="back" onPress={onLogOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
