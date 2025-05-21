import { Href, useRouter } from "expo-router";
import { Text, StyleSheet, View, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import useThemeStore from "@/store/useThemeStore";
import { useMemo } from "react";
import { ThemeColors } from "@/types/user";

type Props = {
  name: string;
  href: Href;
};

export default ({ name, href }: Props) => {
  const router = useRouter();
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const goBackHandler = () => {
    router.push(href);
  };

  return (
    <View style={styles.header}>
      <Pressable onPress={goBackHandler}>
        <AntDesign name="left" size={24} color={theme.textColor} />
      </Pressable>
      <Text style={styles.title}>{name}</Text>
      <View style={{ width: 24 }} />
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
  });
