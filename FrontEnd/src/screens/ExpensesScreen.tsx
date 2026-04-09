import { View, StyleSheet } from "react-native";
import { RootTabParamList } from "../types";
import { useRoute, RouteProp } from "@react-navigation/native";

interface ExpensesScreenProps {}

export const ExpensesScreen = () => {
  const route = useRoute<RouteProp<RootTabParamList, "ExpensesScreen">>();

  const { budgetId, budgetName, budgetAmount } = route.params;

  console.log(budgetId);
  console.log(budgetName);
  console.log(budgetAmount);
  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
