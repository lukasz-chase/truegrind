import { Text, StyleSheet, View, Pressable } from "react-native";
import useThemeStore from "@/store/useThemeStore";
import { useMemo, useRef } from "react";
import { ThemeColors } from "@/types/user";
import { SimpleLineIcons } from "@expo/vector-icons";
import useFolderOptionsModal from "@/store/useFolderOptionsModal";
import useFoldersStore from "@/store/useFoldersStore";
import * as Haptics from "expo-haptics";
import Animated from "react-native-reanimated";

type Props = {
  name: string;
  id: string;
  workoutsLength: number;
  setDragFolderId: React.Dispatch<React.SetStateAction<string | null>>;
  scrollRef: React.RefObject<Animated.ScrollView | null>;
  startAnEmptyWorkout: (folderId: string) => void;
};

export default ({
  name,
  workoutsLength,
  id,
  setDragFolderId,
  scrollRef,
  startAnEmptyWorkout,
}: Props) => {
  const buttonRef = useRef(null);
  const theme = useThemeStore((state) => state.theme);
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const openModal = useFolderOptionsModal((state) => state.openModal);
  const toggleFolderCollapse = useFoldersStore(
    (state) => state.toggleFolderCollapse
  );
  const handleOptions = () => {
    openModal({
      buttonRef,
      folderId: id,
      folderName: name,
      startAnEmptyWorkout,
    });
  };

  const onLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    //scroll to the top of the screen
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    setDragFolderId(id);
  };

  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => toggleFolderCollapse(id)}
        onLongPress={onLongPress}
        style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
      >
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.title}>({workoutsLength})</Text>
      </Pressable>

      <Pressable
        ref={buttonRef}
        onPress={handleOptions}
        style={styles.optionsButton}
      >
        <SimpleLineIcons name="options" size={20} color={theme.blue} />
      </Pressable>
    </View>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    header: {
      paddingVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      color: theme.textColor,
    },
    optionsButton: {
      paddingHorizontal: 5,
      backgroundColor: theme.lightBlue,
      borderRadius: 5,
    },
  });
