import { TextInput, StyleSheet, Image } from "react-native";
import { Colors } from "../constants/Colors";

interface KInputSearchBudgetsProps {
  placeHolder: string;
  onFocus: () => void;
}

export const KInputSearchBudgets = ({
  placeHolder,
  onFocus,
}: KInputSearchBudgetsProps) => {
  return (
    <TextInput
      style={styles.container}
      placeholder={placeHolder}
      placeholderTextColor={Colors.textColor}
      onFocus={onFocus}
    ></TextInput>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "85%",
    aspectRatio: 16 / 2.3,
    backgroundColor: Colors.primary,
    opacity: 0.7,
    borderRadius: 20,
    paddingLeft: "3%",
    color: Colors.textColor,
    borderWidth: 0.2,
    borderColor: Colors.secundary,
  },
});
