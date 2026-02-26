import { Button, StyleSheet, View } from "react-native";

interface HomeScreenProps {
  onLogOut: () => void;
  userId: string | undefined;
}

export const HomeScreen = ({ userId, onLogOut }: HomeScreenProps) => {
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
