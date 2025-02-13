class PartieTerminee extends Phaser.Scene {
  constructor() {
    super({ key: "PartieTerminee" });
    this.score = [{ name: "fkermf", score: 88 }];
  }

  preload() {
    this.load.image("background", "./images/Background.png");
    this.load.image("btnBack", "./images/Back  col_Button.png");
    this.load.image("btnBackDark", "./images/Back  col_Button_Dark.png");
    this.load.image("btnRestart", "./images/Restart.png");
    this.load.image("btnRestartDark", "./images/Restart_Dark.png");

    //Sound
    this.load.audio(
      "gameOverSound",
      "./Sounds/8-bit-video-game-fail-version-2-145478.mp3"
    );
  }

  create(data) {
    // Play the game over sound effect once when the scene starts with a reduced volume
    if (isAudioOn) {
      this.sound.play("gameOverSound", { volume: 0.3 }); // Adjusted volume to 30%
    }

    // Log the received data to ensure it’s correct
    console.log("Received Score:", data.score);
    console.log("Received Temps:", data.time);

    const obj = {
      score: data.score,
      time: data.time,
    };
    scoreBoard.push(obj);
    localStorage.setItem('sauvegardeJeu', JSON.stringify({ highscore: scoreBoard }));

    console.log(scoreBoard);

    // background and logo
    this.add.image(710, 500, "background").setScale(1);

    // Display final score and time
    this.add
      .text(710, 200, `Score: ${data.score}`, {
        fontSize: "32px",
        fill: "#896193",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const formattedTime = this.formatTime(data.time);
    this.add
      .text(710, 250, `Temps: ${formattedTime}`, {
        fontSize: "32px",
        fill: "#896193",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Commencer button with hover effect
    const commencerBtn = this.add
      .image(710, 450, "btnRestart")
      .setInteractive()
      .setScale(1.3);
    commencerBtn.on("pointerover", () =>
      commencerBtn.setTexture("btnRestartDark")
    );
    commencerBtn.on("pointerout", () => commencerBtn.setTexture("btnRestart"));
    commencerBtn.on("pointerdown", () => this.scene.start("Jeu"));
    this.tweens.add({
      targets: commencerBtn,
      y: 460,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Commencer button with hover effect
    const retourBtn = this.add
      .image(710, 600, "btnBack")
      .setInteractive()
      .setScale(1.3);
    retourBtn.on("pointerover", () => retourBtn.setTexture("btnBackDark"));
    retourBtn.on("pointerout", () => retourBtn.setTexture("btnBack"));
    retourBtn.on("pointerdown", () => this.scene.start("Accueil"));
  }

  // Helper function to format time as MM:SS
  formatTime(seconds) {
    seconds = seconds ?? 0;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }
}
