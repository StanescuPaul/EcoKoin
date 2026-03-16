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
import { useTimedAllert } from "../hooks/useTimeAllert";
import { KFormBudget } from "../components/KFormBudget";
import { KDeleteModal } from "../components/KDeleteModal";
import { KUpdateBudgetModal } from "../components/KUpdateBudgetModal";

const API_URL = envs.API_URL;

export interface BudgetsProps {
  name?: string;
  id: string;
  amount: string;
  startDate: Date;
  endDate?: Date;
  isCompleted: boolean;
}

export const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { sessionData } = useAuth();
  //un array de BudgetsProps
  const [budgets, setBudgets] = useState<BudgetsProps[]>([]);
  const [allertBudgets, setAllertBudgets] = useTimedAllert(); // este deja prestabilit 2000 in hook
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchName, setSearchName] = useState<string>("");
  const [isVisibleForm, setIsVisileForm] = useState<boolean>(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState<boolean>(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  const [isUpdateBudgetVisible, setIsUpdateBudgetVisible] =
    useState<boolean>(false);
  const [selectedBudgetUpdate, setSelectedBudgetUpdate] =
    useState<BudgetsProps | null>(null);

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

  //Functie pentru fetch budgets
  const budgetsGet = async () => {
    if (!sessionData?.token) return;

    try {
      const rawResponseBudgetsGet = await fetch(
        `${API_URL}/api/users/${sessionData?.userId}/budgets`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${sessionData?.token}`,
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

  useEffect(() => {
    if (!sessionData?.token) return;
    budgetsGet();
  }, [sessionData]);

  const handleOnPressSearch = async () => {
    if (!sessionData?.token) return;

    try {
      const rawResponseBudgetFind = await fetch(
        `${API_URL}/api/users/${sessionData?.userId}/budgets?name=${searchName}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${sessionData?.token}`,
          },
        },
      );

      const responseBudgetFind = await rawResponseBudgetFind.json();

      if (rawResponseBudgetFind.ok) {
        setBudgets(responseBudgetFind.data);
        setIsSearching(false);
        Keyboard.dismiss();
        setSearchName("");
      } else {
        setAllertBudgets(responseBudgetFind.message);
        Keyboard.dismiss();
        setSearchName("");
        setIsSearching(false);
      }
    } catch (err) {
      setAllertBudgets("Server error");
      setSearchName("");
      console.log("FAILED /api/users/:userId/budgets/budgets?name=", err);
    }
  };

  //pentru partea de adaugare budget
  const handleOnAddBudget = () => {
    setIsVisileForm(true);
  };
  const handleOnCloseForm = () => {
    setIsVisileForm(false);
    budgetsGet();
  };

  //Pentru partea de delete a unui budget
  const handleOnNoDelete = () => {
    setIsDeleteVisible(false);
    setSelectedBudgetId(null);
  };

  const handleSetSelectedBudgetId = (idBudget: string) => {
    setSelectedBudgetId(idBudget);
    setIsDeleteVisible(true);
  };

  const handleOnYesDelete = async () => {
    if (!selectedBudgetId) return; //verificam daca exista id sau nu

    try {
      const rawResponseBudgetDelete = await fetch(
        `${API_URL}/api/users/${sessionData?.userId}/budgets/${selectedBudgetId}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${sessionData?.token}`,
          },
        },
      );

      const responseBudgetDelete = await rawResponseBudgetDelete.json();

      if (rawResponseBudgetDelete.ok) {
        setAllertBudgets(responseBudgetDelete.message);
        budgetsGet();
      } else {
        setAllertBudgets(responseBudgetDelete.message);
      }
    } catch (err) {
      setAllertBudgets("Server error");
      console.log("FAILED /api/users/:userId/budgets/:budgetId DELETE", err);
    } finally {
      setIsDeleteVisible(false);
      setSelectedBudgetId(null);
    }
  };

  //Pentru partea de update budget
  const handleOnUpdateBudget = (budget: BudgetsProps) => {
    setSelectedBudgetUpdate(budget);
    setIsUpdateBudgetVisible(true);
  };

  const handleOnCloseUpdateBudget = () => {
    setIsUpdateBudgetVisible(false);
    setSelectedBudgetUpdate(null);
  };

  return (
    //contentContainerStyle pentru tot ce se misca pe ecran iar style pentru ce e in spate ca si cand as da overscroll sa nu se vada alb in spate
    <>
      <View style={styles.containerScroll}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text
            style={[
              styles.allertBudgetStyle,
              { opacity: allertBudgets ? 1 : 0 },
            ]}
          >
            {allertBudgets || ""}
          </Text>
          {budgets.map((budget) => (
            <KButtonBudgets
              key={budget.id}
              isEditing={isEditing}
              budgets={budget}
              handleUpdateBudget={() => handleOnUpdateBudget(budget)}
              handleSetBudgetId={() => handleSetSelectedBudgetId(budget.id)} //setez budgetId pentru a si id-ul cand sterg un budget
            />
          ))}
        </ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          style={styles.searchView}
          enabled={!isVisibleForm && !isUpdateBudgetVisible} // pentru a nu se vedea cand suntem in form si creem un budget
        >
          <View style={styles.searchGroup}>
            <KInputSearchBudgets
              placeHolder="Search"
              onFocus={() => setIsSearching(true)}
              value={searchName}
              onChange={(text: string) => setSearchName(text)}
            />
            {isSearching ? (
              <KButtonSearchBudgets onPress={handleOnPressSearch} />
            ) : (
              <KButtonAddBudgets onPress={handleOnAddBudget} />
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
      {isVisibleForm && (
        <KFormBudget
          handleOnCloseForm={handleOnCloseForm}
          visible={isVisibleForm}
        />
      )}
      {isDeleteVisible && (
        <KDeleteModal
          isVisible={isDeleteVisible}
          handleOnNo={handleOnNoDelete}
          handleOnYes={handleOnYesDelete}
        />
      )}
      {isUpdateBudgetVisible && (
        <KUpdateBudgetModal
          isVisible={isUpdateBudgetVisible}
          budget={selectedBudgetUpdate}
          handleOnClose={handleOnCloseUpdateBudget}
          handleSuccessUpdateBudget={budgetsGet}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  containerScroll: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
