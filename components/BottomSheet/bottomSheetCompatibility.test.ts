import { createElement } from "react";
import { act, create, ReactTestRenderer } from "react-test-renderer";
import { StyleSheet, View } from "react-native";

jest.mock("@gorhom/bottom-sheet/lib/commonjs/utilities", () => ({
  print: jest.fn(),
}));

const { BottomSheetHostingContainer } = jest.requireActual(
  "@gorhom/bottom-sheet/lib/commonjs/components/bottomSheetHostingContainer/BottomSheetHostingContainer",
);

describe("bottom sheet layout", () => {
  it("renders a full-screen container that can measure the sheet", () => {
    let tree!: ReactTestRenderer;
    try {
      act(() => {
        tree = create(createElement(BottomSheetHostingContainer));
      });
      const container = tree.root.findByType(View);
      expect(StyleSheet.flatten(container.props.style)).toMatchObject(
        StyleSheet.absoluteFill,
      );
      expect(container.props.pointerEvents).toBe("box-none");
      expect(container.props.onLayout).toEqual(expect.any(Function));
    } finally {
      if (tree) act(() => tree.unmount());
    }
  });
});
