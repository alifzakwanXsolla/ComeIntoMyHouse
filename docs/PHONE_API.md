# Phone API

The game and the phone UI talk only through the event bus in `src/bus.js`
(`import { bus } from '../bus.js'`). API: `bus.on(type, fn)` (returns an unsubscribe fn),
`bus.off(type, fn)`, `bus.emit(type, data)`. `bus.on('*', (type, data) => ...)` receives everything.

To replace the stub, edit one line in `src/main.js`: swap `initPhoneStub(bus, el)` for your init.
Add `?log=1` to the URL to console-log every event.

## Game -> Phone

| Event | Payload | When |
|---|---|---|
| `game:start` | none | Game scene begins |
| `door:behind` | none | ~4.5s in, the doors lock behind Kai |
| `room:entered` | `{roomId}` | Player crosses into a room (hall, kitchen, living, bedroom, basement) |
| `door:locked` | `{doorId}` | Player bumps a locked door (rate limited to 1 per 3s) |
| `puzzle:started` | `{id, title, room}` | Puzzle panel opened |
| `puzzle:progress` | `{id, detail}` | Puzzle reports partial progress |
| `puzzle:solved` | `{id, fragment}` | Puzzle solved; `fragment` is the digit |
| `puzzle:wrong` | `{id, strikes, totalStrikes}` | Wrong answer (`id` may be `door` for the keypad) |
| `hint:requested` | `{id}` | Player pressed H (costs `hintPenaltySeconds`) |
| `time:warning` | `{secondsLeft}` | At 600, 300, 120, 30 seconds left |
| `mood:changed` | `{mood}` | sweet / playful / jealous / furious |
| `scare:triggered` | `{kind, ...}` | Scripted scare fired. `kind`: `slam` (`roomId`), `footsteps`, `blackout` (`ms`) |
| `game:over` | `{reason}` | `time` or `strikes` |
| `game:win` | none | Front door opened |

## Phone -> Game

| Event | Payload | Effect |
|---|---|---|
| `phone:message` | `{from, text, typing?, sound?}` | Game only logs it; the phone renders it |
| `nikki:setMood` | `{mood}` | Forces a mood and stops automatic mood changes |
| `nikki:hint` | `{puzzleId, text}` | Shown as a toast in the game |
| `nikki:addTime` | `{seconds}` | Adds time |
| `nikki:removeTime` | `{seconds}` | Removes time |
| `nikki:unlockDoor` | `{doorId}` | Opens a door (kitchen, bedroom, living, basement, front) |
| `player:reply` | `{text}` | Reserved: the phone emits it when the player replies; the game ignores it for now |

Every `phone:message` from `nikki` also makes the game buzz and pulse the screen edge (max once per 2.5s).

## Scripted lines

All of Nikki's text lives in `src/script/nikkiScript.js` (events -> lines, plus riddles per puzzle and mood).
Edit it without touching code.
