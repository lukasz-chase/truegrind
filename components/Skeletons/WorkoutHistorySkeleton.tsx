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
        <View style={[styles.skeleton, { width: 40 }]} />
        <View style={[styles.skeleton, { width: 150 }]} />
        <View style={{ width: 40 }} />
      </View>
      <View style={[styles.skeleton, { height: 300, width: "100%" }]} />
    </SafeAreaView>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    skeleton: {
      height: 30,
      backgroundColor: theme.gray,
    },
  });
