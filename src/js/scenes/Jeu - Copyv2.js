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
    // Load Background Layers
    for (let i = 1; i <= 12; i++) {
      this.load.image(`bg${i}`, `./sprites/background/${i}.png`);
    }

    // Load Tilemap and Tilesets
    this.load.tilemapTiledJSON("map", "./maps/test1.json");
    this.load.image("Tileset", "./sprites/Tileset.png");
    this.load.image("platforms", "./sprites/platforms.png");

    // Load Fruit Spritesheet
    this.load.spritesheet("fruitSheet", "./sprites/fruit.png", { frameWidth: 16, frameHeight: 16 });

    // Load Player Spritesheets
    this.load.spritesheet("player_idle", "./player_spritesheet/_Idle.png", { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet("player_run", "./player_spritesheet/_Run.png", { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet("player_jump", "./player_spritesheet/_Jump.png", { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet("player_fall", "./player_spritesheet/_Fall.png", { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet("player_jump_fall_inbetween", "./player_spritesheet/_JumpFallInbetween.png", {frameWidth: 120,frameHeight: 80});
    this.load.spritesheet("player_turnaround", "./player_spritesheet/_TurnAround.png", { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet("player_attack", "./player_spritesheet/_Attack.png", { frameWidth: 120, frameHeight: 80 });
    
    // Load enemy spritesheets
    this.load.spritesheet("enemy_idle", "./sprites/Mushroom-Idle.png", {
      frameWidth: 80,
      frameHeight: 64
  });
    
  // Load enemy spritesheets
  this.load.spritesheet("enemy_run", "./sprites/Mushroom-Run.png", {
    frameWidth: 80,
    frameHeight: 64
});
  
  }

  create() {
    // Debugging (Hidden by Default)
    this.debugGraphics = this.add.graphics().setVisible(false);
    this.physics.world.createDebugGraphic().setVisible(false);

    // Load Tilemap
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("Tileset", "Tileset");
    const platformTileset = map.addTilesetImage("platforms", "platforms");
    map.createLayer("sky", tileset, 0, 0);
    const landLayer = map.createLayer("land", tileset, 0, 0);
    const platformsLayer = map.createLayer("platforms", platformTileset, 0, 0);

    // Enable Collision for Platforms
    landLayer.setCollisionByProperty({ collides: true });
    platformsLayer.setCollisionByProperty({ collides: true });

    // Set World and Camera Bounds
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);    

    // Create the Player
    this.player = this.physics.add.sprite(100, 300, "player_idle");
    this.player.setBounce(0.1).setCollideWorldBounds(true).setGravityY(800).setSize(30, 40).setOffset(40, 40);
    this.physics.add.collider(this.player, platformsLayer);
    this.physics.add.collider(this.player, landLayer);
    
    // Create an enemy group
    this.enemies = this.physics.add.group();
    
    // Enemy animations
    this.anims.create({
      key: "enemy_idle",
      frames: this.anims.generateFrameNumbers("enemy_idle", { start: 0, end: 6 }),
      frameRate: 6,
      repeat: -1
  });
  this.anims.create({
    key: "enemy_run",
    frames: this.anims.generateFrameNumbers("enemy_run", { start: 0, end: 7 }),
    frameRate: 8,
    repeat: -1
  });

    // Load enemies from Tiled object layer
    const enemySpawn = map.getObjectLayer("enemy"); // Make sure the layer is named "enemy" in Tiled
    enemySpawn.objects.forEach(obj => {
        let enemy = this.enemies.create(obj.x, obj.y, "enemy_idle");
        enemy.setCollideWorldBounds(true);
        enemy.setGravityY(800); // Apply gravity so it stands on platforms
        enemy.setSize(32, 48).setOffset(16, 16); // Adjust hitbox if needed
        enemy.play("enemy_idle"); // Play idle animation
    });
    
    // Enable collision with platforms
    this.physics.add.collider(this.enemies, landLayer);
    this.physics.add.collider(this.enemies, platformsLayer);
    
    // this.enemy.play("enemy_idle");
    
    // Create Player Animations
    this.anims.create({ key: "idle", frames: this.anims.generateFrameNumbers("player_idle", { start: 0, end: 9 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "run", frames: this.anims.generateFrameNumbers("player_run", { start: 0, end: 9 }), frameRate: 12, repeat: -1 });
    this.anims.create({ key: "jump", frames: this.anims.generateFrameNumbers("player_jump", { start: 0, end: 2 }), frameRate: 6, repeat: 0 });
    this.anims.create({ key: "fall", frames: this.anims.generateFrameNumbers("player_fall", { start: 0, end: 2 }), frameRate: 6, repeat: -1 });
    this.anims.create({ key: "jump_fall_transition", frames: this.anims.generateFrameNumbers("player_jump_fall_inbetween", { start: 0, end: 1 }), frameRate: 6, repeat: 0 });
    this.anims.create({ key: "turnaround", frames: this.anims.generateFrameNumbers("player_turnaround", { start: 0, end: 2 }), frameRate: 20, repeat: 0 });
    this.anims.create({ key: "attack", frames: this.anims.generateFrameNumbers("player_attack", { start: 0, end: 3 }), frameRate: 10, repeat: 0 });
    this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.player.play("idle");
    
    // Define Input Keys
    this.cursors = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      attack: Phaser.Input.Keyboard.KeyCodes.E
    });

    // Create Items Group
    this.items = this.physics.add.group();
    const itemsLayer = map.getObjectLayer("items");
    itemsLayer.objects.forEach(obj => {
      const item = this.items.create(obj.x, obj.y - 16, "fruitSheet", obj.type === "banana" ? 1 : 0);
      item.setOrigin(0, 0).body.setAllowGravity(false);
    });
    this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);
        
    // Set Camera to Follow Player
    this.cameras.main.setZoom(3).startFollow(this.player, true, 0.05, 0.05);
    
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
  
   // Set Debug Graphics Depth
   this.debugGraphics.setDepth(15);
  }

  collectItem(player, item) {
    item.destroy();
    this.score += 10;
    console.log("Item collected! Score:", this.score);
  }

  update() {
    this.enemies.children.iterate((enemy) => {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y) < 100) {
          // Move towards the player
          if (this.player.x < enemy.x) {
              enemy.setVelocityX(-50); // Move left
              enemy.flipX = false; // Face left
          } else {
              enemy.setVelocityX(50); // Move right
              enemy.flipX = true; // Face right
          }
          enemy.play("enemy_run", true);
      } else {
          enemy.setVelocityX(0);
          enemy.play("enemy_idle", true);
      }
  });
  
    
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
      this.player.setVelocityY(-300);
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