import {
  StyleSheet,
  View,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Colors } from "../constants/Colors";
import { KProfileButton } from "../components/KProfileButton";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { useEffect, useLayoutEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { envs } from "../config/envs";
import { useAuth } from "../hooks/useAuth";
import { KButtonBudgets } from "../components/KButtonBudgets";
import { KEditButton } from "../components/KEditButton";
import { KSaveButton } from "../components/KSaveButton";
import { KInputSearchBudgets } from "../components/KInputSearchBudgets";
import { KButtonSearchBudgets } from "../components/KButtonSearchBudgets";
import { KButtonAddBudgets } from "../components/KButtonAddBudget";

const API_URL = envs.API_URL;

export interface BudgetsProps {
  name?: string;
  id: string;
  amount: number;
  startDate: Date;
  endDate?: Date;
  isCompleted: boolean;
}

export const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { sessionData } = useAuth();
  //un array de BudgetsProps
  const [budgets, setBudgets] = useState<BudgetsProps[]>([]);
  const [allertBudgets, setAllertBudgets] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchName, setSearchName] = useState<string>("");

  //useLayoutEffect este pentru lucru sincron ca sa se execute acest cod inainte de randarea ecranului useEffect randa dupa si se vedea header-ul vechi
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <KProfileButton onProfileButton={handleOnProfileButton} />
      ),
      headerRight: () =>
        isEditing ? (
          <KSaveButton onPressSave={handleOnPressSave} />
        ) : (
          <KEditButton onPressEdit={handleOnPressEdit} />
        ),
    });
  }, [navigation, isEditing]);

  const handleOnProfileButton = () => {
    navigation.navigate("UserProfileScreen");
  };

  const handleOnPressEdit = () => {
    setIsEditing(true);
  };

  const handleOnPressSave = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (!sessionData?.userId || !sessionData.token) {
      return;
    }
    const budgetsGet = async () => {
      try {
        const rawResponseBudgetsGet = await fetch(
          `${API_URL}/api/users/${sessionData.userId}/budgets`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${sessionData.token}`,
            },
          },
        );

        const responseBudgetsGet = await rawResponseBudgetsGet.json();

        if (rawResponseBudgetsGet.ok) {
          setBudgets(responseBudgetsGet.data);
        } else {
          setAllertBudgets(responseBudgetsGet.message);
        }
      } catch (err) {
        setAllertBudgets("Server error");
        console.log("FAILED  /api/users/:userId/budgets", err);
      }
    };
    budgetsGet();
  }, [sessionData]);

  const handleOnPressSearch = () => {
    setIsSearching(false);
    Keyboard.dismiss();
  };

  const handleOnAddBudget = () => {};

  //ToDo: scrollable si sa ii pot adauga headder-ul care a nu se miste cu scroll-ul
  return (
    //contentContainerStyle pentru tot ce se misca pe ecran iar style pentru ce e in spate ca si cand as da overscroll sa nu se vada alb in spate
    <View style={styles.containerScroll}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text
          style={[styles.allertBudgetStyle, { opacity: allertBudgets ? 1 : 0 }]}
        >
          {allertBudgets || ""}
        </Text>
        {budgets.map((budget) => (
          <KButtonBudgets
            key={budget.id}
            isEditing={isEditing}
            budgets={budget}
          />
        ))}
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={styles.searchView}
      >
        <View style={styles.searchGroup}>
          <KInputSearchBudgets
            placeHolder="Search"
            onFocus={() => setIsSearching(true)}
          />
          {isSearching ? (
            <KButtonSearchBudgets onPress={handleOnPressSearch} />
          ) : (
            <KButtonAddBudgets onPress={handleOnAddBudget} />
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerScroll: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  container: {
    flexGrow: 1,
    backgroundColor: Colors.backgroundColor,
    alignItems: "center",
    gap: "1.2%",
  },
  allertBudgetStyle: {
    fontSize: 18,
    fontWeight: 300,
    color: Colors.textColor,
  },
  searchGroup: {
    width: "95%",
    flexDirection: "row",
    gap: "3%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "3%",
  },
  searchView: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0)",
    bottom: "2%",
    alignItems: "center",
    width: "100%",
  },
});
