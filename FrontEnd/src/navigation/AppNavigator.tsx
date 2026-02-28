import { RootStackParamList } from "../types/index";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { LoadingScreen } from "../screens/LoadingScreen";
import { UserProfileScreen } from "../screens/UserProfileScreen";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { userProps } from "../utils/verifyTokenAuth";
import { Colors } from "../constants/Colors";
import { Button } from "react-native";

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const [session, setSession] = useState<userProps | null>(null);
  const { sessionData, isLoading, setSessionData } = useAuth();

  const currentSession = session || sessionData;

  //deci e vorba ca sesionData si isLoading care venea din use auth erau setate loadingScreen vedea ca isLoading e fals dar problema e ca dura pana se activa setSession in AppNavigation cu datale din useAuth pentru ca useEffect se executa la final
  // useEffect(() => {
  //   if (sesionData) {
  //     setSesion(sesionData);
  //   }
  // }, [sesionData]);//cu acest useEffect aveam un race condition deoarece isLoading trecea pe false din hook dar mai dura pana se seta session din datele venite de la hook useAuth atunci aparea si LoginScreen

  //randare loading screen pana apare homescreen-ul
  if (isLoading) return <LoadingScreen />;

  //primesc callback de la LoginScreen cu token pentru a forta o rerandare ca sa trecem la ecranele protected
  const onLoginSuccesfully = (data: userProps) => {
    setSession(data);
  };

  const handleOnLogOut = async () => {
    await SecureStore.deleteItemAsync("userToken");
    setSession(null);
    setSessionData(null);
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.backgroundColor,
        },
        headerTitleStyle: {
          color: Colors.textColor, //le scriu in App.tsx pentru ca in ecran se aplicau style-urile prea tarziu
        },
      }}
    >
      {!currentSession?.token ? (
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
        <>
          <Stack.Screen
            name="Home"
            options={{ title: "Budgets" }}
            component={HomeScreen}
          />

          <Stack.Screen name="UserProfileScreen" options={{ title: "Profile" }}>
            {(props) => (
              <UserProfileScreen {...props} onLogOut={handleOnLogOut} />
            )}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
};
