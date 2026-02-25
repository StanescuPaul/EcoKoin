import { RootStackParamList } from "../types/index";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { LoadingScreen } from "../screens/LoadingScreen";
import { useAuth } from "../hooks/useAuth";

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const [tokenLogin, setTokenLogin] = useState<string | null>(null);
  const { authData, isLoading } = useAuth();

  useEffect(() => {
    if (authData) {
      setTokenLogin(authData.token);
    }
  }, [authData]);

  //randare loading screen pana apare homescreen-ul
  if (isLoading) return <LoadingScreen />;

  //primesc callback de la LoginScreen cu token pentru a forta o rerandare ca sa trecem la ecranele protected
  const onLoginSuccesfully = (token: string) => {
    setTokenLogin(token);
  };

  const handleOnLogOut = async () => {
    await SecureStore.deleteItemAsync("userToken");
    setTokenLogin(null);
  };

  return (
    <Stack.Navigator>
      {!tokenLogin ? (
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
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Home"
          //momentan pentru a ma potea intoarce din home
          // component={HomeScreen}
          options={{ headerShown: false }}
        >
          {(props) => (
            <HomeScreen
              {...props}
              userData={authData?.userId}
              onLogOut={handleOnLogOut} //scap de asta o data facut profile
            />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};
