export type Exercise = {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  instructions?: string;
  image?: string;
  user_id: string | null;
};
