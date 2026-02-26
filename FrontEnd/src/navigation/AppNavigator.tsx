import { RootStackParamList } from "../types/index";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { LoadingScreen } from "../screens/LoadingScreen";
import { useAuth } from "../hooks/useAuth";
import { userProps } from "../utils/verifyTokenAuth";

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const [session, setSession] = useState<userProps | null>(null);
  const { sesionData, isLoading, setSesionData } = useAuth();

  const currentSession = session || sesionData;

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
    setSesionData(null);
  };

  return (
    <Stack.Navigator>
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
        <Stack.Screen
          name="Home"
          //momentan pentru a ma potea intoarce din home
          // component={HomeScreen}
          options={{ headerShown: false }}
        >
          {(props) => (
            <HomeScreen
              {...props}
              userId={currentSession.userId}
              onLogOut={handleOnLogOut} //scap de asta o data facut profile
            />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};
