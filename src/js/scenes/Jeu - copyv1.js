class Jeu extends Phaser.Scene {
  constructor() {
    super({ key: "Jeu" });
    this.isFiring = false;
    this.playerHealth = 5;
    this.isPlayerHit = false;
    this.elapsedTime = 0;
    this.score = 0;
    this.isAttacking = false;
    this.isTurning = false;
    this.lastDirection = "right";
  }

  preload() {
    this.load.image("bg1", "./sprites/background/1.png");
    this.load.image("bg2", "./sprites/background/2.png");
    this.load.image("bg3", "./sprites/background/3.png");
    this.load.image("bg4", "./sprites/background/4.png");
    this.load.image("bg5", "./sprites/background/5.png");
    this.load.image("bg6", "./sprites/background/6.png");
    this.load.image("bg7", "./sprites/background/7.png");
    this.load.image("bg8", "./sprites/background/8.png");
    this.load.image("bg9", "./sprites/background/9.png");
    this.load.image("bg10", "./sprites/background/10.png");
    this.load.image("bg11", "./sprites/background/11.png");
    this.load.image("bg12", "./sprites/background/12.png");

    this.load.tilemapTiledJSON("map", "./maps/test1.json");
    this.load.image("Tileset", "./sprites/Tileset.png");
    this.load.image("platforms", "./sprites/platforms.png");

    this.load.spritesheet("fruitSheet", "./sprites/fruit.png", {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet("player_idle", "./player_spritesheet/_Idle.png", { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet("player_run", "./player_spritesheet/_Run.png", { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet("player_jump", "./player_spritesheet/_Jump.png", { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet("player_fall", "./player_spritesheet/_Fall.png", { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet("player_jump_fall_inbetween", "./player_spritesheet/_JumpFallInbetween.png", {frameWidth: 120,frameHeight: 80});
    this.load.spritesheet("player_turnaround", "./player_spritesheet/_TurnAround.png", { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet("player_attack", "./player_spritesheet/_Attack.png", { frameWidth: 120, frameHeight: 80 });

  }

  create() {
    console.log("Attempting to load: ", this.load.path);

    // Enable debug mode for physics bodies
    this.debugGraphics = this.add.graphics().setVisible(false); // 🔹 Keeps debug active but invisible
    this.physics.world.createDebugGraphic().setVisible(false);

    // Load the tilemap
    const map = this.make.tilemap({
      key: "map"
    });

    // Set camera bounds
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Add tilesets (matching Tiled names)
    const tileset = map.addTilesetImage("Tileset", "Tileset");
    const platformTileset = map.addTilesetImage("platforms", "platforms");

    // Create tile layers
    map.createLayer("sky", tileset, 0, 0);
    const landLayer = map.createLayer("land", tileset, 0, 0);
    const platformsLayer = map.createLayer("platforms", platformTileset, 0, 0);

    // Set the world bounds to match the map
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Enable collision for platforms
    landLayer.setCollisionByProperty({
      collides: true
    });
    platformsLayer.setCollisionByProperty({
      collides: true
    });

    

        // Create the player
        this.player = this.physics.add.sprite(100, 300, "player_idle");
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(800);
        this.player.setSize(30, 40).setOffset(40, 40);
        this.physics.add.collider(this.player, platformsLayer);

        this.anims.create({ key: "idle", frames: this.anims.generateFrameNumbers("player_idle", { start: 0, end: 9 }), frameRate: 8, repeat: -1 });
        this.player.play("idle"); // Start idle animation
        this.anims.create({ key: "run", frames: this.anims.generateFrameNumbers("player_run", { start: 0, end: 9 }), frameRate: 12, repeat: -1 });
        this.anims.create({ key: "jump", frames: this.anims.generateFrameNumbers("player_jump", { start: 0, end: 2 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: "jump_fall_transition", frames: this.anims.generateFrameNumbers("player_jump_fall_inbetween", { start: 0, end: 1 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: "fall", frames: this.anims.generateFrameNumbers("player_fall", { start: 0, end: 2 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: "attack", frames: this.anims.generateFrameNumbers("player_attack", { start: 0, end: 3 }), frameRate: 10, repeat: 0 });
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.anims.create({ key: "turnaround", frames: this.anims.generateFrameNumbers("player_turnaround", { start: 0, end: 2 }), rameRate: 10, repeat: 0 });

this.lastDirection = "right"; // Default direction
this.isTurning = false;


    // Enable collision with platforms
    this.physics.add.collider(this.player, landLayer);
    this.physics.add.collider(this.player, platformsLayer);


    // Create Items Group
    this.items = this.physics.add.group();

    // Parse the 'items' object layer
    const itemsLayer = map.getObjectLayer("items");
    itemsLayer.objects.forEach((obj) => {
      const {
        x,
        y,
        type
      } = obj;
      let frame;
      switch (type) {
        case "apple":
          frame = 0;
          break;
        case "banana":
          frame = 1;
          break;
          // Add cases for other item types as needed
        default:
          frame = 0;
      }
      const item = this.items.create(x, y - 16, "fruitSheet", frame);
      item.setOrigin(0, 0);
      item.body.setAllowGravity(false);
    });

    // Add overlap between player and items
    this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);

    // **🔥 Camera Follow Player Immediately**
    this.cameras.main.setZoom(3);
    this.cameras.main.centerOn(this.player.x, this.player.y);
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

        // Define input keys
        this.cursors = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
            attack: Phaser.Input.Keyboard.KeyCodes.E
        });

    

// Create background layers with lower depth (behind everything)
this.bg1 = this.add.image(0, 0, "bg1").setOrigin(0, 0).setDepth(-10);
this.bg2 = this.add.image(0, 0, "bg2").setOrigin(0, 0).setDepth(-9);
this.bg3 = this.add.image(0, 0, "bg3").setOrigin(0, 0).setDepth(-8);
this.bg4 = this.add.image(0, 0, "bg4").setOrigin(0, 0).setDepth(-7);
this.bg5 = this.add.image(0, 0, "bg5").setOrigin(0, 0).setDepth(-6);
this.bg6 = this.add.image(0, 0, "bg6").setOrigin(0, 0).setDepth(-5);
this.bg7 = this.add.image(0, 0, "bg7").setOrigin(0, 0).setDepth(-4);
this.bg8 = this.add.image(0, 0, "bg8").setOrigin(0, 0).setDepth(-3);
this.bg9 = this.add.image(0, 0, "bg9").setOrigin(0, 0).setDepth(-2);
this.bg10 = this.add.image(0, 0, "bg10").setOrigin(0, 0).setDepth(-1);
this.bg11 = this.add.image(0, 0, "bg11").setOrigin(0, 0).setDepth(0);
this.bg12 = this.add.image(100, 0, "bg12").setOrigin(0, 0).setDepth(1);


// Adjusting Y positions of background layers to move them higher
this.bg1.setPosition(0, -100);
this.bg2.setPosition(0, -100);
this.bg3.setPosition(0, -100);
this.bg4.setPosition(0, -100);
this.bg5.setPosition(0, -100);
this.bg6.setPosition(0, -100);
this.bg7.setPosition(0, -100);
this.bg8.setPosition(0, -100);
this.bg9.setPosition(0, -100);
this.bg10.setPosition(0, -100);
this.bg11.setPosition(0, -100);
this.bg12.setPosition(0, -100);



 
     // Add parallax scrolling
     this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
 
     // Attach backgrounds to camera movement
     this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

     

     this.debugGraphics.setDepth(15);

  }

  collectItem(player, item) {
    item.destroy();
    this.score += 10;
    console.log("Item collected! Score:", this.score);
  }

  update() {
    let cameraX = this.cameras.main.scrollX;
    let cameraY = this.cameras.main.scrollY;

    // Adjust background movement based on player position (slower layers for depth effect)
    this.bg1.x = this.cameras.main.scrollX * 0.09;
    this.bg2.x = this.cameras.main.scrollX * 0.1;
    this.bg3.x = this.cameras.main.scrollX * 0.11;
    this.bg4.x = this.cameras.main.scrollX * 0.12;
    this.bg5.x = this.cameras.main.scrollX * 0.13;
    this.bg6.x = this.cameras.main.scrollX * 0.14;
    this.bg7.x = this.cameras.main.scrollX * 0.1;
    this.bg8.x = this.cameras.main.scrollX * 0.16;
    this.bg9.x = this.cameras.main.scrollX * 0.17;
    this.bg10.x = this.cameras.main.scrollX * 0.18;
    this.bg11.x = this.cameras.main.scrollX * 0.05;
    this.bg12.x = this.cameras.main.scrollX * 0.05;

    // **Prevent animation overriding while attacking**
    if (this.isAttacking) return;

 // **Handle attack input**
    if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
        this.isAttacking = true; // Set attack flag
        this.player.play("attack", true);
        this.player.setVelocityX(0); // Stop movement during attack

        // **Wait until animation completes before resuming movement**
        this.player.once("animationcomplete", () => {
            this.isAttacking = false; // Reset attack flag
            this.player.play("idle", true); // Go back to idle
        });
        return; // Exit update loop to prevent animation override
    }

    let movingLeft = this.cursors.left.isDown;
    let movingRight = this.cursors.right.isDown;

// Handle turnaround animation
if ((movingLeft && this.lastDirection === "right") || (movingRight && this.lastDirection === "left")) {
  this.isTurning = true;
  this.player.setVelocityX(0);
  this.player.play("turnaround", true);
  this.player.once("animationcomplete", () => {
      this.isTurning = false;
      this.lastDirection = movingLeft ? "left" : "right";
  });
  return;
}



        // Handle movement
        if (movingLeft) {
          this.player.setVelocityX(-120);
          this.player.flipX = true;
          this.player.play("run", true);
          this.lastDirection = "left";
      } else if (movingRight) {
          this.player.setVelocityX(120);
          this.player.flipX = false;
          this.player.play("run", true);
          this.lastDirection = "right";
      } else {
          this.player.setVelocityX(0);
          if (this.player.body.blocked.down) this.player.play("idle", true);
      }
  
    // Jumping logic
    if (this.cursors.jump.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-350);
      this.player.play("jump", true);
  }

  // Attack logic (prevent overriding)
  if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
      this.player.play("attack", true);
      this.player.setVelocityX(0); // Stop player movement during attack

      // **Wait until the animation finishes before allowing movement again**
      this.player.once("animationcomplete", () => {
          this.player.play("idle", true); // Return to idle after attack
      });
  }
  
    // **Falling Logic**
    if (this.player.body.velocity.y > 200) { // Adjust threshold
      this.player.play("fall", true);
    }
    // **In-Between Jump/Fall Logic**
    if (this.player.body.velocity.y > 0 && this.player.body.velocity.y < 200) {
      this.player.play("jump_fall_transition", true);
    }
  }

}