import { View, StyleSheet, ScrollView, Text } from "react-native";
import { RootTabParamList } from "../types";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { KBackButton } from "../components/KBackButton";
import { KEditButton } from "../components/KEditButton";
import { KSaveButton } from "../components/KSaveButton";
import { Colors } from "../constants/Colors";
import { KButtonExpensesAndSavings } from "../components/KButtonExpensesAndSavings";

interface ExpensesScreenProps {}

export const ExpensesScreen = () => {
  const route = useRoute<RouteProp<RootTabParamList, "ExpensesScreen">>();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { budgetId, budgetName, budgetAmount, budgetCompleted } = route.params;

  const [isEditing, setIsEditing] = useState<boolean>(false);

  //Rendering the props for the header of the screen
  useLayoutEffect(() => {
    navigation.setOptions({ title: budgetName || "Expenses" });
    navigation.setOptions({
      headerLeft: () => <KBackButton onPressBack={navigation.goBack} />,
      headerRight: () =>
        budgetCompleted ? null : isEditing ? (
          <KSaveButton onPressSave={handleOnSave} />
        ) : (
          <KEditButton onPressEdit={handleOnEdit} />
        ),
    });
  });

  const handleOnSave = () => {
    setIsEditing(false);
  };

  const handleOnEdit = () => {
    setIsEditing(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.containerScroll}>
        <KButtonExpensesAndSavings isEditing={isEditing} />
      </ScrollView>
      <View style={styles.totalView}>
        <Text style={styles.totalStyle}>Budget: {budgetAmount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  containerScroll: {
    flexGrow: 1,
    backgroundColor: Colors.backgroundColor,
    alignItems: "center",
    gap: 10,
    marginTop: "8%",
  },
  totalStyle: {
    color: Colors.textColor,
    fontSize: 18,
    fontWeight: "500",
  },
  totalView: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    top: "0%",
    alignItems: "center",
    width: "100%",
  },
});
