import { StyleSheet, View } from "react-native";
import AnchoredModal from "./AnchoredModal";
import ModalOptionButton from "./ModalOptionButton";
import { EvilIcons } from "@expo/vector-icons";
import useWorkoutOptionsModal from "@/store/useWorkoutOptionsModal";
import { copyWorkout, deleteWorkout } from "@/lib/workoutServices";
import userStore from "@/store/userStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useMemo } from "react";
import { useRouter } from "expo-router";
import useActionModal from "@/store/useActionModal";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import useFoldersStore from "@/store/useFoldersStore";

const MODAL_WIDTH = 170;

const WorkoutOptionsModal = function ExerciseOptionsModal() {
  const { theme } = useThemeStore((state) => state);
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const { isVisible, closeModal, workoutProps } = useWorkoutOptionsModal();
  const { removeWorkoutFromFolder, addWorkoutToFolder, folders } =
    useFoldersStore();
  const { openModal: openActionModal } = useActionModal();
  const { buttonRef, workout } = workoutProps;

  const { user } = userStore();
  const router = useRouter();
  const deleteWorkoutHandler = async () => {
    await deleteWorkout(workout!.id);
    removeWorkoutFromFolder(workout?.folder_id!, workout!.id);
    closeModal();
  };
  //TODO FIX COPY
  //THE CARD HEIGHT IS WEIRD
  //MODAL DOESNT CLOSE
  const copyWorkoutHandler = async () => {
    const copiedWorkout = await copyWorkout(workout!, user!.id, folders[0].id);
    console.log(copiedWorkout);
    if (copiedWorkout) {
      addWorkoutToFolder(copiedWorkout.folder_id!, copiedWorkout);
    }
    closeModal();
  };
  const editTemplateHandler = () => {
    router.push(`/template/${workout?.folder_id}/${workout?.id}`);
    closeModal();
  };
  const openActionModalHandler = () => {
    openActionModal({
      title: "Delete Workout",
      subtitle: `Are you sure you want to delete ${workout?.name}?`,
      onProceed: deleteWorkoutHandler,
    });
    closeModal();
  };
  const options = [
    {
      Icon: <AntDesign name="copy1" size={24} color={theme.white} />,
      title: "Copy",
      cb: copyWorkoutHandler,
      conditionToDisplay: workout?.user_id !== user?.id,
    },
    {
      Icon: <EvilIcons name="pencil" size={24} color={theme.blue} />,
      title: "Edit template",
      cb: editTemplateHandler,
      conditionToDisplay: workout?.user_id === user?.id,
    },
    {
      Icon: <EvilIcons name="close" size={24} color={theme.red} />,
      title: "Delete",
      cb: openActionModalHandler,
      conditionToDisplay: workout?.user_id === user?.id,
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

export default WorkoutOptionsModal;
