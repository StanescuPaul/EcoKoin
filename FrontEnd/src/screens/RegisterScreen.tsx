import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";
import { KAuthInput } from "../components/KAuthInput";
import { KLoginButton } from "../components/KLoginButton";
import { useEffect, useState } from "react";
import { KSignupButton } from "../components/KSignupButton";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { envs } from "../config/envs";

const API_URL = envs.API_URL;

interface signupFormProps {
  email: string;
  password: string;
  rePassword: string;
}

export const RegisterScreen = () => {
  const [allert, setAllert] = useState<string | null>(null);
  const [signupForm, setSignupForm] = useState<signupFormProps>({
    email: "",
    password: "",
    rePassword: "",
  });
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleOnSignUp = async () => {
    if (signupForm.password !== signupForm.rePassword) {
      setAllert("The passwords doesn't match");
      setSignupForm({ ...signupForm, password: "", rePassword: "" });
      return;
    }

    const sendSignUpForm = {
      email: signupForm.email,
      password: signupForm.password,
    };
    try {
      const rawResponseSignup = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(sendSignUpForm),
      });

      const responseSignup = await rawResponseSignup.json();

      if (rawResponseSignup.ok) {
        setAllert(responseSignup.message || "Account created succesfully");
        setSignupForm({
          email: "",
          password: "",
          rePassword: "",
        });
        //replace ca sa nu ma mai pot intoarce la acest ecran
        navigation.replace("Login");
      } else {
        setAllert(responseSignup.message);
        setSignupForm({ ...signupForm, password: "", rePassword: "" });
      }
    } catch (err) {
      setAllert("Error connecting to the server");
      setSignupForm({ ...signupForm, password: "", rePassword: "" });
    }
  };

  const handleOnLogIn = () => {
    navigation.replace("Login");
  };

  //pentru a disparea alerta dupa 2 secunde
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

  return (
    <View style={styles.container}>
      <View style={styles.topScreenContainer}>
        <Text style={styles.titleStyle}>EcoKoin</Text>
        <Text style={styles.titleCreateStyle}>Create account</Text>
        <View style={styles.formContainer}>
          <Text style={[styles.allertStyle, { opacity: allert ? 1 : 0 }]}>
            {allert || " "}
          </Text>
          <KAuthInput
            placeHolder="Email"
            value={signupForm.email}
            onChange={(text: string) =>
              setSignupForm({ ...signupForm, email: text })
            }
          />
          <KAuthInput
            placeHolder="Password"
            value={signupForm.password}
            onChange={(text: string) =>
              setSignupForm({ ...signupForm, password: text })
            }
            isPassword={true}
          />
          <KAuthInput
            placeHolder="Password"
            value={signupForm.rePassword}
            onChange={(text: string) =>
              setSignupForm({ ...signupForm, rePassword: text })
            }
            isPassword={true}
          />
          <KLoginButton
            placeHolderButton="Sign up"
            onPressLogIn={handleOnSignUp}
          />
        </View>
      </View>
      <View style={styles.bottomScreenContainer}>
        <Text style={styles.bottomTitle}>Allready have an account</Text>
        <KSignupButton
          placeHolderButton="Log in"
          onPressSignUp={handleOnLogIn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.backgroundColor,
  },
  titleStyle: {
    color: Colors.secundary,
    fontSize: 32,
    fontWeight: "bold",
  },
  titleCreateStyle: {
    color: Colors.secundary,
    fontSize: 32,
    fontWeight: 400,
  },
  topScreenContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: "30%",
    paddingHorizontal: "2%",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: "7%",
    gap: 10,
  },
  bottomScreenContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
    width: 500,
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
    marginTop: "10%",
    alignItems: "center",
    paddingTop: "10%",
  },
  bottomTitle: {
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
