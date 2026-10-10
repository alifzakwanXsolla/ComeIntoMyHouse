// Puzzle manifest. Browsers can't glob a folder with no build step, so to add a puzzle:
//   1. drop a file in src/puzzles/ exporting default { id, room, title, reward, start(scene, bus), isSolved() }
//   2. add one import + one array entry below.
import hall from './hall.js';

export const PUZZLES = [hall];
