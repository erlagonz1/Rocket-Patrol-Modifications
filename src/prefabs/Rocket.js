class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        // add object to existing scene
        scene.add.existing(this)
        this.isFiring = false
        this.moveSpeed = 2

        this.sfxShot = scene.sound.add('sfx-shot')
    }

    update() {
        // keyboard left/right movement
        //if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed
            } else if(keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed
            }
        //}

        // fire button
        if (click == true && !this.isFiring || Phaser.Input.Keyboard.JustDown(keyFIRE) && !this.isFiring) {
        this.isFiring = true
        this.sfxShot.play()
  }

        // if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed
        }

        // reset on miss
        if(this.y <= borderUISize *3 + borderPadding) {
            this.isFiring = false
            this.y = game.config.height - borderUISize - borderPadding
            miss = true
        }
        
    }

    reset() {
        this.isFiring = false
        this.y = game.config.height - borderUISize - borderPadding
    }
}