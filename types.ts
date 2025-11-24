export interface SimulationState {
  ipd: number; // Interpupillary Distance in abstract units (approx cm)
  focusDistance: number; // Distance to the focal point
  targetX: number; // Horizontal position of target
  showHelpers: boolean; // Toggle debug lines
  viewMode: 'split' | 'anaglyph' | 'cross'; // New: Viewing modes
}

export const INITIAL_STATE: SimulationState = {
  ipd: 6.5, // ~65mm average human IPD scaled
  focusDistance: 15,
  targetX: 0,
  showHelpers: true,
  viewMode: 'split',
};

export const COLORS = {
  leftEye: '#3b82f6', // blue-500
  rightEye: '#ef4444', // red-500
  target: '#eab308', // yellow-500
  background: '#111827', // gray-900
};