import { AppColors } from "@/constants/colors";
import { useEffect, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  DimensionValue,
} from "react-native";

type Props = {
  isVisible: boolean;
  closeModal: () => void;
  anchorRef: React.MutableRefObject<null>;
  anchorCorner: "RIGHT" | "LEFT";
  backgroundColor?: string;
  modalWidth?: DimensionValue;
  onDismiss?: () => void;
  children: any;
};

export default function AnchoredModal({
  isVisible,
  closeModal,
  anchorRef,
  anchorCorner,
  backgroundColor = "white",
  modalWidth = "100%",
  onDismiss,
  children,
}: Props) {
  const [modalPosition, setModalPosition] = useState({
    top: 0,
    left: 0,
  });
  useEffect(() => {
    (anchorRef?.current as any).measureInWindow(
      (fx: number, fy: number, width: number) => {
        let left;
        if (anchorCorner === "LEFT") {
          left = fx;
        } else {
          left = fx - modalWidth + width;
        }
        setModalPosition({
          top: fy,
          left,
        });
      }
    );
  }, [isVisible]);
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={closeModal}
      onDismiss={() => {
        if (onDismiss) onDismiss();
      }}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContent,
                {
                  top: modalPosition.top,
                  left: modalPosition.left,
                  backgroundColor,
                  width: modalWidth,
                },
              ]}
            >
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
    justifyContent: "center",
    alignItems: "center",
    padding: 20, // padding outside the modal
  },
  modalContent: {
    height: "auto",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    overflow: "hidden",
  },
});
