import { RootTabParamList } from "../types";
import { RootStackParamList } from "../types";
import { ExpensesScreen } from "../screens/ExpensesScreen";
import { SavingsScreen } from "../screens/SavingsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { Colors } from "../constants/Colors";

const Tab = createBottomTabNavigator<RootTabParamList>();

export const ExpensesAndSavingsTabs = ({
  route,
}: StackScreenProps<RootStackParamList, "ExpensesAndSavingsScreen">) => {
  const { budgetId, budgetName, budgetAmount } = route.params;

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.backgroundColor,
        },
        headerTitleStyle: {
          color: Colors.textColor,
        },
        tabBarStyle: {
          backgroundColor: Colors.backgroundColor,
          height: "8%",
          borderColor: Colors.backgroundColor,
        },
        tabBarLabelStyle: { color: Colors.textColor, fontSize: 13 },
      }}
    >
      <Tab.Screen
        name="ExpensesScreen"
        component={ExpensesScreen}
        initialParams={{ budgetName, budgetId, budgetAmount }}
        options={{ tabBarLabel: `Expenses` }}
      />
      <Tab.Screen
        name="SavingsScreen"
        component={SavingsScreen}
        initialParams={{ budgetName, budgetId, budgetAmount }}
        options={{ tabBarLabel: "Savings" }}
      />
    </Tab.Navigator>
  );
};
