import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

interface KProfileLableProps {
  placeHolderLable: string;
  userSpecificData?: string;
}

export const KProfileLable = ({
  placeHolderLable,
  userSpecificData,
}: KProfileLableProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.lableTextStyle}>
        {placeHolderLable}: {userSpecificData}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "95%",
    aspectRatio: 16 / 2.5,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    justifyContent: "center",
    paddingHorizontal: "3%",
  },
  lableTextStyle: {
    color: Colors.textColor,
    fontSize: 18,
    fontFamily: "System",
    fontWeight: 400,
  },
});
