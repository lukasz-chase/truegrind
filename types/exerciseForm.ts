export enum exerciseFormScreensEnum {
  Equipment = "Equipment",
  Main = "Main",
  Muscle = "Muscle",
}
export type exerciseFormScreenType = keyof typeof exerciseFormScreensEnum;
