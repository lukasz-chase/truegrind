import { ThemeColors } from "@/types/user";

export const chartConfig = (theme: ThemeColors) => ({
  backgroundColor: theme.background,
  backgroundGradientFrom: theme.background,
  backgroundGradientTo: theme.background,
  decimalPlaces: 0,
  color: (opacity = 1) => theme.blue,
  labelColor: (opacity = 1) => theme.textColor,
  style: {
    borderRadius: 8,
  },
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: theme.darkBlue,
  },
});
