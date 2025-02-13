const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1200,


  input: { gamepad: true }, // Enable gamepad support
  
  parent: 'gameContainer',
  scene: [Accueil, Jeu, CommentJouer, Controles, Credit, PartieTerminee, Victoire, HighScoresScene],
  audio: {
    disableWebAudio: false
  },
  pixelArt: true,
  physics: {
    default: "arcade",

    arcade: {
      debug: false
    }
  }

};



const game = new Phaser.Game(config);

// Global variable for the music
let backgroundMusic = null;
let gameMusic = null;
let isAudioOn = true;  

const sauvegarde = JSON.parse(localStorage.getItem('sauvegardeJeu'));

let scoreBoard = sauvegarde ? sauvegarde.highscore : [];


