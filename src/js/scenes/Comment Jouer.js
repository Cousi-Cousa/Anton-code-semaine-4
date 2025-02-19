class CommentJouer extends Phaser.Scene {
    constructor() {
        super({ key: 'CommentJouer' });
    }

    preload() {
        this.load.image('btnAudio', './images/Audio_Dark.png');
        this.load.image('btnAudioOff', './images/Audio_Off_Dark.png');
        this.load.image('btnBack', './images/Back  col_Button.png');
        this.load.image('btnBackDark', './images/Back  col_Button_Dark.png');
        this.load.image('btnKeys', './images/Keys.png');
        this.load.image('btnKeysDark', './images/Keys_Dark.png');
// Sounds
this.load.audio('clickSound', './Sounds/retro-click-236673.mp3');
        this.load.image('texteDebut', './images/texte_debut 1.png');
    }

    create() {
        // Background 
        this.add.image(955, 537.5, 'background').setScale(1);
    
        // Display the "texte_debut" image
        this.add.image(955, 540, 'texteDebut').setScale(1);
    
        if (isAudioOn && backgroundMusic && backgroundMusic.isPaused) {
            backgroundMusic.resume();
        } else if (isAudioOn && !backgroundMusic) {
            backgroundMusic = this.sound.add('menuMusic', { volume: 0.5, loop: true });
            backgroundMusic.play();
        }
        
        // Play button with hover effect
        const commencerBtn = this.add.image(955, 850, 'btnCommencer').setInteractive().setScale(1.3);
        commencerBtn.on('pointerover', () => commencerBtn.setTexture('btnCommencerDark'));
        commencerBtn.on('pointerout', () => commencerBtn.setTexture('btnCommencer'));
        commencerBtn.on('pointerdown', () => this.scene.start('Jeu'));
        
        this.tweens.add({
            targets: commencerBtn,
            y: 860,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    


        this.cameras.main.fadeIn(1000); // 500ms fade-in effect

        // ----------------- 🎮 GAMEPAD SUPPORT -----------------
        this.input.gamepad.once('connected', (pad) => {
            this.pad = pad;
        });
    
        this.input.gamepad.on('down', (pad, button) => {
            if (button.index === 1) { // Button 1 (B on Xbox / Circle on PS)
                console.log("✅ Gamepad button 1 pressed - Starting game!");
                this.sound.play('clickSound'); // Play click sound

                // Fade out and change scene after delay
                this.cameras.main.fadeOut(1000);
                this.time.delayedCall(1000, () => {
                    this.scene.start("Jeu");
                });
                        
               }
            });
    }
} 