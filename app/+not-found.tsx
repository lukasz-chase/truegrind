import { View, StyleSheet } from "react-native";
import { Link, Stack } from "expo-router";
import useThemeStore from "@/store/useThemeStore";
import { useMemo } from "react";
import { ThemeColors } from "@/types/user";

export default function NotFoundScreen() {
  const { theme } = useThemeStore((state) => state);
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <>
      <Stack.Screen options={{ title: "Oops! Not Found" }} />
      <View style={styles.container}>
        <Link href="/" style={styles.button}>
          Go back to Home screen!
        </Link>
      </View>
    </>
  );
}
const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.black,
      justifyContent: "center",
      alignItems: "center",
    },

    button: {
      fontSize: 20,
      textDecorationLine: "underline",
      color: theme.white,
    },
  });
