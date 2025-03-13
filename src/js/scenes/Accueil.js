let menuMusic;

class Accueil extends Phaser.Scene {
    constructor() {
        super({ key: 'Accueil' });
    }

    preload() {
        this.load.image('background', './images/menu.jpg');
        this.load.image('logo', './images/logo2.png');
        this.load.image('btnCommencer', './images/commencer.png');

        // Sounds
        this.load.audio('clickSound', './Sounds/interaction_menu/interaction.wav');

        // Music
        this.load.audio('menuMusic', './Sounds/musique_menu.wav');
    }

    // Click sound to any button
    addClickSound(button) {
        button.on('pointerdown', () => {
            this.sound.play('clickSound');
        });
    }

    create() {

        this.clickSound = this.sound.add('clickSound');
        
        // Background and logo
        this.add.image(955, 537.5, 'background').setScale(1);
        
        // Store the music instance globally
        this.registry.set('menuMusic', this.menuMusic);

        

        // Create the logo
        const logo = this.add.image(955, 270, 'logo').setScale(0.13);

        // Shine effect on the logo
        const shineEffect = logo.postFX.addShine(1, 0.2, 5);
        this.tweens.add({
            targets: shineEffect,
            intensity: { from: 0.2, to: 0.8 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Animation on the logo
        this.tweens.add({
            targets: logo,
            y: 290,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Play button with hover effect
        const commencerBtn = this.add.image(955, 590, 'btnCommencer').setInteractive().setScale(1.1);
        commencerBtn.on('pointerover', () => commencerBtn.setTexture('btnCommencer'));
        commencerBtn.on('pointerout', () => commencerBtn.setTexture('btnCommencer'));
        commencerBtn.on('pointerdown', () => this.scene.start('Jeu')); // Go to the new intermediate scene first
        this.tweens.add({
            targets: commencerBtn,
            y: 580,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Click sound for the Play button
        this.addClickSound(commencerBtn);

        // Play background music
        if (!backgroundMusic) {
            backgroundMusic = this.sound.add('menuMusic', { volume: 0.02, loop: true });
            backgroundMusic.play();
        } else if (backgroundMusic.isPaused) {
            backgroundMusic.resume();
        }

        

        this.cameras.main.fadeIn(1000); // 500ms fade-in effect
        
        // ----------------- 🎮 GAMEPAD SUPPORT -----------------


    // Listen for gamepad connection
    this.input.gamepad.once('connected', (pad) => {
        this.pad = pad;
    });



    // Check gamepad input in update loop
    this.input.gamepad.on('down', (pad, button) => {
        if (button.index === 1) { // Button 1 (B on Xbox / Circle on PS)
            console.log("✅ Gamepad button 1 pressed - Starting game!")
            this.clickSound.play({
                volume: 0.2,
                loop: false
            });

        // Fade out and change scene after delay
        this.cameras.main.fadeOut(1000);
        this.time.delayedCall(1000, () => {
            this.scene.start("Jeu");
            this.backgroundMusic.stop();
        });
            
        }
    });

   }

}
