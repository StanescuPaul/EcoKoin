import { RootTabParamList } from "../types";
import { RootStackParamList } from "../types";
import { ExpensesScreen } from "../screens/ExpensesScreen";
import { SavingsScreen } from "../screens/SavingsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StackScreenProps } from "@react-navigation/stack";

const Tab = createBottomTabNavigator<RootTabParamList>();

export const ExpensesAndSavingsTabs = ({
  route,
}: StackScreenProps<RootStackParamList, "ExpensesAndSavingsScreen">) => {
  const { budgetId, budgetName, budgetAmount } = route.params;

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ExpensesScreen"
        component={ExpensesScreen}
        initialParams={{ budgetName, budgetId, budgetAmount }}
      />
      <Tab.Screen
        name="SavingsScreen"
        component={SavingsScreen}
        initialParams={{ budgetName, budgetId, budgetAmount }}
      />
    </Tab.Navigator>
  );
};
