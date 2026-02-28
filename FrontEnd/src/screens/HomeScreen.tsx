import { StyleSheet, View } from "react-native";
import { Colors } from "../constants/Colors";
import { KProfileButton } from "../components/KProfileButton";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";

export const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  //useLayoutEffect este pentru lucru sincron ca sa se execute acest cod inainte de randarea ecranului useEffect randa dupa si se vedea header-ul vechi
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <KProfileButton onProfileButton={handleOnProfileButton} />
      ),
    });
  }, [navigation]);

  navigation.setOptions;
  const handleOnProfileButton = () => {
    navigation.navigate("UserProfileScreen");
  };
  //ToDo: scrollable si sa ii pot adauga headder-ul care a nu se miste cu scroll-ul
  return <ScrollView style={styles.container}></ScrollView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
});
