# Phone / notes popup API

The popup in the bottom right is `src/game/notes.js`. It talks to the game only through the event bus (`src/bus.js`).

## Events the game emits

| Event | Data | When |
|---|---|---|
| `game:start` | – | New run started (reset the popup) |
| `note:add` | `{ id }` | Imran discovered a clue. Text is in `NOTES[id]` in `src/game/story.js` |
| `notes:restore` | `{ ids }` | After retry from a checkpoint |
| `phone:pickup` | – | Imran got his phone back from the trophy box (show the phone UI from now on) |
| `phone:message` | `{ from, text }` | A text arrives (a friend after the hide scene; "Unknown number" at the ending) |
| `game:over` | `{ reason }` | Caught |
| `game:win` | – | Reached the ending |

## Replacing the phone UI

Keep `notes.js` for the sticky notes, and render your phone UI on `phone:pickup` / `phone:message`. To send extra texts at story beats, call `bus.emit('phone:message', { from: 'Faris', text: '...' })` from `src/game/RoomScene.js` or `src/game/interact.js`.
