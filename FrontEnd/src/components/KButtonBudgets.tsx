import { TouchableOpacity, Text, StyleSheet, Image, View } from "react-native";
import { Colors } from "../constants/Colors";
import { BudgetsProps } from "../screens/HomeScreen";

interface KButtonBudgetsProps {
  isEditing: boolean;
  budgets: BudgetsProps | null;
  handleSetBudgetId: () => void;
  handleUpdateBudget: () => void;
}

export const KButtonBudgets = ({
  isEditing,
  budgets,
  handleSetBudgetId,
  handleUpdateBudget,
}: KButtonBudgetsProps) => {
  if (!budgets) {
    return;
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        budgets.isCompleted && styles.completedBudgetStyle,
      ]}
    >
      <View style={styles.leftSide}>
        <Text style={styles.nameBudgetStyle}>{budgets.name}</Text>
        <View style={styles.dateGroup}>
          <Text style={styles.dateBudgetStyle}>
            {new Date(budgets.startDate).toLocaleDateString("ro-RO")} -
          </Text>
          <Text style={styles.dateBudgetStyle}>
            {" "}
            {budgets.endDate
              ? new Date(budgets.endDate).toLocaleDateString("ro-RO")
              : "In progress"}
          </Text>
        </View>
      </View>
      {isEditing && (
        <View style={styles.rightSide}>
          <TouchableOpacity onPress={handleUpdateBudget}>
            <Image
              style={styles.rightSideImageCheckStyle}
              source={require("../../assets/editBudget.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSetBudgetId}>
            <Image
              style={styles.rightSideImageCheckStyle}
              source={require("../../assets/delete.png")}
            />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "95%",
    aspectRatio: 16 / 3,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingHorizontal: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  completedBudgetStyle: {
    opacity: 0.5,
    backgroundColor: Colors.shadowColorPrimary,
  },
  leftSide: {
    justifyContent: "center",
    width: "79%",
  },
  rightSide: {
    flexDirection: "row",
    gap: "7%",
    alignItems: "center",
  },
  nameBudgetStyle: {
    color: Colors.textColor,
    fontSize: 22,
    fontWeight: 600,
  },
  dateBudgetStyle: {
    color: Colors.secundary,
    fontSize: 14,
    fontWeight: 300,
  },
  dateGroup: {
    flexDirection: "row",
  },
  rightSideImageCheckStyle: {
    height: "50%",
    aspectRatio: 1,
    tintColor: Colors.textColor,
  },
});
