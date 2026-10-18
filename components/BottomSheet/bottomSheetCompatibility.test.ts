import { StyleSheet } from "react-native";

// Verify the installed library, so a missing postinstall patch is caught too.
const implementations = [
  {
    name: "commonjs",
    hosting: jest.requireActual("@gorhom/bottom-sheet/lib/commonjs/components/bottomSheetHostingContainer/styles").styles,
    backdrop: jest.requireActual("@gorhom/bottom-sheet/lib/commonjs/components/bottomSheetBackdrop/styles").styles,
    background: jest.requireActual("@gorhom/bottom-sheet/lib/commonjs/components/bottomSheetBackground/styles").styles,
  },
];

describe.each(implementations)("bottom sheet layout ($name)", (styles) => {
  it("fills the parent so the sheet has a measurable container", () => {
    expect(StyleSheet.flatten(styles.hosting.container)).toMatchObject(
      StyleSheet.absoluteFill,
    );
    expect(StyleSheet.flatten(styles.backdrop.backdrop)).toMatchObject(
      StyleSheet.absoluteFill,
    );
    expect(StyleSheet.flatten(styles.background.container)).toMatchObject(
      StyleSheet.absoluteFill,
    );
  });
});
