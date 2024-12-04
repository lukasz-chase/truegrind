import { useEffect, useRef, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
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
  modalWidth = "90%",
  onDismiss,
  children,
}: Props) {
  const [modalPosition, setModalPosition] = useState({
    top: 0,
    left: 0,
    isBottomAnchored: false,
  });
  const modalRef = useRef<View>(null);
  const [modalHeight, setModalHeight] = useState(0);

  useEffect(() => {
    // Measure the modal height after it's rendered
    if (isVisible) {
      modalRef.current?.measure((x, y, width, height) => {
        setModalHeight(height);
      });
    }
  }, [isVisible]);

  useEffect(() => {
    const screenHeight = Dimensions.get("window").height;

    (anchorRef?.current as any)?.measureInWindow(
      (fx: number, fy: number, width: number, height: number) => {
        let left, top;
        let isBottomAnchored = false;

        // Calculate horizontal position
        if (anchorCorner === "LEFT") {
          left = fx;
        } else {
          left = fx - Number(modalWidth) + width;
        }

        // Calculate vertical position
        if (fy + height + modalHeight > screenHeight) {
          // Anchor from bottom if modal exceeds screen height
          top = fy - modalHeight + height;
          isBottomAnchored = true;
        } else {
          // Default anchor from top
          top = fy + height;
        }

        setModalPosition({
          top,
          left,
          isBottomAnchored,
        });
      }
    );
  }, [isVisible, anchorCorner, modalWidth, modalHeight]);

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
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View
        ref={modalRef}
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    position: "absolute",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    overflow: "hidden",
    zIndex: 2, // This doesn't work well on Android
    elevation: 10, // Add this for Android
  },
});
