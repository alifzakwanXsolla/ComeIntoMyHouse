# Deadbolt

Top-down psychological horror puzzle game. Phaser 3 from a CDN, plain ES modules, no build step.

## Run

```
cd ComeIntoMyHouse
python3 -m http.server 8000      # or: npx serve
```

Open http://localhost:8000/ (add `?debug=1` for the debug panel, `?log=1` to log bus events).
It must be served over HTTP; opening index.html via file:// will not load modules.

Controls: WASD/arrows move, E interact, H ask Nikki for help (costs time), Esc close a panel, F1 toggle debug.

## Layout

- `src/config.js` all tunables and asset paths (timer, strikes, moods, audio files, final code order)
- `src/world/map.js` rooms, doors, interactable objects
- `src/puzzles/` one file per puzzle, registered in `src/puzzles/index.js`
- `src/script/nikkiScript.js` Nikki's lines (data only)
- `src/phone/phoneStub.js` placeholder phone overlay; real phone: see `docs/PHONE_API.md`
- `src/systems/` timer, mood, lighting, audio, puzzle manager, debug

## Add a puzzle

1. Create `src/puzzles/mypuzzle.js` exporting default
   `{ id, room, title, reward, isSolved(), start(scene, bus) }`.
   In `start`, open `scene.panel.open(title)`, build the UI, then call
   `scene.puzzles.solve(scene, id)` or `scene.puzzles.wrong(scene, id)`.
2. Import it and add it to the array in `src/puzzles/index.js`.
3. Add its object to `OBJECTS` in `src/world/map.js` (`kind: 'puzzle', puzzle: 'id'`).
4. Add riddles under `riddles.<id>` in `nikkiScript.js`, and the id to `finalOrder` in config if its digit is part of the code.

## Audio

Drop optional files at the paths in `CONFIG.audio`. Missing files fall back to procedural sounds.
