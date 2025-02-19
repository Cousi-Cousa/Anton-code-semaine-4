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
        this.load.audio('clickSound', './Sounds/retro-click-236673.mp3');
    }

    create() {
        // Background 
        this.add.image(955, 537.5, 'background').setScale(1);

        if (isAudioOn && backgroundMusic && backgroundMusic.isPaused) {
            backgroundMusic.resume();
        } else if (isAudioOn && !backgroundMusic) {
            backgroundMusic = this.sound.add('menuMusic', { volume: 0.5, loop: true });
            backgroundMusic.play();
        }

        // Back button
        const RetourBtn = this.add.image(710, 750, 'btnBack').setInteractive().setScale(1.3);
        RetourBtn.on('pointerover', () => RetourBtn.setTexture('btnBackDark'));
        RetourBtn.on('pointerout', () => RetourBtn.setTexture('btnBack'));
        RetourBtn.on('pointerdown', () => {
            if (isAudioOn) this.sound.play('clickSound');
            this.scene.start('Accueil');

        });
        this.tweens.add({
            targets: RetourBtn,
            y: 760,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Controls button
        const ControlesBtn = this.add.image(710, 600, 'btnKeys').setInteractive().setScale(1.3);
        ControlesBtn.on('pointerover', () => ControlesBtn.setTexture('btnKeysDark'));
        ControlesBtn.on('pointerout', () => ControlesBtn.setTexture('btnKeys'));
        ControlesBtn.on('pointerdown', () => {
            if (isAudioOn) this.sound.play('clickSound');
            this.scene.start('Controles');
        });

        // Audio button
        this.audioButton = this.add.image(710, 450, isAudioOn ? 'btnAudio' : 'btnAudioOff')
            .setInteractive()
            .setScale(1.3);

        // Toggle audio state
        this.audioButton.on('pointerdown', () => {
            isAudioOn = !isAudioOn;
            console.log("Audio State:", isAudioOn); // Debugging statement
            this.sound.mute = !isAudioOn;

            // Control background music based on audio state
            if (isAudioOn) {
                backgroundMusic.resume();
            } else {
                backgroundMusic.pause();
            }

            // Update button texture based on audio state
            this.audioButton.setTexture(isAudioOn ? 'btnAudio' : 'btnAudioOff');
        });
    }
}
