# Game Storyline: Linear Ending ("The Escape")

**Genre:** Realistic psychological horror / thriller (2D, choice-driven)
**Status:** Prototype baseline. Only the escape ending is fully written. Other endings are stubbed.
**Purpose of this doc:** Give the dialogue writer the full flow, character info, tone, and the beats each scene needs to hit.

---

## 1. Core Concept

Imran is a normal guy who gets pulled into a night out. He meets a charming, beautiful woman named Nikki who turns out to be a serial killer. The player's choices decide how far they go into her trap. In this ending, Imran takes every "yes" path, gets drugged and locked in a soundproofed basement, and has to solve his way out of the house before Nikki comes back.

**Tone:** Starts light and warm (party, dinner), then slowly turns uneasy, then full dread. The horror comes from realism: no ghosts, just a person who is too calm and too prepared.

---

## 2. Characters

### Imran (Player character)
- Ordinary guy, a bit introverted, doesn't like parties.
- Goes along with friends because he can't say no easily. This is also why he goes along with Nikki.
- Not a fighter. He survives by observing and thinking, not by force.
- Voice: casual, a little awkward and self-deprecating, gets flustered when he likes someone.

### Nikki (Antagonist)
- Beautiful, confident, warm, easy to talk to. She makes people feel special.
- Underneath: patient, methodical, and calm. She never rushes.
- **Mask:** sweet, attentive, a good listener.
- **Slip-ups (subtle, seeded early):** she asks questions that sound like interest but are actually checking if he's alone and who'd miss him; she doesn't touch her own drink; she knows one thing about him she shouldn't.
- Voice: soft, warm, slightly teasing. Never raises her voice, even when she's terrifying. The calmer she gets, the more dangerous she is.

### Imran's Friends (minor, Scene 1)
- The group that drags him to the party. They are the "normal world" he leaves behind. Keep them short and fun.

---

## 3. Setting

- **The party:** Crowded, loud, someone's house or a rented venue.
- **The restaurant:** Fancy, quiet, candlelit.
- **Nikki's house:** A **double-storey** house in a quiet residential area. Neighbours are far apart, which is part of why nobody would hear anything. Neat and tidy on the outside, and slightly *too* clean on the inside.

### House Layout (for level design)
| Floor | Rooms |
|---|---|
| **Basement** | Locked soundproofed room (where Imran wakes up), small corridor outside it, staircase up |
| **Ground floor** | Living room, kitchen, study/office, hallway, front door (deadbolt, needs key), barred back door |
| **Second floor** | Nikki's bedroom, bathroom, guest room, upstairs hallway |

---

## 4. Full Story Flow

### SCENE 1: The Party
**Goal:** Establish Imran's personality, introduce Nikki, plant the first hint of unease.

**Beats:**
1. Imran is at the party only because his friends dragged him. He's bored and keeps checking his phone.
2. Nikki walks past and he's instantly drawn to her. Short beat of him building up courage.
3. He approaches her. They chat and get along naturally. She's funny and interested in him.
4. **Plant a red flag (subtle):** she asks something like whether he came with friends and whether they'll be looking for him, said in a casual way.
5. The conversation is going well, then the choice.

**CHOICE 1:**
- **Ask her out to dinner tonight** → Scene 2
- **Don't ask** → *Ending B (stub): she kills him on the way home*

---

### SCENE 2: The Dinner
**Goal:** Build trust and chemistry, plant details the player will need later, set up the invitation.

**Beats:**
1. Fancy restaurant. Nikki is charming and elegant. Light conversation, shared laughs.
2. They talk about each other's lives. **Nikki shares personal-sounding stories (these are puzzle clues, see Section 5):**
   - She mentions a pet she "lost," with a name (suggested: a dog called **Biscuit**) and the year she got him.
   - She mentions a number that is "her lucky number" or a date that "means a lot to her." (This will be the door keypad code.)
3. **Plant red flags (subtle):** she barely touches her drink or food, she asks about his family and whether he lives alone, and she never talks about her own friends.
4. At the end of the night, she leans in and invites him to spend the night with her.

**CHOICE 2:**
- **Accept** → Scene 3
- **Reject** → *Ending C (stub): she kills him later*

**Writer's note:** Nikki's lines in this scene must read as sweet on first read, but creepy on replay. Write them so the player can look back and say "I should have seen that."

---

### SCENE 3: Nikki's House
**Goal:** Build dread. Imran senses something is wrong but walks in anyway.

**Beats:**
1. They arrive outside her house. Imran notices the surroundings: quiet, dark, no neighbours nearby, cameras he didn't expect, thick curtains on every window.
2. He gets an uneasy feeling. Brief inner monologue. He decides to go in anyway (he doesn't want to seem rude or paranoid).
3. Inside, the house is very clean. Nikki seems relaxed and at home.
4. They sit in the living room and chat. Nikki goes to the kitchen and serves him a drink. She's friendly and keeps the conversation flowing.
5. After a while Imran feels drowsy. Nikki watches him calmly. He passes out. *(Screen fades to black. Include a close-up of Nikki's face at the end: no longer smiling.)*

---

### SCENE 4: The Locked Room (Basement)
**Goal:** The moment the horror becomes real. Introduce the gameplay loop.

**Beats:**
1. Imran wakes up in **total darkness**. His head is heavy. He's lying on a cold floor or old mattress.
2. He calls out. Nothing. He feels around and finds the door. **It's locked.**
3. He pounds on the door and shouts. No response. The room is **soundproofed**: his voice feels dead, with no echo, and that tells him no one will hear him.
4. Panic moment (short). He forces himself to calm down.
5. He feels a faint glow in the room: a **PC monitor in standby**. He gets to it and turns it on.
6. The PC is locked behind a **login screen** (see puzzle chain). Next to the screen there's a small light he can find (see below).
7. Once he gets in, he sees the files: photos, names, dates of Nikki's previous victims. Some of them look just like him: same age, same situation, met at parties. Realization: *he's next.*
8. He decides not to give up and starts searching the room.

---

## 5. Puzzle Chain (The Escape Gameplay)

The whole escape is a linear chain: each solution unlocks the next step. Every clue ties back to something the player saw earlier, so players who paid attention are rewarded.

### Part A: The Basement Room

| Step | Player action | Result |
|---|---|---|
| 1 | Search the dark room by touch | Find a **flashlight** in a toolbox (it has no batteries) |
| 2 | Search further | Find **batteries** hidden inside an old wall clock or radio |
| 3 | Flashlight on | See the full room: desk, shelves with **trophies** (items belonging to victims), a boarded-up window, a mattress, the PC |
| 4 | Use the PC | Login screen asks for a **password**. Hint: a sticky note or screen hint reads *"Who I miss the most + the year"* |
| 5 | Enter password | Password = **pet name + year** (e.g. Biscuit + the year from the dinner story). If the player paid attention at dinner, they know it. If not, they can find a backup clue in a photo frame in the room. |
| 6 | Read PC files | Victim files, plus a **log file** with Nikki's routine. It also shows the **door keypad code** (the "lucky number/date" from dinner, so the player can confirm it) |
| 7 | Door has an electronic keypad on the outside edge, reachable through a **small hatch/slot** | Enter the code. **Door unlocks.** |

> **Note:** If you want to keep the prototype simple, steps 1-2 can be merged into one (flashlight already has batteries).

### Part B: The Basement Corridor
1. Imran steps out carefully. A short, dim corridor, with the staircase leading up.
2. **Tension beat:** footsteps upstairs. Nikki is walking around. He freezes and waits for them to pass.
3. He moves up the stairs slowly, avoiding creaky steps (optional mini-mechanic).

### Part C: Ground Floor
The **front door is deadbolted and needs a key**. The back door is barred. Imran needs to find the key.

| Step | Player action | Result |
|---|---|---|
| 1 | Reach the living room. Nikki is not in sight, but her voice or footsteps can be heard upstairs. | Sets the tension |
| 2 | Check the kitchen and study | Find **his phone is not here**, but find a **note/hint**: the spare keys are kept "where she keeps her favourite things" (the second floor bedroom) |
| 3 | In the study, find a **drawer with a house plan** or a hint that the key is in Nikki's bedroom | Confirms where to go |

### Part D: Second Floor
Nikki is in the bathroom or on a phone call in the guest room (her voice is audible). Imran must sneak past.

| Step | Player action | Result |
|---|---|---|
| 1 | Sneak along the upstairs hallway (avoid light under doorways, creaky floorboards) | Safe route to her bedroom |
| 2 | Enter Nikki's bedroom | Find a **locked jewelry/trophy box** containing the **front door key** and **Imran's phone** |
| 3 | Box needs a **3-digit or 4-digit code** | Code = a number found in the basement PC files (e.g., the date of her first victim) or a framed date in the bedroom |
| 4 | Take the key (and phone) | Nikki's footsteps approach. **Hide moment** (under the bed or in the wardrobe) while she walks in, then leaves |

### Part E: The Escape
1. Imran sneaks back downstairs.
2. Unlocks the front door deadbolt with the key.
3. Opens it. **Nikki appears at the top of the stairs** (or calls his name sweetly from upstairs) just as he steps outside.
4. He runs.

---

## 6. The Ending (Linear Escape)

**Final Scene: Outrun**
1. Imran sprints into the dark, quiet neighbourhood. Nikki does not chase openly. She calmly stands at the doorway and watches him go. (This is scarier than a chase.)
2. He reaches a main road, flags down a car or a passerby, and uses his phone to call the police.
3. **Final beat:** Imran sits in the back of a police car, shaking. The police are heading toward the house. Cut to the house: the lights are on and the door is open, but **Nikki is gone.**
4. **Closing text/line:** something that leaves a small chill, e.g. a text message appearing on Imran's phone from an unknown number: *"It was nice meeting you."*

**Purpose of this ending:** The player gets a "win," but Nikki is still out there. This sets up the possibility of sequels or a "true ending" later.

---

## 7. Foreshadowing Checklist (for the dialogue writer)

Make sure these are planted so the player feels rewarded:

- [ ] Nikki asks if anyone is waiting for him / who knows where he is (Scene 1)
- [ ] Nikki doesn't touch her own drink or food (Scene 2)
- [ ] Nikki tells the pet-name + year story (Scene 2): used for PC password
- [ ] Nikki mentions her lucky number/date (Scene 2): used for door keypad
- [ ] Cameras and heavy curtains at the house (Scene 3)
- [ ] The house is overly clean and has no personal photos on the ground floor (Scene 3)
- [ ] Nikki locks the front door behind them and takes the key (Scene 3)

---

## 8. Dialogue Writing Notes

**Tone per scene:**
| Scene | Nikki's tone | Imran's tone |
|---|---|---|
| Party | Playful, flirty, curious | Nervous, awkward, charmed |
| Dinner | Warm, deep, "emotionally open" | Comfortable, opening up |
| House | Calm, hospitable, quietly controlling | Uneasy, trying to stay polite |
| Basement | (absent; her voice only in logs/notes) | Panic then determination |
| Escape | Soft, almost playful from a distance | Terrified, focused |

**Rules to keep her scary:**
- Nikki never yells.
- She uses his name often.
- Her kindest lines should be the most unsettling ones on a second read.

---

## 9. Other Endings (Stubs, for later)

| Ending | Trigger | Outcome (to be developed) |
|---|---|---|
| **Ending B** | Choice 1: don't ask her out | Nikki kills him on the way home |
| **Ending C** | Choice 2: reject the invitation | Nikki kills him later |
| **Escape (this doc)** | Accept everything and solve the puzzles | Imran survives |

**Future ideas:** a refuse-the-drink choice in Scene 3, a "caught while escaping" ending, a "true ending" where Nikki is stopped, and more choices inside the dinner conversation.

---

## 10. Open Questions for the Team

1. Should Imran's phone be taken from him at the start of Scene 3 (clean) or found in the bedroom (as written)?
2. How strict is the stealth part: instant fail if caught, or a chase sequence?
3. How many dialogue options per choice: just 2 big ones, or smaller choices inside the conversation too?
4. Is there background music/sound design planned for the basement (silence = soundproof)?
