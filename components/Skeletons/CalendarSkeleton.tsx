import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export interface Props {
  parentStyles: any;
}

export default ({ parentStyles }: Props) => {
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={[parentStyles.legendsContainer, parentStyles.legendsWrapper]}>
      <View style={styles.legendSkeleton} />
      <View style={styles.legendSkeleton} />
      <View style={styles.legendSkeleton} />
    </View>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    legendSkeleton: {
      height: 40,
      width: 50,
      backgroundColor: theme.gray,
      borderRadius: 10,
    },
  });
