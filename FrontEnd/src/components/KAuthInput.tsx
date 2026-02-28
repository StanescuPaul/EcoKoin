import { TextInput, View, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

interface AuthInputProps {
  placeHolder?: string;
  value: string;
  onChange: (text: string) => void;
  isPassword?: boolean;
}

export const KAuthInput = ({
  placeHolder,
  value,
  onChange,
  isPassword = false,
}: AuthInputProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputStyle}
        placeholder={placeHolder}
        placeholderTextColor={Colors.primary}
        value={value}
        onChangeText={onChange}
        secureTextEntry={isPassword}
        textContentType={isPassword ? "password" : "emailAddress"}
        autoCapitalize="none"
        keyboardType={isPassword ? "default" : "email-address"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  inputStyle: {
    width: "100%",
    aspectRatio: 16 / 2.5,
    borderWidth: 1,
    borderColor: Colors.secundary,
    borderRadius: 15,
    paddingLeft: 10,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: Colors.shadowColorPrimary,
    shadowOpacity: 1,
    shadowRadius: 6,
    color: Colors.secundary,
  },
});
