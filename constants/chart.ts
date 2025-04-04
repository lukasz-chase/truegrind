import { AppColors } from "./colors";

export const chartConfig = {
  backgroundColor: AppColors.white,
  backgroundGradientFrom: AppColors.white,
  backgroundGradientTo: AppColors.white,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 8,
  },
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: AppColors.darkBlue,
  },
};
