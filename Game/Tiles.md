# Tiles
This file will describe every tile in the game

## Tile Types
+ Blank_Space
    + This tile is literally a blank space.
    + The ID is always `0`.
+ Generate
    + This tile is will trigger new sections of the map to be generated when stood on.
    + The ID is always `1`.
+ Death
    + This tile will kill any player that steps on it.
    + The ID is always `2`.
+ Damage
    + This tile will damage any player that steps on it.
    + The ID is always `3`.
+ Chest
    + This tile will contain a chest that will have some sort of item.
    + The ID is always `4`.

+ Foliage
    + This tile will contain some sort of foliage
    + The ID will range:
        + Core IDs `[5 - 8]`
        + If you use additional tile pack then seek their documentation
        
+ Water
    + This tile will contain some sort of water (lake, ocean, pond, etc...)
    + The ID will range:
        + Core IDs `[9 - 12]`
        + If you use additional tile pack then seek their documentation

+ Terrain
    + This tile will contain some sort of terrain
    + The ID will range:
        + Core IDs `[13 - 16]`
        + If you use additional tile pack then seek their documentation