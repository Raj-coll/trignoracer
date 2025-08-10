// src/data/levelData.js - UPDATED WITH NEW COORDINATES FOR THE CANDY MAP

// The 'pos' coordinates have been carefully updated to follow the new path.
// The path starts at the bottom and winds its way to the top.
// Feel free to tweak these percentage values to get the perfect placement!
export const initialLevels = [
  // These first 5 levels match your original game state, but with new positions
  { id: 1, status: 'completed', stars: 3, pos: { x: 50, y: 95 } },
  { id: 2, status: 'completed', stars: 1, pos: { x: 38, y: 85 } },
  { id: 3, status: 'unlocked',  stars: 0, pos: { x: 35, y: 70 } },
  { id: 4, status: 'locked',    stars: 0, pos: { x: 50, y: 65 } },
  { id: 5, status: 'locked',    stars: 0, pos: { x: 65, y: 58 } },

  // New positions for the rest of your levels
  { id: 6, status: 'locked',    stars: 0, pos: { x: 75, y: 50 } },
  { id: 7, status: 'locked',    stars: 0, pos: { x: 60, y: 42 } },
  { id: 8, status: 'locked',    stars: 0, pos: { x: 40, y: 28 } },
  { id: 9, status: 'locked',    stars: 0, pos: { x: 45, y: 38 } },
  { id: 10, status: 'locked',   stars: 0, pos: { x: 58, y: 22 } },
];