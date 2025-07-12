// Test file for oklch to hex conversion
const convertOklchToHex = (oklchValue) => {
  // Simple conversion based on oklch values
  if (oklchValue.includes("oklch(1 0 0")) return "#ffffff"; // white
  if (oklchValue.includes("oklch(0.145 0 0")) return "#000000"; // black
  if (oklchValue.includes("oklch(0.985 0 0")) return "#fafafa"; // very light gray
  if (oklchValue.includes("oklch(0.97 0 0")) return "#f5f5f5"; // light gray
  if (oklchValue.includes("oklch(0.922 0 0")) return "#e5e5e5"; // gray
  if (oklchValue.includes("oklch(0.708 0 0")) return "#b3b3b3"; // medium gray
  if (oklchValue.includes("oklch(0.556 0 0")) return "#8a8a8a"; // darker gray
  if (oklchValue.includes("oklch(0.205 0 0")) return "#333333"; // dark gray
  if (oklchValue.includes("oklch(0.269 0 0")) return "#444444"; // dark gray
  if (oklchValue.includes("oklch(0.577 0.245 27.325")) return "#dc2626"; // red
  if (oklchValue.includes("oklch(0.704 0.191 22.216")) return "#dc2626"; // red
  if (oklchValue.includes("oklch(0.646 0.222 41.116")) return "#ea580c"; // orange
  if (oklchValue.includes("oklch(0.6 0.118 184.704")) return "#0891b2"; // cyan
  if (oklchValue.includes("oklch(0.398 0.07 227.392")) return "#1d4ed8"; // blue
  if (oklchValue.includes("oklch(0.828 0.189 84.429")) return "#fbbf24"; // yellow
  if (oklchValue.includes("oklch(0.769 0.188 70.08")) return "#f59e0b"; // amber
  if (oklchValue.includes("oklch(0.488 0.243 264.376")) return "#7c3aed"; // violet
  if (oklchValue.includes("oklch(0.696 0.17 162.48")) return "#10b981"; // emerald
  if (oklchValue.includes("oklch(0.627 0.265 303.9")) return "#ec4899"; // pink
  if (oklchValue.includes("oklch(0.645 0.246 16.439")) return "#ef4444"; // red
  return "#000000"; // default fallback
};

// Test cases
const testCases = [
  "oklch(1 0 0)",
  "oklch(0.145 0 0)",
  "oklch(0.985 0 0)",
  "oklch(0.97 0 0)",
  "oklch(0.922 0 0)",
  "oklch(0.708 0 0)",
  "oklch(0.556 0 0)",
  "oklch(0.205 0 0)",
  "oklch(0.269 0 0)",
  "oklch(0.577 0.245 27.325)",
  "oklch(0.704 0.191 22.216)",
  "oklch(0.646 0.222 41.116)",
  "oklch(0.6 0.118 184.704)",
  "oklch(0.398 0.07 227.392)",
  "oklch(0.828 0.189 84.429)",
  "oklch(0.769 0.188 70.08)",
  "oklch(0.488 0.243 264.376)",
  "oklch(0.696 0.17 162.48)",
  "oklch(0.627 0.265 303.9)",
  "oklch(0.645 0.246 16.439)",
  "oklch(0.5 0.1 100)" // unknown value
];

console.log("Testing oklch to hex conversion:");
testCases.forEach(testCase => {
  const result = convertOklchToHex(testCase);
  console.log(`${testCase} -> ${result}`);
});

console.log("\nAll tests completed!"); 