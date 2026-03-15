import { TouchableOpacity, Text, View, StyleSheet, Modal } from "react-native";
import { Colors } from "../constants/Colors";

interface KDeleteModalProps {
  isVisible: boolean;
  handleOnYes: () => void;
  handleOnNo: () => void;
}

export const KDeleteModal = ({
  isVisible,
  handleOnYes,
  handleOnNo,
}: KDeleteModalProps) => {
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={styles.overlay}>
        <View style={styles.conatiner}>
          <Text style={styles.textStyle}>
            Do you want to delete the budget?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonStyle} onPress={handleOnYes}>
              <Text style={styles.textButtonStyle}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} onPress={handleOnNo}>
              <Text style={styles.textButtonStyle}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    width: "85%",
    aspectRatio: 16 / 7,
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
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  textStyle: {
    color: Colors.textColor,
    fontSize: 18,
  },
  buttonStyle: {
    width: "35%",
    aspectRatio: 16 / 5,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    borderWidth: 0.2,
    borderColor: Colors.secundary,
    justifyContent: "center",
    alignItems: "center",
  },
  textButtonStyle: {
    color: Colors.textColor,
    fontWeight: 600,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: "5%",
    marginTop: "5%",
  },
});
