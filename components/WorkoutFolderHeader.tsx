import { Text, StyleSheet, View, Pressable } from "react-native";
import useThemeStore from "@/store/useThemeStore";
import { useMemo, useRef } from "react";
import { ThemeColors } from "@/types/user";
import { SimpleLineIcons } from "@expo/vector-icons";
import useFolderOptionsModal from "@/store/useFolderOptionsModal";

type Props = {
  name: string;
  id: string;
  workoutsLength: number;
};

export default ({ name, workoutsLength, id }: Props) => {
  const buttonRef = useRef(null);
  const { theme } = useThemeStore((state) => state);
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { openModal } = useFolderOptionsModal();
  const handleOptions = () => {
    openModal({ buttonRef, folderId: id, folderName: name });
  };

  return (
    <View style={styles.header}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.title}>({workoutsLength})</Text>
      </View>
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
