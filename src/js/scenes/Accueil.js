class Accueil extends Phaser.Scene {
    constructor() {
        super({ key: 'Accueil' });
    }

    preload() {
        this.load.image('background', './images/Background.png');
        this.load.image('logo', './images/logo.png');
        this.load.image('btnCommencer', './images/Start.png');
        this.load.image('btnCredits', './images/Credits.png');
        this.load.image('btnComment', './images/Settings.png');
        this.load.image('ScoreBtn', './images/Score.png');

        // Dark mode versions of each button
        this.load.image('btnCommencerDark', './images/Start_Dark.png');
        this.load.image('btnCreditsDark', './images/Credits_Dark.png');
        this.load.image('btnCommentDark', './images/Settings_Dark.png');
        this.load.image('ScoreBtnDark', './images/Score_Dark.png');

        //Sounds
        this.load.audio('clickSound', './Sounds/retro-click-236673.mp3');

        //Music

         this.load.audio('menuMusic', './Sounds/01 - Welcome To The Wild West.mp3');
    }

    // Click sound to any button
    addClickSound(button) {
        button.on('pointerdown', () => {
            this.sound.play('clickSound');
        });
    }

    create() {


        // background and logo
        this.add.image(710, 500, 'background').setScale(1);



        // Store the music instance globally
        this.registry.set('menuMusic', this.menuMusic);

        // Create the logo
        const logo = this.add.image(710, 200, 'logo').setScale(2);


        // Shine Effect to the logo
        const shineEffect = logo.postFX.addShine(1, 0.2, 5);

        this.tweens.add({
            targets: shineEffect,
            intensity: { from: 0.2, to: 0.8 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Animation to the logo
        this.tweens.add({
            targets: logo,
            y: 220,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Commencer button with hover effect
        const commencerBtn = this.add.image(710, 350, 'btnCommencer').setInteractive().setScale(1.3);
        commencerBtn.on('pointerover', () => commencerBtn.setTexture('btnCommencerDark'));
        commencerBtn.on('pointerout', () => commencerBtn.setTexture('btnCommencer'));
        commencerBtn.on('pointerdown', () => this.scene.start('Jeu'));
        this.tweens.add({
            targets: commencerBtn,
            y: 360,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });



        // Crédit button with hover effect
        const creditBtn = this.add.image(710, 500, 'btnCredits').setInteractive().setScale(1.3);
        creditBtn.on('pointerover', () => creditBtn.setTexture('btnCreditsDark'));
        creditBtn.on('pointerout', () => creditBtn.setTexture('btnCredits'));
        creditBtn.on('pointerdown', () => this.scene.start('Credit'));


        // Comment jouer? button with hover effect
        const commentBtn = this.add.image(710, 650, 'btnComment').setInteractive().setScale(1.3);
        commentBtn.on('pointerover', () => commentBtn.setTexture('btnCommentDark'));
        commentBtn.on('pointerout', () => commentBtn.setTexture('btnComment'));
        commentBtn.on('pointerdown', () => this.scene.start('CommentJouer'));

        // Scores
        const ScoreBtn = this.add.image(710, 800, 'ScoreBtn').setInteractive().setScale(1.3);
        ScoreBtn.on('pointerover', () => ScoreBtn.setTexture('ScoreBtnDark'));
        ScoreBtn.on('pointerout', () => ScoreBtn.setTexture('ScoreBtn'));
        ScoreBtn.on('pointerdown', () => this.scene.start('HighScoresScene'));
        //CLICK SOUNDS
        this.addClickSound(commencerBtn);
        this.addClickSound(commentBtn);
        this.addClickSound(creditBtn);
        this.addClickSound(ScoreBtn);




        // Play background music
        if (!backgroundMusic) {
            backgroundMusic = this.sound.add('menuMusic', { volume: 0.5, loop: true });
            backgroundMusic.play();
        } else if (backgroundMusic.isPaused) {
            backgroundMusic.resume();
        }



    }

    formatTime(seconds) {
        seconds = seconds ?? 0;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}