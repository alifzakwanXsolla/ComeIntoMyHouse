# Deadbolt

2D pixel-art psychological horror escape game. Phaser 3 (bundled in `assets/vendor/`), plain ES modules, no build step.

## Run

```
python3 -m http.server 8000
```

Open http://localhost:8000/ — must be served over HTTP (file:// will not load modules).

Controls: WASD/arrows move, SHIFT sneak, E use, H hint, N notes, F flashlight, Esc close a panel.

## Who edits what

| You want to change | File |
|---|---|
| Any text: intro, object descriptions, notes, hints, PC files, ending | `src/game/story.js` |
| Puzzle answers (password, keypad, box code) | `ANSWERS` in `src/game/story.js` |
| Room layouts, furniture, doors | `src/game/rooms.js` |
| What pressing E on something does | `src/game/interact.js` |
| Puzzle panels (PC, keypad, trophy box, photo wall, house plan) | `src/game/panels.js` + `styles.css` |
| Notes / phone popup | `src/game/notes.js` (see `docs/PHONE_API.md`) |
| Movement, lighting, stealth, hide sequence | `src/game/RoomScene.js` |
| Pixel art (procedural) | `src/art/` |

## Puzzle chain (spoilers)

1. **Dark basement**: flashlight in the toolbox + batteries from the stopped wall clock = light.
2. **PC**: password = pet name + year she got him (`biscuit2014`, from the dinner intro). Typing the year he died gives a nudge.
3. **Keypad through the door hatch**: her "lucky day" 12 July = `0712`. Keys 0/1/2/7 are worn.
4. **Corridor**: footsteps overhead, dust falls. Stand still until they pass or the noise meter fills.
5. **Ground floor**: front door needs a key. The house plan in the study says the spare key is with "her favourite things" upstairs.
6. **Upstairs**: she is in the bath. Sneak (SHIFT), avoid cracked boards.
7. **Trophy box**: "For my first." PC says Aaron was first; the photo wall says Aaron = 03/19, so `0319`.
8. **Hide**: she comes back. Hide in the bed or wardrobe and do not touch movement keys.
9. **Escape**: front door with the key. She calls your name. Run right.

Getting caught restarts from the last checkpoint (corridor, upstairs, or the hide).

## Debug

`?debug=1` skips the title. Number keys jump: 1 cell, 2 corridor, 3 hallway, 4 study, 5 upstairs, 6 bedroom, 7 hallway with the key.

## Old files

The first prototype is no longer used. These can be deleted: `src/config.js`* , `src/systems/` (except `Audio.js`), `src/ui/hud.js`, `src/ui/panel.js`, `src/ui/notesPopup.js`, `src/world/`, `src/puzzles/`, `src/script/`, `src/scenes/`, `src/phone/`, `src/testroom/`, `test-room.html`, `tools/`.
\* `src/config.js` is still imported by `src/art/` — keep it until the art is pointed elsewhere.

Art: procedural pixel art in `src/art/`, plus Kenney "Roguelike Indoors" (CC0) in `assets/kenney/`.
