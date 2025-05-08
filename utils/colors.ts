export const generateNewColor = (
  currentColors: (string | null)[] | undefined
) => {
  // Curated palette with 24 distinct colors
  const colorPalette = [
    "#FF6B6B",
    "#48DBFB",
    "#1DD1A1",
    "#FECA57", // Original colors
    "#FF9FF3",
    "#F368E0",
    "#2ECC71",
    "#9B59B6", // Added new
    "#3498DB",
    "#E74C3C",
    "#FFA500",
    "#00CED1", // Blues/Oranges/Cyans
    "#7FFFD4",
    "#DA70D6",
    "#CD5C5C",
    "#00FA9A", // Earth tones
    "#8A2BE2",
    "#FF1493",
    "#32CD32",
    "#8B4513", // Vivid colors
    "#4682B4",
    "#DAA520",
    "#808000",
    "#6B8E23", // Muted tones
    "#4B0082",
    "#9932CC", // Purples
  ];

  const availableColors = colorPalette.filter(
    (color) => !(currentColors || []).includes(color)
  );

  // Fallback strategies if all colors are used
  if (availableColors.length === 0) {
    // Option 1: Return a random color not in original palette
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  return availableColors[Math.floor(Math.random() * availableColors.length)];
};
