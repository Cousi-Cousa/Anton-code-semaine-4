class HighScoresScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HighScoresScene' });
    }

    preload() {
        this.load.image('background', './images/Background.png');
        this.load.image('btnBack', './images/Back  col_Button.png');
        this.load.image('btnBackDark', './images/Back  col_Button_Dark.png');
        this.load.image('Score_Text', './images/Score_Text.png');
    }

    addClickSound(button) {
        button.on('pointerdown', () => {
            this.sound.play('clickSound');
        });
    }

    create() {
        // Background
        this.add.image(710, 500, 'background').setScale(1);

        // Title Image
        this.add.image(710, 200, 'Score_Text').setScale(1.5).setOrigin(0.5);

        // Retrieve and sort the top 5 scores
        const sauvegarde = JSON.parse(localStorage.getItem('sauvegardeJeu'));
        const scoreBoard = sauvegarde ? sauvegarde.highscore : [];
        const topScores = scoreBoard
            .sort((a, b) => b.score - a.score) 
            .slice(0, 5);                

        console.log("Retrieved High Scores:", topScores); 

        // Display each top score or show a message if there are no scores
        if (topScores.length > 0) {
            topScores.forEach((entry, index) => {
                this.add.text(710, 300 + index * 80, `${index + 1}. Score: ${entry.score} - Temps: ${this.formatTime(entry.time)}`, {

                    fontSize: "24px",
                    fontStyle: "bold",
                    fill: '#ad7fba'

                }).setOrigin(0.5);
            });
        } else {
            // Display a message if no scores are available
            this.add.text(710, 450, 'No high scores yet!', {

                fontSize: "24px",
                fontStyle: "bold",
                fill: '#ad7fba'
            }).setOrigin(0.5);
        }

        // Back button to return to the main menu (Accueil)
        const RetourBtn = this.add.image(710, 750, 'btnBack').setInteractive().setScale(1.3);
        RetourBtn.on('pointerover', () => RetourBtn.setTexture('btnBackDark'));
        RetourBtn.on('pointerout', () => RetourBtn.setTexture('btnBack'));
        RetourBtn.on('pointerdown', () => this.scene.start('Accueil'));
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

    // Helper function to format time as MM:SS
    formatTime(seconds) {
        seconds = seconds ?? 0; 
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}