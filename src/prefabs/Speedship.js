class Speedship extends Spaceship {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame, pointValue)
        scene.add.existing(this)
        this.moveSpeed = game.settings.spaceshipSpeed + 2
    }

    update() {
        // move spaceship left
        this.x -= this.moveSpeed

        // wrap from left to right edge
        if(this.x <= 0 - this.width) {
            this.x = game.config.width
        }
    }

    reset() {
        this.x = game.config.width
    }
}