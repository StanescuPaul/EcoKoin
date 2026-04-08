import { RootTabParamList } from "../types";
import { ExpensesScreen } from "../screens/ExpensesScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator<RootTabParamList>();

export const ExpensesAndSavingsTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="ExpensesScreen" component={ExpensesAndSavingsTabs} />
      {/* <Tab.Screen name="SavingsScreen" component={} /> */}
    </Tab.Navigator>
  );
};
