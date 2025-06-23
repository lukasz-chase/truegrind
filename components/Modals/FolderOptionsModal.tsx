import { StyleSheet, View } from "react-native";
import AnchoredModal from "./AnchoredModal";
import ModalOptionButton from "./ModalOptionButton";
import { EvilIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import useActionModal from "@/store/useActionModal";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import useFolderOptionsModal from "@/store/useFolderOptionsModal";
import { deleteFolder } from "@/lib/folderService";
import useUpsertFolderModal from "@/store/useUpsertFolderModal";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useFoldersStore from "@/store/useFoldersStore";
import useInfoModal from "@/store/useInfoModal";

const MODAL_WIDTH = 170;

const FolderOptionsModal = function ExerciseOptionsModal() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { theme } = useThemeStore((state) => state);
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const { isVisible, closeModal, props } = useFolderOptionsModal();
  const { buttonRef, folderId, folderName } = props;
  const { openModal: openActionModal } = useActionModal();
  const { openModal: openUpsertFolderModal } = useUpsertFolderModal();
  const { toggleFolderCollapse, collapsedFolders, folders } = useFoldersStore();
  const { openModal: openInfoModal } = useInfoModal();
  useEffect(() => {
    if (folderId) setIsCollapsed(collapsedFolders.includes(folderId));
  }, [folderId, collapsedFolders]);
  const deleteFolderHandler = async () => {
    const { error } = (await deleteFolder(folderId!)) ?? {};
    closeModal();
    if (error) {
      openInfoModal("Error", error);
    }
  };
  const toggleFolderCollapseHandler = () => {
    toggleFolderCollapse(folderId!);
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
      conditionToDisplay: true,
    },
    {
      Icon: isCollapsed ? (
        <MaterialCommunityIcons
          name="arrow-expand"
          size={24}
          color={theme.blue}
        />
      ) : (
        <MaterialCommunityIcons
          name="arrow-collapse"
          size={24}
          color={theme.blue}
        />
      ),
      title: isCollapsed ? "Expand" : "Collapse",
      cb: toggleFolderCollapseHandler,
      conditionToDisplay: true,
    },
    {
      Icon: <EvilIcons name="close" size={24} color={theme.red} />,
      title: "Delete",
      cb: openActionModalHandler,
      conditionToDisplay: folders.length > 1,
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
          if (option.conditionToDisplay) {
            return <ModalOptionButton key={option.title} {...option} />;
          }
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
