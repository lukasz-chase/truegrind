import { StyleSheet } from "react-native";
import { View, Text, Card, Button, WheelPicker } from "react-native-ui-lib";
export default function MetricsScreen() {
  return (
    <View flex padding-page>
      <Text heading marginB-s4>
        My Screen
      </Text>
      <Card height={100} center padding-card marginB-s4>
        <Text body>This is an example card </Text>
      </Card>
      <WheelPicker
        items={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
          { label: "Maybe", value: "maybe" },
        ]}
        initialValue={"yes"}
        numberOfVisibleRows={2}
        onChange={() => console.log("changed")}
      />
      <Button label="Button" body bg-primaryColor square></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
