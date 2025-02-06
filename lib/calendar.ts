import * as Calendar from "expo-calendar";
import { Alert, Platform } from "react-native";

const requestCalendarPermissions = async () => {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permission Required",
      "Please allow calendar access in settings."
    );
    return false;
  }
  return true;
};
const getDefaultCalendarSource = async () => {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
};
export async function getWorkoutCalendarId(): Promise<string | undefined> {
  // 1) Ensure we have permissions
  const permissionGranted = await requestCalendarPermissions();
  if (!permissionGranted) return undefined;

  // 2) Get all EVENT-type calendars
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT
  );

  // 3) Look for an existing "Workout Tracker" that allows modifications
  let workoutCalendar = calendars.find(
    (cal) => cal.title === "Workout Tracker" && cal.allowsModifications
  );
  if (workoutCalendar) {
    return workoutCalendar.id;
  }

  if (Platform.OS === "ios") {
    // iCloud calendars often have source.type === "caldav" and source.name === "iCloud"
    const suitableSourceCalendar = calendars.find(
      (cal) =>
        cal.source?.name === "iCloud" &&
        cal.source?.type === "caldav" &&
        cal.allowsModifications
    );
    if (suitableSourceCalendar) {
      return suitableSourceCalendar.id;
    }
  } else {
    // Android: look for a local calendar (source.type === "local") that allows modifications
    const suitableSourceCalendar = calendars.find(
      (cal) => cal.source?.type === "local" && cal.allowsModifications
    );
    if (suitableSourceCalendar) {
      return suitableSourceCalendar.id;
    }
  }

  // 5) Fallback: if no platform-specific found, just pick any that allows modifications

  const suitableSourceCalendar = calendars.find(
    (cal) => cal.allowsModifications
  );
  if (suitableSourceCalendar) {
    return suitableSourceCalendar.id;
  }
  const defaultCalendarSource =
    Platform.OS === "ios"
      ? await getDefaultCalendarSource()
      : {
          isLocalAccount: true,
          name: "Expo Calendar",
          id: "internalCalendarName",
          type: "local",
        };
  // 6) Attempt to create our "Workout Tracker" calendar in this source
  try {
    const newCalendarID = await Calendar.createCalendarAsync({
      title: "Workouts",
      color: "blue",
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      source: defaultCalendarSource,
      name: "internalCalendarName",
      ownerAccount: "personal",
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });

    return newCalendarID;
  } catch (error) {
    console.error("Error creating Workout Tracker calendar:", error);
    Alert.alert("Error", "Failed to create a new 'Workout Tracker' calendar.");
  }
}

export const addWorkoutToLocalCalendar = async (workout: {
  name: string;
  startDateTime: Date;
  endDateTime: Date;
}) => {
  try {
    const calendarId = await getWorkoutCalendarId();
    if (!calendarId) return;

    const eventId = await Calendar.createEventAsync(calendarId, {
      title: workout.name,
      startDate: workout.startDateTime,
      endDate: workout.endDateTime,
    });
    return eventId;
  } catch (error) {
    console.error("Error adding event:", error);
  }
};
export const removeWorkoutFromLocalCalendar = async (eventId: string) => {
  try {
    const upperCaseEventId = eventId.toUpperCase();
    await Calendar.deleteEventAsync(upperCaseEventId);
    console.log(`Event ${upperCaseEventId} deleted successfully.`);
  } catch (error) {
    console.error("Error removing event:", error);
  }
};
