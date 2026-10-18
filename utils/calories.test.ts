import { estimateCaloriesBurned } from "./calories";
import { User } from "@/types/user";

const user: User = {
  id: "user-id",
  username: "Test user",
  custom_timers: [],
  active_split_id: null,
  current_goal: null,
  profile_picture: null,
  age: null,
  height: null,
  weight: 80,
};

describe("estimateCaloriesBurned", () => {
  it("calculates calories from workout duration and body weight", () => {
    expect(estimateCaloriesBurned("01:30", user)).toBe(9);
  });

  it("returns zero when body weight is unavailable", () => {
    expect(estimateCaloriesBurned("01:30", { ...user, weight: null })).toBe(0);
  });
});
