class Victoire extends Phaser.Scene {
    constructor() {
        super({ key: 'Victoire' });
    }

    preload() {
        this.load.image("victoryBanner", "./images/victoire.png");
        this.load.image("victoryBanner2", "./images/revenir_victoire.png");

        this.load.audio('clickSound', './Sounds/interaction_menu/interaction.wav')
    }

    create() {
        this.clickSound = this.sound.add('clickSound');


        this.cameras.main.setBackgroundColor('#FAF0E7');
        

        this.cameras.main.fadeIn(2000); // 500ms fade-in effect

        this.add.image(960, 540, 'victoryBanner').setScale(1.3);
        this.add.image(960, 840, 'victoryBanner2').setScale(1.3);

        // Delay before switching to Accueil scene


            // Listen for gamepad connection
    this.input.gamepad.once('connected', (pad) => {
        this.pad = pad;
    });



    // Check gamepad input in update loop
    this.input.gamepad.on('down', (pad, button) => {
        if (button.index === 1) { // Button 1 (B on Xbox / Circle on PS)
            console.log("✅ Gamepad button 1 pressed - Starting game!");
            this.clickSound.play({
                volume: 0.2,
                loop: false
            });

        // Fade out and change scene after delay
        this.cameras.main.fadeOut(1000);
        this.time.delayedCall(1000, () => {
            this.scene.start("Accueil");
        });
            
        }
    });
    }

    
}
