import { StyleSheet, View } from "react-native";
import AnchoredModal from "./AnchoredModal";
import ModalOptionButton from "./ModalOptionButton";
import { EvilIcons } from "@expo/vector-icons";
import useAppStore from "@/store/useAppStore";
import userStore from "@/store/userStore";
import { useMemo } from "react";
import useActionModal from "@/store/useActionModal";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import useFolderOptionsModal from "@/store/useFolderOptionsModal";
import { deleteFolder } from "@/lib/folderService";
import useUpsertFolderModal from "@/store/useUpsertFolderModal";

const MODAL_WIDTH = 170;

const FolderOptionsModal = function ExerciseOptionsModal() {
  const { theme } = useThemeStore((state) => state);
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const { isVisible, closeModal, props } = useFolderOptionsModal();
  const { buttonRef, folderId, folderName } = props;
  const { setRefetchWorkouts } = useAppStore();
  const { openModal: openActionModal } = useActionModal();
  const { openModal: openUpsertFolderModal } = useUpsertFolderModal();

  const deleteFolderHandler = async () => {
    await deleteFolder(folderId!);
    setRefetchWorkouts();
    closeModal();
  };

  const editTemplateHandler = () => {
    openUpsertFolderModal({ folderId: folderId!, folderName: folderName! });
    closeModal();
  };
  const openActionModalHandler = () => {
    openActionModal({
      title: "Delete Workout",
      subtitle: `Are you sure you want to folder ${folderName}?`,
      onProceed: deleteFolderHandler,
    });
    closeModal();
  };
  const options = [
    {
      Icon: <EvilIcons name="pencil" size={24} color={theme.blue} />,
      title: "Edit folder",
      cb: editTemplateHandler,
    },
    {
      Icon: <EvilIcons name="close" size={24} color={theme.red} />,
      title: "Delete",
      cb: openActionModalHandler,
    },
  ];

  return (
    <AnchoredModal
      isVisible={isVisible}
      closeModal={closeModal}
      anchorRef={buttonRef}
      anchorCorner="RIGHT"
      backgroundColor={theme.darkBlue}
      modalWidth={MODAL_WIDTH}
    >
      <View style={styles.wrapper}>
        {options.map((option) => {
          return <ModalOptionButton key={option.title} {...option} />;
        })}
      </View>
    </AnchoredModal>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
    },
    wrapper: {
      width: "100%",
    },
  });

export default FolderOptionsModal;
