import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text,
} from "react-native";
import { useState } from "react";
import { KGeneralInput } from "./KGeneralInput";
import { Colors } from "../constants/Colors";
import { KButtonClose } from "./KButtonClose";
import DateTimePicker from "@react-native-community/datetimepicker";
import { KButtonSaveData } from "./KButtonSaveData";

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
  const [budget, setBudget] = useState<BudgetProps>({
    name: undefined,
    amount: "",
    startDate: new Date(),
    endDate: undefined,
  });
  const [showSetDate, setShowSetDate] = useState<boolean>(false);

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

  const handleOnSaveData = () => {};

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <KButtonClose handleOnClose={handleOnCloseForm} />
          <KGeneralInput
            placeHolder="Name"
            value={budget.name}
            onChange={(text: string) => setBudget({ ...budget, name: text })}
          />
          <KGeneralInput
            placeHolder="Amount"
            value={budget.amount}
            onChange={(text: string) => setBudget({ ...budget, amount: text })}
          />
          {!showSetDate && (
            <TouchableOpacity
              style={styles.startDateButton}
              onPress={handleOnSetDate}
            >
              <Text style={styles.textStyleStartDate}>Start date</Text>
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
          <KButtonSaveData handleSaveData={handleOnSaveData} />
        </View>
      </View>
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
    paddingVertical: "15%",
    gap: "4%",
    borderWidth: 0.2,
    borderColor: Colors.primary,
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
    width: "90%",
    aspectRatio: 16 / 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
