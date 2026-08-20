type ObjectProps = {
  color: string;
  bottom: string;
  left: string;
  rotation: string;
};

export const cardLayout: Record<number, ObjectProps> = {
  1: { color: "#ef4444", bottom: "82%", left: "50%", rotation: "180deg" }, // Top
  2: { color: "#f97316", bottom: "70%", left: "75%", rotation: "231deg" }, // Top-Right
  3: { color: "#eab308", bottom: "43%", left: "81%", rotation: "283deg" }, // Mid-Right
  4: { color: "#22c55e", bottom: "21%", left: "64%", rotation: "334deg" }, // Bottom-Right
  5: { color: "#06b6d4", bottom: "21%", left: "36%", rotation: "26deg" },  // Bottom-Left
  6: { color: "#3b82f6", bottom: "43%", left: "19%", rotation: "77deg" },  // Mid-Left
  7: { color: "#a855f7", bottom: "70%", left: "25%", rotation: "129deg" }, // Top-Left
  8: { color: "#ec4899", bottom: "50%", left: "50%", rotation: "0deg" }    // Center
};

export const NUM_CARDS = 57;