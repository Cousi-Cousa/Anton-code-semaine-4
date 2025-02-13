class Controles extends Phaser.Scene {
    constructor() {
        super({ key: 'Controles' });
    }

    preload() {
        this.load.image('background', './images/Background.png')
        this.load.image('btnBack', './images/Back  col_Button.png');
        this.load.image('btnBackDark', './images/Back  col_Button_Dark.png');
        this.load.image('Exp', './images/Exp.png');
    }

    // Helper function to add click sound to any button
    addClickSound(button) {
        button.on('pointerdown', () => {
            this.sound.play('clickSound');
        });
    }

    create() {
        // Add background if necessary
        this.add.image(710, 500, 'background').setScale(1);
        this.add.image(710, 400, 'Exp').setScale(1);

        // If backgroundMusic exists and is paused, resume it
        if (backgroundMusic && backgroundMusic.isPaused) {
            backgroundMusic.resume();
        } else if (!backgroundMusic) {
            // Create and play backgroundMusic only if it does not already exist
            backgroundMusic = this.sound.add('menuMusic', {
                volume: 0.5,
                loop: true
            });
            backgroundMusic.play();
        }

        const RetourBtn = this.add.image(710, 750, 'btnBack').setInteractive().setScale(1.3);
        RetourBtn.on('pointerover', () => RetourBtn.setTexture('btnBackDark'));
        RetourBtn.on('pointerout', () => RetourBtn.setTexture('btnBack'));
        RetourBtn.on('pointerdown', () => this.scene.start('CommentJouer'));
        this.tweens.add({
            targets: RetourBtn,
            y: 760,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.addClickSound(RetourBtn);
    }
}