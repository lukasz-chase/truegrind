This is a workout tracking app, primarily inspired by the UI and UX of another popular app called Strong.
Tech Stack: React Native, TypeScript, Expo, Supabase.

Walkthrough:
https://www.youtube.com/watch?v=SJMwyyXW7Bk&ab_channel=coolwoocash
The app is divided into five main tabs: Profile, Metrics, Workout, Exercises, Calendar.

Profile
In this section, users can view personal information if they have filled it in:

 - Profile picture

 - Age

- Height

- Weight

- Workout frequency

- Upcoming workouts

- Metric goals

From the Profile tab, users can:

- Edit their personal data

- Set a metric goal to track

- Change the app theme

- Delete their account

- Export their data

- Sign out

Metrics
Tracks the following data:

- Core metrics: Weight, Body Fat

- Body parts: Neck, Shoulders, Chest, Left Biceps, Right Biceps, Left Forearm, Right Forearm, Waist, Stomach, Hips, Left Thigh, Right Thigh, Left Calf, Right Calf

Each metric has a dedicated screen where the user can:

- Add new entries

- View data as a chart

- View data in a list

Workout
This is the main screen of the app.
Users can select a workout split from predefined options:

- Bro Split

- Full Body

- Upper/Lower

- Hybrid Split

- Push Pull Legs

Each split includes example workouts. Users can also create their own custom split.

From this tab, users can:

- Start a new workout

- Choose a previously created workout

- When starting a workout, a bottom sheet appears with the list of exercises and sets. Users can:

- Delete or replace exercises

- Add exercises from the list or create new ones

- For each set, choose the type (Regular, Warmup, Drop Set)

- Add notes

- Set automatic timers (different for regular and warmup sets)

- Input weight and reps

Special features include:

- A custom keyboard for setting weight, allowing selection of barbell type (which adjusts the bar weight)

- On the reps input, users can add partials and RPE

After completing the workout, users are taken to a summary page.

Exercises
A simple view listing all available exercises.
Users can:

- Create new exercises

- Filter the list of exercises

Calendar
A calendar view that shows:

- Completed workouts

- Scheduled (upcoming) workouts

When planning a workout for a future date, it is added to the user's phone calendar.
Users can also tap on completed workouts to view their summary page.
