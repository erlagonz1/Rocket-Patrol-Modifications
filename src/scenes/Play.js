class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)
        
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0)

        // add special speedship
        this.ship04 = new Speedship(this, game.config.width + borderUISize*3, borderUISize*7 + borderPadding*5, 'speedship', 0, 75).setOrigin(0,0).setScale(0.75)

        // define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        //initialize score
        this.p1Score = 0

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig)


        // GAME OVER flag
        this.gameOver = false


        //display time
        this.initialTime = game.settings.gameTimer/1000

        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.timeLeft = this.add.text(borderUISize * 6, borderUISize + borderPadding*2, this.initialTime, timeConfig)
        this.updateTime = this.time.addEvent({
            delay: 1000,
            callback: this.subTime,
            callbackScope: this,
            loop: true,
        })
    }

    update() {
        //handle time subtraction if rocket missed
        if(miss) {
            this.initialTime -= 4
            miss = false
        }

        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart()
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene")
        }

        this.starfield.tilePositionX -= 4

        //implement mouse input, it needs to be in this scene to use this.input.x
        if(this.input.x <= this.p1Rocket.x && this.input.x >= borderUISize) {
            keyLEFT.isDown = true
        }
        
        if(this.input.x > this.p1Rocket.x && this.input.x <= game.config.width - borderUISize) {
            keyRIGHT.isDown = true
        }

        //implement mouse click to fire
        this.input.on('pointerdown', this.clicked)
        

        if(!this.gameOver) {               
            this.p1Rocket.update()         // update rocket sprite
            this.ship01.update()           // update spaceships (x3)
            this.ship02.update()
            this.ship03.update()
            this.ship04.update()
        } 

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship04)
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
        }

        //redeclaring time formatting
        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.timeLeft.setText(this.initialTime)

        //check if game is over
        if (this.initialTime <= 0){
            this.initialTime = 0
        }
        
        if(this.initialTime == 0) {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', timeConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', timeConfig).setOrigin(0.5)
            this.gameOver = true
        }

        //reset keyLEFT, keyRIGHT and click booleans
        keyLEFT.isDown = false
        keyRIGHT.isDown = false
        click = false
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y) {
            return true
          } else {
            return false
          }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0
        
        //failed particle emitter attempt
        // let particles = this.add.particles('explosion')
        // let emitter = particles.createEmitter()
        // emitter.setPosition(ship.x, ship.y)
        // emitter.setSpeed(200)
        // emitter.setBlendMode(Phaser.setBlendModes.ADD)

        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode')             // play explode animation
        boom.on('animationcomplete', () => {   // callback after anim completes
          ship.reset()                         // reset ship position
          ship.alpha = 1                       // make ship visible again
          boom.destroy()                       // remove explosion sprite
        })

        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score
        this.sound.play('sfx-explosion')

        //add time when we land a hit
        this.initialTime += 4
      }

      subTime() {
        this.initialTime -= 1
      }

      clicked() {
        click = true
      }
}