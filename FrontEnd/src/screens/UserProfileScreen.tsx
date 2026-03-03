import { View, StyleSheet, Button, Text, Image } from "react-native";
import { Colors } from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { useEffect, useState, useLayoutEffect } from "react";
import { KProfileLable } from "../components/KProfileLable";
import { useAuth } from "../hooks/useAuth";
import { envs } from "../config/envs";
import { KEditButton } from "../components/KEditButton";
import { KBackButton } from "../components/KBackButton";
import { KProfileInput } from "../components/KProfileInput";
import { KSaveButton } from "../components/KSaveButton";
import { KLogOutButton } from "../components/KLogOutButton";

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

interface UserDataUpdate {
  newUserName?: string;
  newEmail?: string;
  // newPassword?: string;
}

export const UserProfileScreen = ({ onLogOut }: UserProfileScreenProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { sessionData } = useAuth();
  const [userDataUpdate, setUserDataUpdate] = useState<UserDataUpdate>({
    newUserName: "",
    newEmail: "",
    // newPassword: "",
  });
  const [allert, setAllert] = useState<string | null>(null);
  useEffect(() => {
    const userProfileFetch = async () => {
      if (!sessionData?.userId || !sessionData.token) {
        return;
      }

      try {
        const rawResponseUserProfile = await fetch(
          `${API_URL}/api/users/${sessionData.userId}/profile`,
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
  }, [sessionData]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: userData?.userName || "Profile" });
    navigation.setOptions({
      headerLeft: () => <KBackButton onPressBack={handleOnBackButton} />,
      headerRight: () =>
        isEditing ? (
          <KSaveButton onPressSave={handleOnPressSaveButton} />
        ) : (
          <KEditButton onPressEdit={handleOnEditButton} />
        ),
    });
  }, [navigation, isEditing, userDataUpdate, userData]); //trebuie sa pun ca dependinta si userDataUpdate pentru ca datele trebuie trecute prin saveButton

  const handleOnBackButton = () => {
    navigation.goBack();
  };

  const handleOnEditButton = () => {
    setUserDataUpdate({
      //daca nu pun asa la primul state ele se configurreaza cu null pentur ca nu apuca sa se incarce datele
      newUserName: userData?.userName,
      newEmail: userData?.email,
    });
    setIsEditing(true);
  };
  const handleOnPressSaveButton = async () => {
    try {
      const rawResponseProfileUserUpdate = await fetch(
        `${API_URL}/api/users/${sessionData?.userId}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${sessionData?.token}`,
          },
          body: JSON.stringify(userDataUpdate),
        },
      );
      const responseProfileUserUpdate =
        await rawResponseProfileUserUpdate.json();

      if (rawResponseProfileUserUpdate.ok) {
        setIsEditing(false);
        setUserData(responseProfileUserUpdate.data);
        setUserDataUpdate({
          newUserName: "",
          newEmail: "",
        });
      } else {
        setAllert(responseProfileUserUpdate.message);
        setIsEditing(false);
        setUserDataUpdate({
          newUserName: "",
          newEmail: "",
        });
      }
    } catch (err) {
      setAllert("Internal server error");
      console.log("ERROR: ", err);
      setIsEditing(false);
      setUserDataUpdate({
        newUserName: "",
        newEmail: "",
      });
    }
  };

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
      <View style={styles.contentWrapp}>
        <Image
          style={styles.profileImageStyle}
          source={require("../../assets/ProfileButtonImage.jpg")}
        />
        <Text style={[styles.allertStyle, { opacity: allert ? 1 : 0 }]}>
          {allert || " "}
        </Text>
        {isEditing ? (
          <>
            <KProfileInput
              placeHolder={"User name"}
              value={userDataUpdate.newUserName}
              onChange={(text: string) =>
                setUserDataUpdate({ ...userDataUpdate, newUserName: text })
              }
            />
            <KProfileInput
              placeHolder={"Email"}
              value={userDataUpdate.newEmail}
              onChange={(text: string) =>
                setUserDataUpdate({ ...userDataUpdate, newEmail: text })
              }
            />
          </>
        ) : (
          <>
            <KProfileLable
              placeHolderLable="User"
              userSpecificData={userData?.userName}
            />
            <KProfileLable
              placeHolderLable="Email"
              userSpecificData={userData?.email}
            />
          </>
        )}
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
        <KLogOutButton placeHolder="Log out" onPressLogOut={onLogOut} />
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
    gap: "3%",
    alignItems: "center",
    marginTop: "7%",
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
  profileImageStyle: {
    height: "22%",
    aspectRatio: 1,
    borderRadius: 999,
  },
  allertStyle: {
    fontSize: 13,
    color: Colors.textColor,
    fontWeight: 400,
  },
});
