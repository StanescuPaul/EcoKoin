import { TouchableOpacity, StyleSheet, Text, Image, View } from "react-native";
import { Colors } from "../constants/Colors";

interface KButtonExpensesAndSavingsProps {
  isEditing: boolean;
}

export const KButtonExpensesAndSavings = ({
  isEditing,
}: KButtonExpensesAndSavingsProps) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.leftSide}>
        <Text style={styles.nameStyle}>Nume mai</Text>
        <Text style={styles.amountStyle}>Amount: 3000</Text>
      </View>
      {isEditing && (
        <View style={styles.rightSide}>
          <TouchableOpacity>
            <Image
              source={require("../../assets/editBudget.png")}
              style={styles.rightSideImageCheckStyle}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../../assets/delete.png")}
              style={styles.rightSideImageCheckStyle}
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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "5%",
  },
  nameStyle: {
    color: Colors.textColor,
    fontSize: 20,
    fontWeight: 600,
  },
  amountStyle: {
    color: Colors.textColor,
    fontSize: 16,
    fontWeight: 300,
  },
  leftSide: {
    width: "78%",
    height: "100%",
    justifyContent: "center",
  },
  rightSideImageCheckStyle: {
    height: "50%",
    aspectRatio: 1,
    tintColor: Colors.textColor,
  },
  rightSide: {
    height: "100%",
    gap: "7%",
    flexDirection: "row",
    alignItems: "center",
  },
});
