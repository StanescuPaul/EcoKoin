import { RootStackParamList } from "../types/index";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      setAuthToken(token);
    };
    checkToken();
  });
  return (
    <Stack.Navigator>
      {!authToken ? (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};
