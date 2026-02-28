import { TextInput, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

interface KProfileInputProps {
  placeHolder: string;
  value?: string;
  onChange?: (text: string) => void;
}

export const KProfileInput = ({
  placeHolder,
  value,
  onChange,
}: KProfileInputProps) => {
  return (
    <TextInput
      style={styles.container}
      placeholder={placeHolder}
      value={value}
      onChangeText={onChange}
      autoCapitalize="none"
      placeholderTextColor={Colors.secundary}
    ></TextInput>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "95%",
    aspectRatio: 16 / 2.5,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    paddingHorizontal: "3%",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    color: Colors.textColor,
    borderColor: Colors.secundary,
    borderWidth: 0.2,
  },
});
