import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface Props {
  parentStyles: any;
}

export default ({ parentStyles }: Props) => {
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <SafeAreaView style={parentStyles.container}>
      <View style={parentStyles.header}>
        <View style={[styles.skeleton, { width: 50 }]} />
        <View style={[styles.skeleton, { width: 150 }]} />
        <View style={[styles.skeleton, { width: 50 }]} />
      </View>
      <View style={{ flexDirection: "column", gap: 10, padding: 10 }}>
        <View style={[styles.skeleton, { width: 150 }]} />
        <View style={[styles.skeleton, { width: 50 }]} />
        <View style={[styles.skeleton, { width: 200 }]} />
        <View style={[styles.skeleton, { width: "100%" }]} />
        <View style={[styles.skeleton, { width: "100%" }]} />
        <View style={[styles.skeleton, { width: "100%" }]} />
        <View style={[styles.skeleton, { width: "100%" }]} />
      </View>
    </SafeAreaView>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    skeleton: {
      height: 40,
      backgroundColor: theme.gray,
    },
  });
