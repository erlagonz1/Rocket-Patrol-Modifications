// Eric Gonzalez
// Rocket Patrol: Refined Edition
// Time spent on project (the mods): 4 hours
// Mods completed (with comments in the code too){
//     Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)
//     Implement a new timing/scoring mechanism that adds time to the clock for successful hits and subtracts time for misses (5)
//     Implement mouse control for player movement and left mouse click to fire (5)
//     Display the time remaining (in seconds) on the screen (3)
//     Allow the player to control the Rocket after it's fired (1)
//     Track a high score that persists across scenes and display it in the UI (1)

//     Total: 20 points
// }
// No citations needed, except for the 'speedship' png, which i got from using a pixel editor to modify our spaceship.png from the professor

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config)

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

// left click boolean
let click = false

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT

// subtraction variable for time when rocket misses
let miss = false

// high score tracker
let highScore = 0



