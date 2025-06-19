import { useEffect, useMemo, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import { Pressable } from "react-native";
import CloseButton from "../CloseButton";
import CustomTextInput from "../CustomTextInput";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import useAppStore from "@/store/useAppStore";
import { createFolder, updateFolder } from "@/lib/folderService";
import useUpsertFolderModal from "@/store/useUpsertFolderModal";
import userStore from "@/store/userStore";

export default function UpsertFolderModal() {
  const { theme } = useThemeStore((state) => state);
  const { setRefetchWorkouts } = useAppStore();
  const { closeModal, isVisible, props } = useUpsertFolderModal();
  const { folderId, folderName } = props ?? {};
  const { user } = userStore();

  const [inputValue, setInputValue] = useState(folderName ?? "");

  const styles = useMemo(() => makeStyles(theme), [theme]);

  useEffect(() => {
    setInputValue(folderName ?? "");
  }, [props]);

  const handleChange = (text: string) => {
    setInputValue(text);
  };
  const closeModalHandler = () => {
    setInputValue("");
    closeModal();
  };
  const saveHandler = async () => {
    if (inputValue !== "") {
      if (folderId) {
        await updateFolder({ id: folderId, name: inputValue });
      } else {
        await createFolder({
          name: inputValue,
          split_id: user?.active_split_id!,
          user_id: user!.id,
          order: null,
        });
      }

      closeModal();
      setInputValue("");
      setRefetchWorkouts();
    }
  };
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={closeModalHandler}
    >
      <TouchableWithoutFeedback onPress={closeModalHandler}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContent}>
        <View style={styles.header}>
          <CloseButton onPress={closeModalHandler} />
          <Text style={styles.title}>{folderId ? "Update" : "Add"} Folder</Text>
          <Pressable onPress={saveHandler} disabled={inputValue === ""}>
            <Text
              style={[
                styles.saveButtonText,
                { color: inputValue === "" ? theme.gray : theme.blue },
              ]}
            >
              Save
            </Text>
          </Pressable>
        </View>
        <CustomTextInput
          onChangeText={handleChange}
          placeholder="name"
          value={inputValue}
        />
      </View>
    </Modal>
  );
}

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    modalOverlay: {
      backgroundColor: theme.semiTransparent,
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
    },
    modalContent: {
      width: "90%",
      paddingVertical: 30,
      paddingHorizontal: 20,
      borderRadius: 10,
      alignItems: "center",
      backgroundColor: theme.background,
      gap: 20,
      margin: "auto",
    },
    title: {
      fontWeight: "bold",
      fontSize: 18,
      color: theme.textColor,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginBottom: 10,
    },
    saveButtonText: {
      color: theme.blue,
      fontWeight: "bold",
      fontSize: 16,
    },
  });
