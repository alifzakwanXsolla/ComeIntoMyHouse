# Assets

## kenney/ (CC0, Kenney.nl, free for any use)

| Pack | Sheet to load | Tile size | Margin | Grid |
|---|---|---|---|---|
| Roguelike Indoors | `kenney/roguelike-indoors/Tilesheets/roguelikeIndoor_transparent.png` | 16x16 | 1px | 27 cols x 18 rows (458x305) |
| Roguelike Characters | `kenney/roguelike-characters/Spritesheet/roguelikeChar_transparent.png` | 16x16 | 1px | 54 cols x 12 rows (918x203) |

Phaser load example (note the margin/spacing):

    this.load.spritesheet('indoor', 'assets/kenney/roguelike-indoors/Tilesheets/roguelikeIndoor_transparent.png',
      { frameWidth: 16, frameHeight: 16, spacing: 1 });
    this.load.spritesheet('chars', 'assets/kenney/roguelike-characters/Spritesheet/roguelikeChar_transparent.png',
      { frameWidth: 16, frameHeight: 16, spacing: 1 });

Frame index = row * cols + col. Open the `Preview.png` / `Sample.png` in each folder to find the tiles you want.
Use pixelArt: true and integer scaling so the tiles stay crisp.

Credit (optional): Kenney (www.kenney.nl), CC0.
