import {
  TouchableOpacity,
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { Colors } from "../constants/Colors";
import { BudgetsProps } from "../screens/HomeScreen";
import { KGeneralInput } from "./KGeneralInput";
import { useState } from "react";
import { KButtonClose } from "./KButtonClose";
import { useTimedAllert } from "../hooks/useTimeAllert";
import { useAuth } from "../hooks/useAuth";
import { envs } from "../config/envs";

const API_URL = envs.API_URL;

interface KUpdateBudgetModalProps {
  isVisible: boolean;
  budget: BudgetsProps | null;
  handleOnClose: () => void;
}

interface BudgetsUpdateProps {
  newName?: string;
  addAmount?: string;
  endDate?: Date;
  isCompleted: boolean;
}

export const KUpdateBudgetModal = ({
  isVisible,
  budget,
  handleOnClose,
}: KUpdateBudgetModalProps) => {
  if (!budget) return null;
  const { sessionData } = useAuth();
  const [updateBudget, setUpdateBudget] = useState<BudgetsUpdateProps>({
    newName: budget.name,
    addAmount: "",
    endDate: undefined,
    isCompleted: budget.isCompleted,
  });
  const [allertUpdateBudget, setAllertUpdateBudget] = useTimedAllert();

  const imgUrl = updateBudget.isCompleted
    ? require("../../assets/check.png")
    : require("../../assets/uncheck.png");

  const handleIsComplete = () => {
    setUpdateBudget({
      ...updateBudget,
      isCompleted: !updateBudget.isCompleted,
    });
  };

  const handleOnUpdateBudget = async () => {
    if (!sessionData) return null;
    try {
      const rawResponseUpdateBudget = await fetch(
        `${API_URL}/api/users/${sessionData.userId}/budgets/${budget.id}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${sessionData.token}`,
          },
          body: JSON.stringify(updateBudget),
        },
      );
    } catch (err) {
      setAllertUpdateBudget("Server error");
      console.log("ERROR on /api/users/:userId/budgets/:budgetId PUT: ", err);
    }
  };
  return (
    <Modal transparent={true} visible={isVisible} animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.conatiner}>
            <KButtonClose handleOnClose={handleOnClose} />
            <View style={styles.topSide}>
              <KGeneralInput
                placeHolder="New name"
                value={updateBudget.newName}
                onChange={(text: string) =>
                  setUpdateBudget({ ...updateBudget, newName: text })
                }
                isNumeric={false}
              />
              <KGeneralInput
                placeHolder="Add amount"
                value={updateBudget.addAmount}
                isNumeric={true}
                onChange={(text: string) =>
                  setUpdateBudget({ ...updateBudget, addAmount: text })
                }
              />
              <Text style={styles.textCheckStyle}>
                Press the button to check the budget
              </Text>
              <TouchableOpacity onPress={handleIsComplete}>
                <Image source={imgUrl} style={styles.imgStyle} />
              </TouchableOpacity>
            </View>
            <View style={styles.bottomSide}>
              <TouchableOpacity style={styles.buttonUpdateStyle}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  conatiner: {
    width: "85%",
    aspectRatio: 1 / 1.4,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 20,
    shadowColor: Colors.shadowColorSecundary,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "10%",
    borderWidth: 0.2,
    borderColor: Colors.secundary,
  },
  textCheckStyle: {
    color: Colors.textColor,
    fontSize: 15,
    fontWeight: 600,
    margin: 0,
  },
  imgStyle: {
    height: "40%",
    aspectRatio: 1,
    tintColor: "white",
  },
  topSide: {
    alignItems: "center",
    gap: "4%",
    height: "60%",
    marginBottom: "10%",
    justifyContent: "center",
  },
  bottomSide: {
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonUpdateStyle: {
    width: "85%",
    aspectRatio: 16 / 2.2,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 0.2,
    borderColor: Colors.secundary,
  },
  buttonText: {
    fontSize: 20,
    color: Colors.textColor,
  },
  textGroup: {
    justifyContent: "center",
    paddingHorizontal: "5%",
  },
});
