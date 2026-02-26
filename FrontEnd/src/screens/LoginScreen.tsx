import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { Colors } from "../constants/Colors";
import { KAuthInput } from "../components/KAuthInput";
import { KLoginButton } from "../components/KLoginButton";
import { KSignupButton } from "../components/KSignupButton";
import { envs } from "../config/envs";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { userProps } from "../utils/verifyTokenAuth";

const API_URL = envs.API_URL;

interface LoginScreenProps {
  onLoginSuccesfully: (data: userProps) => void;
}

interface AuthFormProps {
  email: string;
  password: string;
}

//Generics iti permite sa spui ce type o sa fie continutul acelui obiect/useState etc
export const LoginScreen = ({ onLoginSuccesfully }: LoginScreenProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [authForm, setAuthForm] = useState<AuthFormProps>({
    email: "",
    password: "",
  });
  const [allert, setAllert] = useState<null | string>(null);

  useEffect(() => {
    if (allert) {
      const timer = setTimeout(() => {
        setAllert(null);
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [allert]);

  const handleOnLogIn = async () => {
    try {
      const rawResponseLogin = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authForm),
      });

      const responseLogin = await rawResponseLogin.json();
      if (rawResponseLogin.ok && responseLogin.data.token) {
        await SecureStore.setItemAsync("userToken", responseLogin.data.token); //Introducem token in secure store ca sa il poata lua aplicatia la fiecare repornire pentru a persista login-ul
        setAllert(responseLogin.message || "Login succesfully");
        onLoginSuccesfully(responseLogin.data); //in loc de navigate facem o rerandare pe AppNavigator pentru a seta token-ul si reranda aplicatia
      } else {
        setAllert(responseLogin.message);
        setAuthForm({ ...authForm, password: "" });
      }
    } catch (err) {
      setAllert("Error connecting to the server");
      setAuthForm({ ...authForm, password: "" });
    }
  };

  const handleOnSignUp = () => {
    navigation.replace("Register");
  };

  return (
    <View style={styles.mainConstainer}>
      <View style={styles.contentWrapper}>
        <Text style={styles.titleStyle}>EcoKoin</Text>
        <View style={styles.formContainer}>
          <Text style={[styles.allertStyle, { opacity: allert ? 1 : 0 }]}>
            {allert || " "}
          </Text>
          <KAuthInput
            placeHolder={"Email"}
            value={authForm.email}
            onChange={(text) => setAuthForm({ ...authForm, email: text })}
          />
          <KAuthInput
            placeHolder={"Password"}
            value={authForm.password}
            onChange={(text) => setAuthForm({ ...authForm, password: text })}
            isPassword={true}
          />
          <KLoginButton placeHolderButton={"Log in"} onPress={handleOnLogIn} />
        </View>
      </View>
      <View style={styles.bottomScreen}>
        <Text style={styles.bottomTitleStyle}>Create account</Text>
        <KSignupButton
          placeHolderButton={"Create account"}
          onPress={handleOnSignUp}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainConstainer: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    alignItems: "center",
  },
  contentWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: "40%",
    paddingHorizontal: "2%",
  },
  formContainer: {
    width: "100%",
    gap: 10,
    alignItems: "center",
    marginTop: "10%",
  },
  titleStyle: {
    color: Colors.secundary,
    fontSize: 32,
    fontWeight: "bold",
  },
  bottomScreen: {
    flex: 1,
    backgroundColor: Colors.primary,
    width: 500,
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
    alignItems: "center",
    paddingHorizontal: "2%",
    paddingTop: "10%",
    marginTop: "10%",
  },
  bottomTitleStyle: {
    color: Colors.backgroundColor,
    fontSize: 20,
    marginBottom: 5,
    fontFamily: "bold",
    fontWeight: 300,
  },
  allertStyle: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: 400,
    fontFamily: "bold",
  },
});
