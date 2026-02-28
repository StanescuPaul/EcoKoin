import { View, StyleSheet, Button, Text } from "react-native";
import { Colors } from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { useEffect, useState } from "react";
import { KProfileLable } from "../components/KProfileLable";
import { useAuth } from "../hooks/useAuth";
import { envs } from "../config/envs";

const API_URL = envs.API_URL;

interface UserProfileScreenProps {
  onLogOut: () => void;
}

interface UserData {
  userName?: string;
  email: string;
  createdAt: string;
  totalExpenses: string;
  totalSavings: string;
}

export const UserProfileScreen = ({ onLogOut }: UserProfileScreenProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { sessionData } = useAuth();

  useEffect(() => {
    const userProfileFetch = async () => {
      if (!sessionData?.userId || !sessionData.token) {
        return;
      }

      try {
        const rawResponseUserProfile = await fetch(
          `${API_URL}/api/user/${sessionData.userId}/profile`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${sessionData.token}`,
            },
          },
        );

        const responseUserProfile = await rawResponseUserProfile.json();

        if (rawResponseUserProfile.ok) {
          setUserData(responseUserProfile.data);
        } else {
          console.log("Error fetching the user profile");
        }
      } catch (err) {
        console.log("Error on UserProfile", err);
      }
    };
    userProfileFetch();
    if (userData?.userName === "undefined")
      navigation.setOptions({ title: `${userData?.userName}` });
  }, [sessionData]);

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapp}>
        <KProfileLable
          placeHolderLable="User"
          userSpecificData={userData?.userName}
        />
        <KProfileLable
          placeHolderLable="Email"
          userSpecificData={userData?.email}
        />
        <KProfileLable
          placeHolderLable="Member"
          userSpecificData={
            userData?.createdAt &&
            new Date(userData?.createdAt).toLocaleDateString("ro-RO")
          }
        />
        <View style={styles.textWrapper}>
          <View style={styles.textWrapperGroup}>
            <Text style={styles.textMoney}>Total expenses</Text>
            <Text style={styles.textMoney}>{userData?.totalExpenses}</Text>
          </View>
          <View style={styles.textWrapperGroup}>
            <Text style={styles.textMoney}>Total expenses</Text>
            <Text style={styles.textMoney}>{userData?.totalExpenses}</Text>
          </View>
        </View>

        {/* <Button title="back" onPress={onLogOut} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  contentWrapp: {
    width: "100%",
    gap: "4%",
    alignItems: "center",
    marginTop: "15%",
  },
  textMoney: {
    color: "white",
    fontSize: 22,
    fontWeight: 500,
  },
  textWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: "3%",
  },
  textWrapperGroup: {
    alignItems: "center",
    width: "49%",
    borderRadius: 15,
    backgroundColor: Colors.primary,
  },
});
