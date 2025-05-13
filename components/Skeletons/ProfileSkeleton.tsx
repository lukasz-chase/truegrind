import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors } from "@/constants/colors";

export interface Props {
  parentStyles: any;
}

export default ({ parentStyles }: Props) => {
  return (
    <SafeAreaView style={parentStyles.safeArea}>
      <View
        style={[
          styles.skeletonItem,
          { width: 150, height: 30, borderRadius: 4 },
        ]}
      />
      <View
        style={[
          styles.skeletonItem,
          { width: 100, height: 100, borderRadius: 50 },
        ]}
      />
      <View
        style={[
          styles.skeletonItem,
          { width: 200, height: 30, borderRadius: 4 },
        ]}
      />
      <View
        style={[
          parentStyles.infoContainer,
          { width: "100%", justifyContent: "space-around" },
        ]}
      >
        <View
          style={[
            styles.skeletonItem,
            { width: 60, height: 20, borderRadius: 4 },
          ]}
        />
        <View
          style={[
            styles.skeletonItem,
            { width: 60, height: 20, borderRadius: 4 },
          ]}
        />
        <View
          style={[
            styles.skeletonItem,
            { width: 60, height: 20, borderRadius: 4 },
          ]}
        />
      </View>
      <View style={[parentStyles.boxesContainer, { width: "100%" }]}>
        {Array.from({ length: 3 }).map((_, idx) => (
          <View
            key={idx}
            style={[
              parentStyles.infoBox,
              { alignItems: "center", justifyContent: "center" },
            ]}
          >
            <View
              style={[
                styles.skeletonItem,
                { width: "80%", height: 15, borderRadius: 4 },
              ]}
            />
            <View
              style={[
                styles.skeletonItem,
                { width: "60%", height: 15, borderRadius: 4 },
              ]}
            />
            <View
              style={[
                styles.skeletonItem,
                { width: "40%", height: 15, borderRadius: 4 },
              ]}
            />
          </View>
        ))}
      </View>
      <View
        style={[
          parentStyles.progressWrapper,
          { width: "100%", height: 100, justifyContent: "center" },
        ]}
      >
        <View
          style={[
            styles.skeletonItem,
            { width: "90%", height: 20, borderRadius: 4 },
          ]}
        />
        <View
          style={[
            styles.skeletonItem,
            { width: "90%", height: 10, marginTop: 10, borderRadius: 4 },
          ]}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  skeletonItem: {
    backgroundColor: AppColors.gray,
  },
});
