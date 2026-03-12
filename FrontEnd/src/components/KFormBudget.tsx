import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState } from "react";
import { KGeneralInput } from "./KGeneralInput";
import { Colors } from "../constants/Colors";
import { KButtonClose } from "./KButtonClose";
import DateTimePicker from "@react-native-community/datetimepicker";
import { KButtonSaveData } from "./KButtonSaveData";
import { useTimedAllert } from "../hooks/useTimeAllert";
import { envs } from "../config/envs";
import { useAuth } from "../hooks/useAuth";

const API_URL = envs.API_URL;

interface BudgetProps {
  name?: string;
  amount: string;
  startDate: Date;
  endDate?: Date;
}

interface KFormBudgetProps {
  handleOnCloseForm: () => void;
  visible: boolean;
}

export const KFormBudget = ({
  handleOnCloseForm,
  visible,
}: KFormBudgetProps) => {
  const { sessionData } = useAuth();
  const [budget, setBudget] = useState<BudgetProps>({
    name: undefined,
    amount: "",
    startDate: new Date(),
    endDate: undefined,
  });
  const [showSetDate, setShowSetDate] = useState<boolean>(false);
  const [allertBudget, setAllertBudget] = useTimedAllert();

  const handleOnSetDate = () => {
    setShowSetDate(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowSetDate(false);
      return; //pentru android in cazul in care apasa x
    }

    if (selectedDate) {
      setBudget({ ...budget, startDate: selectedDate });

      if (Platform.OS === "android") {
        setShowSetDate(false); //pentru cazul in care apasa ok sa inchida calendarul
      }
    }
  };

  const handleOnSetBudget = async () => {
    try {
      const rawResponseBudgetPost = await fetch(
        `${API_URL}/api/users/${sessionData?.userId}/budgets`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${sessionData?.token}`,
          },
          body: JSON.stringify(budget),
        },
      );

      const responseBudgetPost = await rawResponseBudgetPost.json();

      if (rawResponseBudgetPost.ok) {
        setBudget({
          name: "",
          amount: "",
          startDate: new Date(),
          endDate: undefined,
        });
        handleOnCloseForm();
      } else {
        setAllertBudget(responseBudgetPost.message);
        setBudget({ ...budget });
        setShowSetDate(false);
      }
    } catch (err) {
      setAllertBudget("Server error");
      console.log("FAILED /api/users/:userId/budgets POST: ", err);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text
              style={[
                styles.allertBudgetStyle,
                { opacity: allertBudget ? 1 : 0 },
              ]}
            >
              {allertBudget || ""}
            </Text>
            <KButtonClose handleOnClose={handleOnCloseForm} />
            <View style={styles.topPart}>
              <KGeneralInput
                placeHolder="Name"
                value={budget.name}
                onChange={(text: string) =>
                  setBudget({ ...budget, name: text })
                }
                isNumeric={false}
              />
              <KGeneralInput
                placeHolder="Amount"
                value={budget.amount}
                onChange={(text: string) =>
                  setBudget({ ...budget, amount: text })
                }
                isNumeric={true}
              />
              {!showSetDate && (
                <TouchableOpacity
                  style={styles.startDateButton}
                  onPress={handleOnSetDate}
                >
                  <Text style={styles.textStyleStartDate}>
                    Select start date
                  </Text>
                </TouchableOpacity>
              )}
              {showSetDate && (
                <View style={styles.dateContainer}>
                  <DateTimePicker
                    value={budget.startDate}
                    mode="date"
                    maximumDate={new Date()}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onDateChange}
                  />
                </View>
              )}
            </View>
            <KButtonSaveData
              handleSaveData={handleOnSetBudget}
              placeHolder="Set budget"
            />
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
  container: {
    width: "85%",
    aspectRatio: 1 / 1.4,
    backgroundColor: Colors.backgroundColor,
    alignItems: "center",
    shadowColor: Colors.shadowColorSecundary,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    borderRadius: 20,
    paddingVertical: "12%",
    borderWidth: 0.2,
    borderColor: Colors.primary,
    justifyContent: "space-between",
  },
  startDateButton: {
    width: "85%",
    aspectRatio: 16 / 2.5,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 0.2,
    borderColor: Colors.secundary,
  },
  textStyleStartDate: {
    color: Colors.textColor,
    fontSize: 20,
  },
  dateContainer: {
    width: "80%",
    aspectRatio: 16 / 10,
    justifyContent: "center",
    alignItems: "center",
  },
  topPart: {
    width: "100%",
    height: "80%",
    alignItems: "center",
    gap: "5%",
  },
  allertBudgetStyle: {
    fontSize: 14,
    color: Colors.textColor,
  },
});
