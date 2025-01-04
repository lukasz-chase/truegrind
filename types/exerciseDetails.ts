export enum exerciseDetailScreensEnum {
  About = "About",
  Charts = "Charts",
  Records = "Records",
  History = "History",
}
export type exerciseDetailsScreenType = keyof typeof exerciseDetailScreensEnum;

export type exerciseFormData = {
  name: string;
  instructions: string;
  muscle: string;
  equipment: string;
  image: undefined | string;
  imageWasChanged: boolean;
  imageExtension: string | undefined;
};
