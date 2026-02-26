import { StyleSheet, View } from "react-native";
import { Colors } from "../constants/Colors";
import { KProfileButton } from "../components/KProfileButton";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";

interface HomeScreenProps {
  userId: string;
}

export const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleOnProfileButton = () => {
    navigation.navigate("UserProfileScreen");
  };
  //ToDo: scrollable si sa ii pot adauga headder-ul care a nu se miste cu scroll-ul
  return (
    <View style={styles.container}>
      <KProfileButton onProfileButton={handleOnProfileButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundColor,
  },
});
