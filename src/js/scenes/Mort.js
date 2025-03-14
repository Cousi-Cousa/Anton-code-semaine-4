class Mort extends Phaser.Scene {
    constructor() {
        super({ key: 'Mort' });
    }

    preload() {
        this.load.image("deathBanner", "./images/mort.png");
        this.load.image("deathBanner2", "./images/revenir_mort.png");

    }

    create() {
        

        this.cameras.main.fadeIn(2000); // 500ms fade-in effect

        this.add.image(960, 540, 'deathBanner').setScale(1.3);
        this.add.image(960, 840, 'deathBanner2').setScale(1.3);

        // Delay before switching to Accueil scene


            // Listen for gamepad connection
    this.input.gamepad.once('connected', (pad) => {
        this.pad = pad;
    });



    // Check gamepad input in update loop
    this.input.gamepad.on('down', (pad, button) => {
        if (button.index === 1) { // Button 1 (B on Xbox / Circle on PS)
            console.log("✅ Gamepad button 1 pressed - Starting game!");
            this.sound.play('clickSound'); // Play click sound

        // Fade out and change scene after delay
        this.cameras.main.fadeOut(1000);
        this.time.delayedCall(1000, () => {
            this.scene.start("Accueil");
        });
            
        }
    });
    }
}