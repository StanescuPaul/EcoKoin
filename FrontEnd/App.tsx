import { NavigationContainer } from "@react-navigation/native";
import { AppNavigation } from "./src/AppNavigation/AppNavigation";

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigation />
    </NavigationContainer>
  );
}
