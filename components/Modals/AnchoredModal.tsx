import { SCREEN_HEIGHT } from "@/constants/device";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import { useEffect, useMemo, useRef, useState } from "react";
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
  backgroundColor?: string | null;
  modalWidth?: DimensionValue;
  padding?: number;
  alignItems?: "flex-start" | "flex-end" | "center";
  children: any;
};

export default function AnchoredModal({
  isVisible,
  closeModal,
  anchorRef,
  anchorCorner,
  backgroundColor = null,
  modalWidth = "90%",
  padding = 10,
  alignItems = "center",
  children,
}: Props) {
  const [modalPosition, setModalPosition] = useState({
    top: 0,
    left: 0,
    isBottomAnchored: false,
  });
  const [modalHeight, setModalHeight] = useState(0);
  const modalRef = useRef<View>(null);
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  useEffect(() => {
    // Measure the modal height after it's rendered
    if (isVisible) {
      modalRef.current?.measure((x, y, width, height) => {
        setModalHeight(height);
      });
    }
  }, [isVisible]);

  useEffect(() => {
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
        if (fy + height + modalHeight > SCREEN_HEIGHT) {
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
            backgroundColor: backgroundColor ?? theme.white,
            width: modalWidth,
            alignItems,
            padding,
          },
        ]}
      >
        {children}
      </View>
    </Modal>
  );
}

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.semiTransparent,
    },
    modalContent: {
      position: "absolute",
      borderRadius: 10,
      overflow: "hidden",
      zIndex: 2, // This doesn't work well on Android
      elevation: 10, // Add this for Android
    },
  });
