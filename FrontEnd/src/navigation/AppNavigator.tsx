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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //incarcare JWT din SecureStorage la fiecare rulare a aplicatie pentru a persista Login
  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      setAuthToken(token);
      setIsLoading(false);
    };
    checkToken();
  }, []);

  //ToDo: loading screen
  // if (isLoading) return "ceva";

  const onLoginSuccesfully = (token: string) => {
    setAuthToken(token);
  };

  const handleOnLogOut = async () => {
    await SecureStore.deleteItemAsync("userToken");
    setAuthToken(null);
  };

  return (
    <Stack.Navigator>
      {!authToken ? (
        <>
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => (
              //trebuie transmise si props pentru a avea acces la navigate si la route pentru ca nu mai folosim component care facea asta automat
              <LoginScreen {...props} onLoginSuccesfully={onLoginSuccesfully} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: true }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Home"
          //momentan pentru a ma potea intoarce din home
          // component={HomeScreen}
          options={{ headerShown: false }}
        >
          {(props) => <HomeScreen {...props} onLogOut={handleOnLogOut} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};
