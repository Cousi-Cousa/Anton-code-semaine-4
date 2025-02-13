class Jeu extends Phaser.Scene {
    constructor() {
      super({ key: "Jeu" });
      this.isFiring = false;
      this.playerHealth = 5;
      this.isPlayerHit = false;
      this.isAttacking = false; // Prevents spam
      this.elapsedTime = 0;
      this.score = 0;
      this.isAttacking = false;
      this.isTurning = false;
      this.lastDirection = "right";
      this.canAttack = true; // Allow attacking at the start
  
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
      this.load.image("tileset_1", "./sprites/tileset_1.png");
      
          // Load Fruit Spritesheet
          this.load.spritesheet("fruitSheet", "./sprites/fruit.png", { frameWidth: 16, frameHeight: 16 });
          // Load potion Spritesheet
          this.load.spritesheet("potionsheet", "./sprites/potion.png", { frameWidth: 16, frameHeight: 16 });
  
          this.load.spritesheet("questItemSheet", "./sprites/quest.png", { frameWidth: 16, frameHeight: 16 });
  


          this.load.image("tileset_1", "./sprites/tileset_1.png"); // Update the path if needed


  
  
  
          
      // Load Player Spritesheets
      this.load.spritesheet("player_idle", "./player_spritesheet/chevalier_repos.png", { frameWidth: 120, frameHeight: 80 });
      this.load.spritesheet("player_run", "./player_spritesheet/_Run.png", { frameWidth: 120, frameHeight: 80 });
      this.load.spritesheet("player_jump", "./player_spritesheet/chevalier_saut.png", { frameWidth: 120, frameHeight: 80 });
      this.load.spritesheet("player_fall", "./player_spritesheet/chevalier_tombe.png", { frameWidth: 120, frameHeight: 80 });
      this.load.spritesheet("player_jump_fall_inbetween", "./player_spritesheet/chevalier_transition_saut.png", {frameWidth: 120,frameHeight: 80});
      this.load.spritesheet("player_turnaround", "./player_spritesheet/chevalier_tourne.png", { frameWidth: 120, frameHeight: 80 });
      this.load.spritesheet("player_attack", "./player_spritesheet/chevalier_attaque.png", { frameWidth: 120, frameHeight: 80 });
      this.load.spritesheet("player_hit", "./player_spritesheet/_Hit.png", { frameWidth: 120, frameHeight: 80 });
      this.load.spritesheet("player_death", "./player_spritesheet/_Death.png", { frameWidth: 120, frameHeight: 80 });
      // Load Enemy Spritesheets
      this.load.spritesheet("enemy_idle", "./sprites/Mushroom-Idle.png", { frameWidth: 80, frameHeight: 64 });
      this.load.spritesheet("enemy_run", "./sprites/Mushroom-Run.png", { frameWidth: 80, frameHeight: 64 });
      this.load.spritesheet("enemy_attack", "./sprites/Mushroom-AttackWithStun.png", { frameWidth: 80, frameHeight: 64 });
      this.load.spritesheet("enemy_death", "./sprites/Mushroom-Die.png", { frameWidth: 80, frameHeight: 64 });
      // 1. Preload Slime Spritesheets
      this.load.spritesheet("slime_jump_up", "./sprites/Sprite Sheet - Green Jump Up.png", { frameWidth: 96, frameHeight: 32 });
      this.load.spritesheet("slime_jump_down", "./sprites/Sprite Sheet - Green Jump Down.png", { frameWidth: 96, frameHeight: 32 });
      this.load.spritesheet("slime_jump_land", "./sprites/Sprite Sheet - Green Jump Land.png", { frameWidth: 96, frameHeight: 32 });
      this.load.spritesheet("slime_jump_start", "./sprites/Sprite Sheet - Green Jump Start-up.png", { frameWidth: 96, frameHeight: 32 });
      this.load.spritesheet("slime_jump_to_fall", "./sprites/Sprite Sheet - Green Jump to Fall.png", { frameWidth: 96, frameHeight: 32 });
      this.load.spritesheet("slime_idle", "./sprites/Sprite Sheet - Green Idle.png", { frameWidth: 96, frameHeight: 32 });
  
      // Music-Sounds
      this.load.audio("attackSound", "sounds/Attack.wav");
      this.load.audio("jumpSound", "sounds/Jump.wav"); 
      this.load.audio("landingSound", "sounds/Landing.wav"); 
      this.load.audio("potionSound", "sounds/FruitPickUp.wav"); 
      this.load.audio("damageSound", "sounds/Damage.wav"); 
      this.load.audio("questSound", "sounds/QuestPickUp.wav"); 
      this.load.audio("walkSound", "sounds/Walk.wav"); 



    
  
    }
  
  
    create() {
  
  
  
      
      // Debugging (Hidden by Default)
      this.debugGraphics = this.add.graphics().setVisible(true);
      this.physics.world.createDebugGraphic().setVisible(true);
  
// Load Tilemap
const map = this.make.tilemap({ key: "map" });

// Load both tilesets
const tileset = map.addTilesetImage("Tileset", "Tileset");

const tileset1 = map.addTilesetImage("tileset_1", "tileset_1"); // New tileset
const platformTileset = map.addTilesetImage("platforms", "platforms");



// Apply tilesets to layers
map.createLayer("sky", tileset, 0, 0);
const landLayer = map.createLayer("land", [tileset, tileset1], 0, 0); // ✅ Uses both tilesets


const platformsLayer = map.createLayer("platforms", platformTileset, 0, 0);

// Enable collision on landLayer
landLayer.setCollisionByProperty({ collides: true });
platformsLayer.setCollisionByProperty({ collides: true });

      
  
      // Enable Collision for Platforms
      landLayer.setCollisionByProperty({ collides: true });
      platformsLayer.setCollisionByProperty({ collides: true });
  
      // Set World and Camera Bounds
      this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); 
  
      this.input.gamepad.on('connected', (pad) => {
          console.log("🎮 Gamepad Connected:", pad.id);
      });
      
      
          // Enable gamepad input
  this.input.gamepad.once('connected', (pad) => {
      this.pad = pad; // Store the connected gamepad
      console.log("🎮 Gamepad Connected:", this.pad.id);
  });
  
  
      // Create the Player
      this.player = this.physics.add.sprite(100, 300, "player_idle");
      this.player.setBounce(0.1).setCollideWorldBounds(true).setGravityY(800).setSize(30, 40).setOffset(40, 40);
      this.physics.add.collider(this.player, platformsLayer);
      this.physics.add.collider(this.player, landLayer);
  
      // Create Player Animations
      this.anims.create({ key: "idle", frames: this.anims.generateFrameNumbers("player_idle", { start: 0, end: 9 }), frameRate: 8, repeat: -1 });
      this.anims.create({ key: "run", frames: this.anims.generateFrameNumbers("player_run", { start: 0, end: 9 }), frameRate: 12, repeat: -1 });
      this.anims.create({ key: "jump", frames: this.anims.generateFrameNumbers("player_jump", { start: 0, end: 2 }), frameRate: 6, repeat: 0 });
      this.anims.create({ key: "fall", frames: this.anims.generateFrameNumbers("player_fall", { start: 0, end: 2 }), frameRate: 6, repeat: -1 });
      this.anims.create({ key: "jump_fall_transition", frames: this.anims.generateFrameNumbers("player_jump_fall_inbetween", { start: 0, end: 1 }), frameRate: 6, repeat: 0 });
      this.anims.create({ key: "turnaround", frames: this.anims.generateFrameNumbers("player_turnaround", { start: 0, end: 2 }), frameRate: 20, repeat: 0 });
      this.anims.create({ key: "attack", frames: this.anims.generateFrameNumbers("player_attack", { start: 0, end: 3 }), frameRate: 10, repeat: 0 });
      this.anims.create({ key: "player_death", frames: this.anims.generateFrameNumbers("player_death", { start: 0, end: 3 }), frameRate: 10, repeat: 0 });
      this.anims.create({ key: "player_hit", frames: this.anims.generateFrameNumbers("player_hit", { start: 0, end: 0 }), frameRate: 1, repeat: 10 });
      this.player.play("idle");
      
      // -------------------- 🗡️ Original Enemy (Mushroom) --------------------
      
      // Create an enemy group
      this.enemies = this.physics.add.group();
      
      // Enemy animations
      this.anims.create({ key: "enemy_idle", frames: this.anims.generateFrameNumbers("enemy_idle", { start: 0, end: 6 }), frameRate: 6, repeat: -1 });
      this.anims.create({ key: "enemy_run", frames: this.anims.generateFrameNumbers("enemy_run", { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
      this.anims.create({ key: "enemy_attack", frames: this.anims.generateFrameNumbers("enemy_attack", { start: 0, end: 23 }), frameRate: 10, repeat: 0 });
      this.anims.create({ key: "enemy_death", frames: this.anims.generateFrameNumbers("enemy_death", { start: 0, end: 11 }), frameRate: 10, repeat: 0 });
      
      // Load enemies from Tiled object layer
      const enemySpawn = map.getObjectLayer("enemy"); // Make sure the layer is named "enemy" in Tiled
      enemySpawn.objects.forEach(obj => {
          let enemy = this.enemies.create(obj.x, obj.y, "enemy_idle");
          enemy.setCollideWorldBounds(true);
          enemy.setGravityY(800); // Apply gravity so it stands on platforms
          enemy.setSize(32, 34); // Adjust the size to better match the sprite
          enemy.setOffset(24, 30); // Adjust this so it aligns with the sprite
          enemy.play("enemy_idle"); // Play idle animation
          enemy.homeX = obj.x; // Store the initial position as homeX
      });
      
      // Enable collision with platforms
      this.physics.add.collider(this.enemies, landLayer);
      this.physics.add.collider(this.enemies, platformsLayer);
      
      // this.enemy.play("enemy_idle");
      
      // -------------------- 🟢 New Enemy (Slime) --------------------
      
      // 🟢 Slime Animations
      this.anims.create({
      key: "slime_idle",
      frames: [{ key: "slime_jump_land", frame: 0 }],  // Idle frame (adjust if needed)
      frameRate: 1,
      repeat: -1
      });
  
      this.anims.create({
      key: "slime_move",
      frames: this.anims.generateFrameNumbers("slime_idle", { start: 0, end: 5 }),
      frameRate: 6,  // Adjust speed if needed
      repeat: -1     // Loop the animation continuously
      });
        
      // ✅ Fix for Missing Animation
      this.anims.create({
      key: "slime_jump_start",
      frames: [{ key: "slime_jump_start", frame: 0 }], // Single-frame "jump start"
      frameRate: 1,
      repeat: -1
      });
      
      this.slimes = this.physics.add.group();
      const slimeLayer = map.getObjectLayer("enemy2");
      slimeLayer.objects.forEach(obj => {
          let slime = this.slimes.create(obj.x, obj.y, "slime_jump_start");
          slime.setCollideWorldBounds(true);
          slime.setBounce(1);
          slime.setVelocityX(5);               // Slime moves left/right
          slime.setScale(0.5);                  // Resize slime to make it smaller
          
          slime.homeX = obj.x;  // Store initial position
          slime.patrolRange = 80;  // Slime will move 100 pixels left & right from home
          slime.speed = 50;         // Adjust speed
          slime.direction = 1;      // 1 for right, -1 for left
        
          slime.play("slime_move", true);
      });
      this.physics.add.collider(this.slimes, platformsLayer);
      this.physics.add.collider(this.slimes, landLayer);
      
      // Collision Detection SLIME DAMAGE
      this.physics.add.overlap(this.player, this.slimes, (player, slime) => {
          if (!this.isAttacking) {  // If the player is NOT attacking, take damage
              this.dealDamage(player, slime);
          }
      }, null, this);
      
      
          
      
      
      // -------------------- 🎮 Input Handling --------------------
      this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      this.cursors = this.input.keyboard.addKeys({
          left: Phaser.Input.Keyboard.KeyCodes.A,
          right: Phaser.Input.Keyboard.KeyCodes.D,
          jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
          attack: Phaser.Input.Keyboard.KeyCodes.E
          
      });
  
      
  
      // --------------------  item group --------------------
      this.items = this.physics.add.group();
      const itemsLayer = map.getObjectLayer("items");
      itemsLayer.objects.forEach(obj => {
        const item = this.items.create(obj.x, obj.y - 16, "fruitSheet", obj.type === "banana" ? 1 : 0);
        item.setOrigin(0, 0).body.setAllowGravity(false);
      });
      this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);
  
  
      // --------------------  potion group --------------------
  this.potions = this.physics.add.group();
  
  // Load potions from Tiled object layer
  const potionsLayer = map.getObjectLayer("potion");
  if (potionsLayer) {
      potionsLayer.objects.forEach(obj => {
          const potion = this.potions.create(obj.x, obj.y - 16, "potionsheet");
          potion.setOrigin(0, 0).setScale(1); 
          potion.body.setAllowGravity(false);
      });
  }
  
  // Enable overlap detection between player and potions
  this.physics.add.overlap(this.player, this.potions, this.collectPotion, null, this);
  
      // ---------------- Quest Item Group ----------------
      
          this.questItems  = this.physics.add.group();
      
          // Load Quest Items from Tiled Object Layer
          const questLayer = map.getObjectLayer("questitem");
          if (questLayer) {
              questLayer.objects.forEach(obj => {
                  const questItem = this.questItems.create(obj.x, obj.y - 16, "questItemSheet");
                  questItem.setOrigin(0, 0).setScale(1);
                  questItem.body.setAllowGravity(false);
                  questItem.setData("collected", false); // Mark it as not yet collected
          
                  console.log("Quest Item Created at:", obj.x, obj.y); // Debugging
              });
          } else {
              console.error("Layer 'questitem' not found in Tiled map.");
          }

          
          
          
  // ---------------- Inventory Initialization ----------------
  this.inventory = {
      questItems: 0 // Track collected quest items
  };
  
  // ---------------- Overlap Detection for Quest Items ----------------
  this.physics.add.overlap(this.player, this.questItems, this.collectQuestItem, null, this);

  
  // ---------------- Function to Collect Quest Item ----------------
  this.physics.add.overlap(this.player, this.questItems, (player, item) => {
      if (!item.getData("collected")) {
          item.setData("collected", true); // Prevent duplicate collection
          item.destroy(); // Remove item from the scene
  
          // Update inventory count
          this.inventory.questItems++;
  
          console.log(`Quest Items Collected: ${this.inventory.questItems}`);
      }
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
      this.bg1.setPosition(0, -200);
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
  
     // -------------------- 🎥 Camera Setup --------------------
     this.cameras.main.setZoom(3).startFollow(this.player, true, 0.05, 0.05, 0, 75);
     
     // -------------------- ❤️ Player Setup --------------------
     this.player.hp = 3;
     this.player.isInvulnerable = false;
     this.player.play("idle");
     
     // -------------------- Enemy HP Initialization --------------------
     this.enemies.children.iterate((enemy) => {
      enemy.hp = 3;
      enemy.isHit = false;
     });
  
  
  // Create floating text but keep it invisible initially
  this.questText = this.add.text(0, 0, "ssssswwwwfff", {
    fontFamily: "PixelFont",  // Change this to any font you want
    fontSize: "16px",
    fill: "#ffffff",
    align: "center",
    stroke: "#000000", // Adds outline
    strokeThickness: 2
    
}).setOrigin(0.5).setVisible(false);
this.collectedQuestItems = 0; // Tracks collected quest items


  
     
  }
  

  
  collectPotion(player, potion) {
      potion.destroy(); // Remove potion
      if (this.player.hp < 10) { // Assuming max HP is 5
          this.player.hp++;
          this.sound.play("potionSound", { volume: 1.5 }); // Adjust volume if needed

      }
      console.log(`Player HP: ${this.player.hp}`);
  }
  
  
  collectQuestItem(player, item) {
          // ✅ Play quest pickup sound effect
    this.sound.play("questSound", { volume: 1.5 });

    item.destroy(); // Remove the item
    this.collectedQuestItems++; // Increment collected count
    console.log(`Quest Items Collected: ${this.collectedQuestItems}`);

    // Show floating text for each collected item
    let pickupText = this.add.text(this.player.x, this.player.y - 30, "+1 Quest Item", {
        fontFamily: "PixelFont",
        fontSize: "16px",
        fill: "#ffff00",
        stroke: "#000000",
        strokeThickness: 2
    }).setOrigin(0.5);

    this.time.delayedCall(1000, () => {
        pickupText.destroy();
    });

    // 🎯 Check if player has collected 3 items
    if (this.collectedQuestItems === 3) {
        this.time.delayedCall(2000, () => { // Delay before message appears
            this.showQuestCompleteText();
        });
    }
}

showQuestCompleteText() {
    let completionText = this.add.text(this.player.x, this.player.y - 50, "All pieces collected!", {
        fontFamily: "PixelFont",
        fontSize: "18px",
        fill: "#00ff00",
        stroke: "#000000",
        strokeThickness: 3
    }).setOrigin(0.5);

    this.time.delayedCall(3000, () => {
        completionText.destroy(); // Remove text after 3 seconds
    });
}


    
  
    dealDamage(player) {
        if (!player.isInvulnerable) {
            player.hp--; // Reduce HP
            console.log(`Player HP: ${player.hp}`);

            // ✅ Play damage sound effect
            this.sound.play("damageSound", { volume: 1.5 });
            
            // ✅ Stop all animations and enforce the hit sprite
            player.play("player_hit", true);
            
            // ✅ Set invulnerability
            player.isInvulnerable = true;
            player.setTint(0xff0000);
            player.setVelocityX(0);
            player.setVelocityY(0);
    
            // ✅ Reset hitbox immediately upon hit
            player.body.setSize(30, 40);
            player.body.setOffset(40, 40);
    
            // ✅ Apply Knockback
            const knockbackDirection = player.flipX ? 100 : -100;
            player.setVelocityX(knockbackDirection);
            player.setVelocityY(-150); // Slightly stronger knockback
    
            // ⏳ **Maintain the hit animation for a set duration**
            this.time.delayedCall(1000, () => { 
                player.clearTint();
            });
    
            // ⏳ **Control movement lock and animation recovery**
            this.time.delayedCall(1000, () => { 
                player.isInvulnerable = false;
    
                // ✅ Ensure the player transitions to the correct animation state
                if (player.body.velocity.y > 0) {
                    player.play("fall", true);
                } else if (player.body.velocity.y < 0) {
                    player.play("jump", true);
                } else if (this.cursors.left.isDown || this.cursors.right.isDown) {
                    player.play("run", true);
                } else {
                    player.play("idle", true);
                }
            });
    
            // ✅ Check for player death
            if (player.hp <= 0 && !player.isDead) {
                player.isDead = true;
                player.setVelocity(0);
                player.setTint(0x000000);
    
                // ⏳ Delay before restarting the scene
                this.time.delayedCall(100, () => {
                    this.scene.start("Accueil");
                });
            }
        }
    }
    
    
  
    
  
  
  
damageEnemy(enemy) {
    if (!enemy.isHit) {
        enemy.hp--; // Reduce enemy HP
        enemy.isHit = true; // Prevent rapid damage

        console.log(`Enemy HP: ${enemy.hp}`);

        // ✅ If the enemy is already dead, do nothing
        if (enemy.hp <= 0 && !enemy.isDead) {
            enemy.isDead = true;

            
            // BUG

            // ✅ **Force Death Animation Immediately**
            enemy.anims.stop();  // Stops all current animations
            enemy.setVelocity(0); // Ensures the enemy stops moving
            enemy.play("enemy_death", true); // Forces death animation

            // ✅ Remove hitbox & disable physics body
            enemy.body.setEnable(false);

            // ⏳ **Wait until animation is complete, then remove enemy**
            enemy.once("animationcomplete", () => {
                enemy.destroy();
            });

            return; // ✅ Exit function so no other logic runs
        }

        // ✅ **Flash Red Effect When Hit (Only if not dead yet)**
        enemy.setTint(0xff0000);
        this.time.delayedCall(300, () => {
            enemy.clearTint();
            enemy.isHit = false;
        });
    }
}

    

  
  
  
  update() {
    if (this.questTextFollow) {
        this.questText.setPosition(this.player.x, this.player.y - 30);
    }
    
      if (!this.cursors) return; // Prevent crashes if cursors are not initialized
  
      // Ensure gamepad is detected
      if (this.input.gamepad.total > 0 && !this.pad) {
          this.pad = this.input.gamepad.getPad(0);
          console.log("✅ Gamepad connected:", this.pad.id);
      }
  
      // Read existing movement inputs
      let moveLeft = false;
      let moveRight = false;
      let jump = false;
      let attack = false;
  
      // 🎮 Read Joystick X-Axis for movement (acts like A & D keys)
      if (this.pad && this.pad.axes.length > 0) {
          let joystickX = this.pad.axes[0].getValue(); // Get joystick X value
  
          if (joystickX < -0.4) {
              moveLeft = true;
              moveRight = false;
          } else if (joystickX > 0.4) {
              moveRight = true;
              moveLeft = false;
          } else {
              moveLeft = false;
              moveRight = false;
          }
      }
  
      // 🎮 Read Gamepad Buttons (0 = Jump, 1 = Attack)
      if (this.pad && this.pad.buttons.length > 1) {
          if (this.pad.buttons[0].pressed) { // Button 0 for Jump (acts like Space)
              jump = true;
          }
  
          if (this.pad.buttons[1].pressed) { // Button 1 for Attack (acts like E)
              attack = true;
          }
      }
  
      // Apply movement (joystick acting like A & D keys)
      this.cursors.left.isDown = moveLeft;
      this.cursors.right.isDown = moveRight;
  
      // Apply Jump exactly like Space bar
      this.cursors.jump.isDown = jump;
  
    // **Apply attack (button 1 directly triggers attack)**
    if (attack && this.canAttack) {
      this.canAttack = false; // Prevent spamming attack
      this.isAttacking = true;
      this.player.setVelocityX(0); // Stop movement when attacking
  
      console.log("✅ Attacking!");
      this.player.play("attack", true);


    // **Play attack sound only once per attack**
    this.sound.play("attackSound", { volume: 1.5 }); // Adjust volume if needed
  
      // Reset attack after animation completes
      this.player.once("animationcomplete", () => {
          this.isAttacking = false;
          this.canAttack = true; // Allow next attack
          this.player.play("idle", true); // Reset to idle
      });
  }
  
  
  
  
  
    
    
    
    
    
  if (this.player.isDead) return; // Stop update loop if player is dead
  
  // Player Attack Logic
  if (this.player.anims.currentAnim && this.player.anims.currentAnim.key === "attack") {
      const currentFrame = this.player.anims.currentFrame.index;
  
      
  
      // Adjust hitbox during attack frames based on facing direction
      if ([1, 2, 3].includes(currentFrame)) {
          if (this.player.flipX) {
              // Facing LEFT
              this.player.body.setSize(80, 40);     // Widen the hitbox
              this.player.body.setOffset(0, 40);   // Shift hitbox towards the left
          } else {
              // Facing RIGHT
              this.player.body.setSize(80, 40);     // Widen the hitbox
              this.player.body.setOffset(40, 40);   // Shift hitbox towards the right
          }
      } else {
          // Reset hitbox to default size after attack frames
          if (this.player.flipX) {
              this.player.body.setSize(30, 40);
              this.player.body.setOffset(50, 40);   // Default offset for LEFT
          } else {
              this.player.body.setSize(30, 40);
              this.player.body.setOffset(40, 40);   // Default offset for RIGHT
          }
      }
      

  
      // Apply damage during specific attack frames
      if ([1, 2, 3].includes(currentFrame)) {
          this.physics.overlap(this.player, this.enemies, (player, enemy) => {
              this.damageEnemy(enemy);
          });
          
      }
      
  }
  
  
  this.slimes.children.iterate((slime) => {
      if (slime.body.blocked.left) {
        slime.direction = 1;  // Move right if hitting the left wall
      } 
      if (slime.body.blocked.right) {
        slime.direction = -1; // Move left if hitting the right wall
      }
    
      // Patrol within range from homeX
      if (slime.x > slime.homeX + slime.patrolRange) {
        slime.direction = -1;  // Move left
      } 
      if (slime.x < slime.homeX - slime.patrolRange) {
        slime.direction = 1;   // Move right
      }
    
      slime.setVelocityX(slime.speed * slime.direction);
      slime.setSize(35, 20);     // (width, height) — adjust as needed
      slime.setOffset(30, 10);   // (x, y) offset — fine-tune to center hitbox
      slime.flipX = slime.direction === -1;  // Flip sprite when changing direction
    });
  
    
    
  
  
      // Enemy Behavior
      this.enemies.children.iterate((enemy) => {
          const distanceToPlayer = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
  
          if (enemy.isAttacking === undefined) {
              enemy.isAttacking = false;
          }
  
          if (distanceToPlayer < 30 && !enemy.isAttacking && !this.player.isInvulnerable) {
              enemy.setVelocityX(0);
              enemy.isAttacking = true;
              enemy.play("enemy_attack", true);
              enemy.flipX = this.player.x > enemy.x;
  
              enemy.on("animationupdate", (anim, frame) => {
                  if (frame.index >= 4 && frame.index <= 7 && !this.player.isInvulnerable) {
                      if (Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y) < 30) {
                          this.dealDamage(this.player);
  
                          // Apply faster knockback to player
                          const knockback = 50; // Increased knockback speed
                          const direction = (this.player.x < enemy.x) ? -1 : 1; 
                          this.player.setVelocityX(knockback * direction);
                      }
                  }
              });
  
              enemy.once("animationcomplete", () => {
                  enemy.isAttacking = false;
              });
          } else if (!enemy.isAttacking) {
              if (distanceToPlayer < 100) {
                  enemy.setVelocityX(this.player.x < enemy.x ? -50 : 50);
                  enemy.flipX = this.player.x > enemy.x;
                  enemy.play("enemy_run", true);
              } else if (Math.abs(enemy.x - enemy.homeX) > 5) {
                  enemy.setVelocityX(enemy.x > enemy.homeX ? -30 : 30);
                  enemy.flipX = enemy.x < enemy.homeX;
                  enemy.play("enemy_run", true);
              } else {
                  enemy.setVelocityX(0);
                  enemy.play("enemy_idle", true);
              }
          }
      });
  
    
      
      let cameraX = this.cameras.main.scrollX;
      let cameraY = this.cameras.main.scrollY;
  
      
      const scrollX = this.cameras.main.scrollX;
      [this.bg1, this.bg2, this.bg3, this.bg4, this.bg5, this.bg6, this.bg7, this.bg8, this.bg9, this.bg10, this.bg11, this.bg12].forEach((bg, index) => {
          bg.x = scrollX * (0.09 + index * 0.01);
      });
  
      if (this.isAttacking || this.player.isInvulnerable) return;
  
      if (Phaser.Input.Keyboard.JustDown(this.attackKey) && this.canAttack) {
          this.canAttack = false; // Prevent attacking again immediately
          this.isAttacking = true; // Set attack flag
          this.player.play("attack", true);
          this.player.setVelocityX(0); // Stop movement during attack
      
          // Reset attack ability after cooldown
          this.time.delayedCall(1000, () => { // Adjust the delay as needed
              this.canAttack = true;
          });
      
          // Wait until the attack animation completes before resetting attack flag
          this.player.once("animationcomplete", () => {
              this.isAttacking = false; // Reset attack flag
              this.player.play("idle", true); // Go back to idle
          });
      
          return; // Prevent other animations from interrupting the attack
      }    
      console.log("Can attack:", this.canAttack);
  
  
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
  
  
  
// Ensure a walk sound variable exists
if (!this.walkSound) {
    this.walkSound = this.sound.add("walkSound", { loop: true, volume: 0.6 });
}

// Handle movement **only when the player is touching the ground**
if (this.player.body.blocked.down) {
    if (movingLeft || movingRight) {
        this.player.setVelocityX(movingLeft ? -120 : 120);
        this.player.flipX = movingLeft;
        this.player.play("run", true);
        this.lastDirection = movingLeft ? "left" : "right";

        // Adjust hitbox
        this.player.body.setOffset(movingLeft ? 50 : 40, 40);

        // 🎵 **Play walk sound only when grounded and not already playing**
        if (!this.walkSound.isPlaying) {
            this.walkSound.play();
        }
    } else {
        this.player.setVelocityX(0);
        this.player.play("idle", true);

        // Keep hitbox aligned when idle
        this.player.body.setOffset(this.lastDirection === "left" ? 50 : 40, 40);

        // 🎵 **Stop walk sound when idle**
        if (this.walkSound.isPlaying) {
            this.walkSound.stop();
        }
    }
} else {
    // 🎵 **Stop walk sound when the player is in the air**
    if (this.walkSound.isPlaying) {
        this.walkSound.stop();
    }
}


  
    
      // Jumping logic
      if (this.cursors.jump.isDown && this.player.body.blocked.down) {
        this.player.setVelocityY(-300);
        this.player.play("jump", true);
         // Play jump sound effect
    this.sound.play("jumpSound", { volume: 1.5 }); // Adjust volume if needed
    }
  
    
    // Track if the player was in the air before landing
    if (!this.player.body.blocked.down && this.player.body.velocity.y > 200) { 
        this.wasInAir = true; // Mark that the player is falling
    }
    
    // Play landing sound only once when landing
    if (this.wasInAir && this.player.body.blocked.down) {
        if (!this.landedRecently) {  // Prevent multiple triggers
            this.sound.play("landingSound", { volume: 1.5 });
            this.landedRecently = true;
    
            // Reset the flag after a short delay
            this.time.delayedCall(100, () => { 
                this.landedRecently = false; 
            });
        }
    
        this.wasInAir = false; // Reset air state
    }
    



      // **In-Between Jump/Fall Logic**
      if (this.player.body.velocity.y > 0 && this.player.body.velocity.y < 200) {
        this.player.play("jump_fall_transition", true);
      }
    }
  
    
  
  }