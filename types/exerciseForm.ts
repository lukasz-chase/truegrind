export enum exerciseFormScreensEnum {
  Equipment = "Equipment",
  Main = "Main",
  Muscle = "Muscle",
}
export type exerciseFormScreenType = keyof typeof exerciseFormScreensEnum;

export type exerciseFormData = {
  name: string;
  instructions: string;
  muscle: string;
  equipment: string;
  image: undefined | string;
  imageWasChanged: boolean;
  imageExtension: string | undefined;
};
