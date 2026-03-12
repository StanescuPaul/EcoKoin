import { TextInput, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

interface KGeneralInputProps {
  placeHolder: string;
  value?: string;
  onChange: (text: string) => void;
  isNumeric: boolean;
}

export const KGeneralInput = ({
  placeHolder,
  value,
  onChange,
  isNumeric,
}: KGeneralInputProps) => {
  return (
    <TextInput
      style={styles.container}
      placeholder={placeHolder}
      value={value}
      onChangeText={onChange}
      autoCapitalize="none"
      placeholderTextColor={Colors.secundary}
      keyboardType={isNumeric ? "numeric" : "default"}
    ></TextInput>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "85%",
    aspectRatio: 16 / 2.5,
    borderWidth: 0.2,
    borderRadius: 20,
    color: Colors.textColor,
    backgroundColor: Colors.primary,
    paddingLeft: "4%",
    borderColor: Colors.secundary,
  },
});
