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

    // Load Fruit Spritesheet
    this.load.spritesheet("fruitSheet", "./sprites/fruit.png", { frameWidth: 16, frameHeight: 16 });

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

  

  }


  create() {
    // Debugging (Hidden by Default)
    this.debugGraphics = this.add.graphics().setVisible(true);
    this.physics.world.createDebugGraphic().setVisible(true);

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
    
    // Create Player Animations
    this.anims.create({ key: "idle", frames: this.anims.generateFrameNumbers("player_idle", { start: 0, end: 9 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "run", frames: this.anims.generateFrameNumbers("player_run", { start: 0, end: 9 }), frameRate: 12, repeat: -1 });
    this.anims.create({ key: "jump", frames: this.anims.generateFrameNumbers("player_jump", { start: 0, end: 2 }), frameRate: 6, repeat: 0 });
    this.anims.create({ key: "fall", frames: this.anims.generateFrameNumbers("player_fall", { start: 0, end: 2 }), frameRate: 6, repeat: -1 });
    this.anims.create({ key: "jump_fall_transition", frames: this.anims.generateFrameNumbers("player_jump_fall_inbetween", { start: 0, end: 1 }), frameRate: 6, repeat: 0 });
    this.anims.create({ key: "turnaround", frames: this.anims.generateFrameNumbers("player_turnaround", { start: 0, end: 2 }), frameRate: 20, repeat: 0 });
    this.anims.create({ key: "attack", frames: this.anims.generateFrameNumbers("player_attack", { start: 0, end: 3 }), frameRate: 10, repeat: 0 });
    this.anims.create({ key: "player_death", frames: this.anims.generateFrameNumbers("player_death", { start: 0, end: 3 }), frameRate: 10, repeat: 0 });
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
   
   this.player.hp = 3; // Player starts with 3 HP
   this.player.isInvulnerable = false; // To prevent taking damage multiple times rapidly

   this.enemies.children.iterate((enemy) => {
    enemy.hp = 3; // Set enemy HP
    enemy.isHit = false; // Prevent rapid damage
});

  }

  collectItem(player, item) {
    item.destroy();
    this.score += 10;
    console.log("Item collected! Score:", this.score);
  }

  dealDamage(player) {
    if (!player.isInvulnerable) {
        player.hp--; // Reduce HP
        console.log(`Player HP: ${player.hp}`);

        player.isInvulnerable = true; // Prevent rapid damage
        player.setTexture("player_hit"); // Display the HIT frame
        player.setFrame(0); // Keep showing the first HIT frame
        player.setTint(0xff0000); // Add red tint for visual feedback

        // Apply Knockback
        const knockbackDirection = player.flipX ? 200 : -200; // Adjust knockback based on facing direction
        player.setVelocityX(knockbackDirection); 
        player.setVelocityY(-100); // Optional: Slight upward push

        // Control the entire duration of the knockback and HIT frame
        this.time.delayedCall(1000, () => { // Knockback lasts 1 second
            player.clearTint();
            player.setTexture("player_idle"); // Return to idle sprite
            player.play("idle", true); // Resume idle animation
            player.isInvulnerable = false; // Allow taking damage again
        });

        // Check for player death
        if (player.hp <= 0 && !player.isDead) {
            player.isDead = true;
            player.setVelocity(0);
            player.setTint(0x000000);
            this.time.delayedCall(1500, () => {
                this.scene.start("Accueil"); // Restart or go to main menu
            });
        }
    }
}


damageEnemy(enemy) {
  if (!enemy.isHit) {
      enemy.hp--;
      enemy.isHit = true;

      console.log(`Enemy HP: ${enemy.hp}`);

      enemy.setTint(0xff0000);
      this.time.delayedCall(300, () => {
          enemy.clearTint();
          enemy.isHit = false;
      });

      if (enemy.hp <= 0 && !enemy.isDead) {
          enemy.isDead = true;
          enemy.setVelocity(0);
          enemy.anims.play("enemy_death", true);
          enemy.once("animationcomplete", () => {
              enemy.destroy();
          });
      }
  }
}



update() {
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
                        const knockback = 100; // Increased knockback speed
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



// Handle movement
if (movingLeft) {
    this.player.setVelocityX(-120);
    this.player.flipX = true;
    this.player.play("run", true);
    this.lastDirection = "left";

    // Adjust hitbox for left direction
    this.player.body.setOffset(50, 40); // Adjusted offset for left
} else if (movingRight) {
    this.player.setVelocityX(120);
    this.player.flipX = false;
    this.player.play("run", true);
    this.lastDirection = "right";

    // Adjust hitbox for right direction
    this.player.body.setOffset(40, 40); // Original offset for right
} else {
    this.player.setVelocityX(0);
    if (this.player.body.blocked.down) {
        this.player.play("idle", true);

        // Keep hitbox aligned when idle
        if (this.lastDirection === "left") {
            this.player.body.setOffset(50, 40);
        } else {
            this.player.body.setOffset(40, 40);
        }
    }
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