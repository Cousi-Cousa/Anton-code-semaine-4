class Jeu extends Phaser.Scene {
  constructor() {
    super({
      key: "Jeu"
    });
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
    for (let i = 1; i <= 10; i++) {
      this.load.image(`bg${i}`, `./sprites/background/${i}.png`);
    }

    // Load Heart images
    this.load.image("texte_debut", "./images/texte_debut.png");

    this.load.image('texte_npc_1', "./images/texte_lavar_1.png");
    this.load.image('texte_npc_2', "./images/texte_lavar_2.png");
    this.load.image('texte_npc_3', "./images/texte_lavar_3.png");
    this.load.image('texte_npc_4', "./images/texte_lavar_4.png");


    // Load Heart images
    this.load.image("hp_5", "./images/coeur_5.png");
    this.load.image("hp_4", "./images/coeur_4.png");
    this.load.image("hp_3", "./images/coeur_3.png");
    this.load.image("hp_2", "./images/coeur_2.png");
    this.load.image("hp_1", "./images/coeur_1.png");
    this.load.image("hp_0", "./images/coeur_0.png");

    // Load pieces of map
    this.load.image("piece_0", "./images/manuscrit_0.png");
    this.load.image("piece_1", "./images/manuscrit_1.png");
    this.load.image("piece_2", "./images/manuscrit_2.png");
    this.load.image("piece_3", "./images/manuscrit_3.png");

    
    this.load.image("victoryBanner", "./images/victoire.png");
    this.load.image("deathBanner", "./images/mort.png");

    // Load Tilemap and Tilesets
    this.load.tilemapTiledJSON("map", "./maps/test1.json");
    this.load.image("Tileset", "./sprites/Tileset.png");
    this.load.image("platforms", "./sprites/platforms.png");
    this.load.image("tileset_1", "./sprites/tileset_1.png");
    this.load.image("platform", "./sprites/platform.png");
    this.load.image("land", "./sprites/land.png");
    this.load.image("decoration", "./sprites/decoration.png");

    // Load Fruit Spritesheet
    this.load.spritesheet("fruitSheet", "./sprites/fruit.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    // Load potion Spritesheet
    this.load.spritesheet("potionsheet", "./sprites/fruits.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    // Load quest Item Spritesheet
    this.load.spritesheet("questItemSheet", "./sprites/quest.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    // Load tileset_1 Spritesheet
    this.load.image("tileset_1", "./sprites/tileset_1.png"); // Update the path if needed
    // Load rubis Spritesheet
    this.load.spritesheet("rubis", "sprites/Rubis.png", {
      frameWidth: 32,
      frameHeight: 96,
    });

    // Load npc Spritesheets
    this.load.spritesheet("npc", "./sprites/npc.png", {
      frameWidth: 29,
      frameHeight: 38
    });


    // Load Player Spritesheets
    this.load.spritesheet(
      "player_idle",
      "./player_spritesheet/chevalier_repos.png", {
        frameWidth: 120,
        frameHeight: 80
      }
    );
    this.load.spritesheet("player_run", "./player_spritesheet/_Run.png", {
      frameWidth: 120,
      frameHeight: 80,
    });
    this.load.spritesheet(
      "player_jump",
      "./player_spritesheet/chevalier_saut.png", {
        frameWidth: 120,
        frameHeight: 80
      }
    );
    this.load.spritesheet(
      "player_fall",
      "./player_spritesheet/chevalier_tombe.png", {
        frameWidth: 120,
        frameHeight: 80
      }
    );
    this.load.spritesheet(
      "player_jump_fall_inbetween",
      "./player_spritesheet/chevalier_transition_saut.png", {
        frameWidth: 120,
        frameHeight: 80
      }
    );
    this.load.spritesheet(
      "player_turnaround",
      "./player_spritesheet/chevalier_tourne.png", {
        frameWidth: 120,
        frameHeight: 80
      }
    );
    this.load.spritesheet(
      "player_attack",
      "./player_spritesheet/chevalier_attaque.png", {
        frameWidth: 120,
        frameHeight: 80
      }
    );
    this.load.spritesheet("player_hit", "./player_spritesheet/_Hit.png", {
      frameWidth: 120,
      frameHeight: 80,
    });
    this.load.spritesheet("player_death", "./player_spritesheet/Death.png", {
      frameWidth: 120,
      frameHeight: 80
    });

    // Load Enemy Spritesheets
    this.load.spritesheet("enemy_idle", "./sprites/Mushroom-Idle.png", {
      frameWidth: 80,
      frameHeight: 64,
    });
    this.load.spritesheet("enemy_run", "./sprites/Mushroom-Run.png", {
      frameWidth: 80,
      frameHeight: 64,
    });
    this.load.spritesheet(
      "enemy_attack",
      "./sprites/Mushroom-AttackWithStun.png", {
        frameWidth: 80,
        frameHeight: 64
      }
    );
    this.load.spritesheet("enemy_death", "./sprites/Mushroom-Die.png", {
      frameWidth: 80,
      frameHeight: 64,
    });

    // 1. Preload Slime Spritesheets
    this.load.spritesheet(
      "slime_jump_up",
      "./sprites/Sprite Sheet - Green Jump Up.png", {
        frameWidth: 96,
        frameHeight: 32
      }
    );
    this.load.spritesheet(
      "slime_jump_down",
      "./sprites/Sprite Sheet - Green Jump Down.png", {
        frameWidth: 96,
        frameHeight: 32
      }
    );
    this.load.spritesheet(
      "slime_jump_land",
      "./sprites/Sprite Sheet - Green Jump Land.png", {
        frameWidth: 96,
        frameHeight: 32
      }
    );
    this.load.spritesheet(
      "slime_jump_start",
      "./sprites/Sprite Sheet - Green Jump Start-up.png", {
        frameWidth: 96,
        frameHeight: 32
      }
    );
    this.load.spritesheet(
      "slime_jump_to_fall",
      "./sprites/Sprite Sheet - Green Jump to Fall.png", {
        frameWidth: 96,
        frameHeight: 32
      }
    );
    this.load.spritesheet(
      "slime_idle",
      "./sprites/Slime_idle.png", {
        frameWidth: 96,
        frameHeight: 32
      }
    );
    this.load.spritesheet(
      "sprite_manuscrit",
      "./sprites/manuscrit.png", {
        frameWidth: 46.5263157895,
        frameHeight: 32
      }
    );

    for(let i = 1; i <= 10; i++) {
      this.load.audio(`jumpSound_${i}`, `sounds/saut/saut_${i}.wav`)
    }

    for(let i = 1; i <= 10; i++) {
      this.load.audio(`landingSound_${i}`, `sounds/atterissage/atterissage_${i}.wav`)
    }

    for(let i = 1; i <= 11; i++) {
      this.load.audio(`swordSound_${i}`, `sounds/swoosh_epee/swoosh_epee_${i}.wav`)
    }

    for(let i = 1; i <= 10; i++) {
      this.load.audio(`walkingSound_${i}`, `sounds/marche/marche_${i}.wav`)
    }

    for(let i = 1; i <= 10; i++) {
      this.load.audio(`healthLost_${i}`, `sounds/vie_perdu/vie_perdu_${i}.wav`)
    }

    for(let i = 1; i <= 10; i++) {
      this.load.audio(`healthUp_${i}`, `sounds/vie_gagnee/vie_gagnee_${i}.wav`)
    }

    for(let i = 1; i <= 10; i++) {
      this.load.audio(`woundedMushroom_${i}`, `sounds/blessure_ennemi/blessure_ennemi_${i}.wav`)
    }

    for(let i = 1; i <= 10; i++) {
      this.load.audio(`dyingMushroom_${i}`, `sounds/mort_champignon/mort_champignon_${i}.wav`)
    }

    for(let i = 1; i <= 10; i++) {
      this.load.audio(`impactMush_${i}`, `sounds/impact_champignon/impact_champignon_${i}.wav`)
    }

    for(let i = 1; i <= 10; i++) {
      this.load.audio(`parchemin_${i}`, `sounds/interaction_parchemin/interaction_parchemin_${i}.wav`)
    }

    for(let i = 1; i <= 10; i++) {
      this.load.audio(`slime_${i}`, `sounds/deplacement_slime/deplacement_slime_${i}.wav`)
    }

    // Music
    this.load.audio('gameMusic', './Sounds/musique_gameplay.wav');


    // Music-Sounds
    this.load.audio("attackSound", "sounds/Attack.wav");
    this.load.audio("jumpSound", "sounds/Jump.wav");
    this.load.audio("landingSound", "sounds/Landing.wav");
    this.load.audio("potionSound", "sounds/FruitPickUp.wav");
    this.load.audio("damageSound", "sounds/Damage.wav");
    this.load.audio("questSound", "sounds/QuestPickUp.wav");
    this.load.audio("walkSound", "sounds/Walk.wav");
    this.load.audio("mushroomAttack", "sounds/attaque_champignon_test 5.wav");
    this.load.audio("rubisSound", "sounds/ambiance_artefact_reaper 1.wav");

  }

  displayNpcText() {
    this.texteNpcShown = true;

    console.log("Display NPC text " + this.texteNpcCount);
    if (this.texteNpcCount == 0) {



      this.playerCanMove = false;
      this.texteNpc1 = this.add.image(2240, 565, 'texte_npc_1');
      this.texteNpc1.setScale(0.35).setAlpha(0).setDepth(5);
      // ✅ Affiche le texte
      this.textNpcAnimationComplete = false;

      this.tweens.add({
        targets: this.texteNpc1,
        alpha: 1, // Fully visible
        y: this.cameras.main.centerY - 0, // Move up
        duration: 850, // Fade-in & move-up duration (.850 sec)
        ease: 'Linear',
        onComplete: () => {
          this.textNpcAnimationComplete = true;
        }
      });
      this.texteNpcCount = 1;
      
    } else if (this.texteNpcCount == 1) {
      this.texteNpc2 = this.add.image(2240, 565, 'texte_npc_2');
      this.texteNpc2.setScale(0.35).setAlpha(0).setDepth(5);

      this.textNpcAnimationComplete = false;

      this.tweens.add({
        targets: this.texteNpc1,
        alpha: 0, // Fully visible
        y: this.cameras.main.centerY + 50, // Move up
        duration: 850, // Fade-in & move-up duration (.850 sec)
        ease: 'Linear',
        onComplete: () => {
          this.tweens.add({
            targets: this.texteNpc2,
            alpha: 1, // Fully visible
            y: this.cameras.main.centerY - 0, // Move down
            duration: 850, // Fade-in & move-up duration (.850 sec)
            ease: 'Linear',
            onComplete: () => {
              this.textNpcAnimationComplete = true;
            }
          });
        }
      });

      this.texteNpcCount = 2;

    } else if (this.texteNpcCount == 2) {
      this.texteNpc3 = this.add.image(2240, 565, 'texte_npc_3');
      this.texteNpc3.setScale(0.35).setAlpha(0).setDepth(5);
      this.textNpcAnimationComplete = false;

      this.tweens.add({
        targets: this.texteNpc2,
        alpha: 0, // Fully visible
        y: this.cameras.main.centerY + 50, // Move up
        duration: 850, // Fade-in & move-up duration (.850 sec)
        ease: 'Linear',
        onComplete: () => {
          this.tweens.add({
            targets: this.texteNpc3,
            alpha: 1, // Fully visible
            y: this.cameras.main.centerY - 0, // Move down
            duration: 850, // Fade-in & move-up duration (.850 sec)
            ease: 'Linear',
            onComplete: () => {
              this.textNpcAnimationComplete = true;
            }
          });
        }
      });
      this.texteNpcCount = 3;

    } else if (this.texteNpcCount == 3) {
      this.texteNpc4 = this.add.image(2240, 565, 'texte_npc_4');
      this.texteNpc4.setScale(0.35).setAlpha(0).setDepth(5);
      this.textNpcAnimationComplete = false;

      this.tweens.add({
        targets: this.texteNpc3,
        alpha: 0, // Fully visible
        y: this.cameras.main.centerY + 50, // Move down
        duration: 850, // Fade-in & move-up duration (.850 sec)
        ease: 'Linear',
        onComplete: () => {
          this.tweens.add({
            targets: this.texteNpc4,
            alpha: 1, // Fully visible
            y: this.cameras.main.centerY - 0, // Move down
            duration: 850, // Fade-in & move-up duration (.850 sec)
            ease: 'Linear',
            onComplete: () => {
              this.textNpcAnimationComplete = true;
            }
          });
        }
      });

      this.texteNpcCount = 4;

    }  else if (this.texteNpcCount > 3) {
      this.textNpcAnimationComplete = false;

      this.tweens.add({
        targets: this.texteNpc4,
        alpha: 0, // Fully visible
        y: this.cameras.main.centerY + 50, // Move down
        duration: 850, // Fade-in & move-up duration (.850 sec)
        ease: 'Linear',
        onComplete: () => {
          this.textNpcAnimationComplete = true;
        }
      });
      this.playerCanMove = true;
      this.texteNpcCount = 0;
    }



  }

  create() {

    this.registry.set('gameMusic', this.gameMusic);

    // Check if menu music is playing, pause it if so
    if (backgroundMusic && backgroundMusic.isPlaying) {
      backgroundMusic.pause();
    }

    // Play g0me-specific music only if not already playing
    if (!gameMusic) {
      gameMusic = this.sound.add("gameMusic", { volume: 0.06, loop: true });
      gameMusic.play();
    }

    // Stop `gameMusic` when leaving the scene
    this.events.on("shutdown", () => {
      if (gameMusic && gameMusic.isPlaying) {
        gameMusic.stop();
        gameMusic = null; // Reset to allow replaying if the scene restarts
      }
    });

    console.log("CREATING");
    // Debugging (Hidden by Default)
    this.debugGraphics = this.add.graphics().setVisible(true);
    this.physics.world.createDebugGraphic().setVisible(false);

    // Load Tilemap
    const map = this.make.tilemap({
      key: "map"
    });

    // Load both tilesets
    const tileset = map.addTilesetImage("Tileset", "Tileset");
    const tileset1 = map.addTilesetImage("tileset_1", "tileset_1"); // New tileset
    const platformTiles = map.addTilesetImage("platform", "platform");
    const landTiles = map.addTilesetImage("land", "land");
    const decorationTiles = map.addTilesetImage("decoration", "decoration"); // ✅ Ajout du tileset de décoration



    // Apply tilesets to layers

    const skyLayer = map.createLayer("sky", decorationTiles, 0, 0); // Sky should be created FIRST
    const landLayer = map.createLayer("land", [tileset, tileset1, landTiles, decorationTiles], 0, 0); // ✅ Ajout du décor dans le sol
    const platformsLayer = map.createLayer("platforms", platformTiles, 0, 0);
    const decorationLayer = map.createLayer("structure", decorationTiles, 0, 0);


    if (!decorationLayer) {
      console.error("❌ Decoration layer failed to load.");
    }


    skyLayer.setDepth(0); // Sky at the back
    landLayer.setDepth(0); // Land behind platforms and structure
    platformsLayer.setDepth(0); // Platforms in front of land
    decorationLayer.setDepth(0); // Structure/decoration at the front


    // ✅ Désactiver la collision pour la décoration
    //decorationLayer.setDepth(-1); // Mettre en arrière-plan
    decorationLayer.setCollisionByProperty({
      collides: false
    });

    // ✅ Activer la collision uniquement pour le sol et les plateformes
    landLayer.setCollisionByProperty({
      collides: true
    });
    platformsLayer.setCollisionByProperty({
      collides: true
    });
    skyLayer.setCollisionByProperty({
      collides: false
    });



    // Enable Collision for Platforms
    landLayer.setCollisionByProperty({
      collides: true
    });
    platformsLayer.setCollisionByProperty({
      collides: true
    });




    // Set World and Camera Bounds
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Create the Player
    this.player = this.physics.add.sprite(100, 584, "player_idle");
    this.player
      .setBounce(0.1)
      .setCollideWorldBounds(true)
      .setGravityY(800)
      .setSize(20, 40)
      .setOffset(40, 40)
      .setDepth(2);
    this.physics.add.collider(this.player, platformsLayer);
    this.physics.add.collider(this.player, landLayer);


    // Create Player Animations
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player_idle", {
        start: 0,
        end: 9,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("player_run", {
        start: 0,
        end: 9,
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("player_jump", {
        start: 0,
        end: 2,
      }),
      frameRate: 6,
      repeat: 0,
    });
    this.anims.create({
      key: "fall",
      frames: this.anims.generateFrameNumbers("player_fall", {
        start: 0,
        end: 2,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: "jump_fall_transition",
      frames: this.anims.generateFrameNumbers("player_jump_fall_inbetween", {
        start: 0,
        end: 1,
      }),
      frameRate: 6,
      repeat: 0,
    });
    this.anims.create({
      key: "turnaround",
      frames: this.anims.generateFrameNumbers("player_turnaround", {
        start: 0,
        end: 2,
      }),
      frameRate: 20,
      repeat: 0,
    });
    this.anims.create({
      key: "attack",
      frames: this.anims.generateFrameNumbers("player_attack", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "player_death",
      frames: this.anims.generateFrameNumbers("player_death", {
        start: 0,
        end: 19
      }),
      frameRate: 10,
      repeat: 0,

    });

    this.anims.create({
      key: "player_hit",
      frames: this.anims.generateFrameNumbers("player_hit", {
        start: 0,
        end: 0,
      }),
      frameRate: 1,
      repeat: 10,
    });
    this.player.play("idle");


    // Create animation
    this.anims.create({
      key: 'npc_idle',
      frames: this.anims.generateFrameNumbers('npc', {
        start: 0,
        end: 5
      }),
      frameRate: 6,
      repeat: -1
    });

    // ✅ Contrôle de mouvement du joueur
    this.playerCanMove = true;

    this.texteNpcShown = false;

    this.texteNpcCount = 0;

    // Create NPCs from Tiled
    this.npcs = this.physics.add.group();
    const npcLayer = map.getObjectLayer('npc');
    npcLayer.objects.forEach((obj) => {
      let npc = this.npcs.create(obj.x, obj.y, 'npc');
      npc.setScale(1);
      npc.setDepth(0);
      npc.setSize(100, 80);
      npc.play('npc_idle', true);
    });

    this.npc = this.physics.add.sprite(400, 300, 'npc');
    this.npc.setImmovable(true);


    /*this.texteNpc1.setOrigin(2.3, 0);*/



    this.physics.add.overlap(this.player, this.npcs, (player, npc) => {
      if (this.texteNpcShown == false) {
        this.displayNpcText();
      }

    });

    this.textNpcAnimationComplete = true;


    // -------------------- 🗡️ Original Enemy (Mushroom) --------------------

    // Create an enemy group
    this.enemies = this.physics.add.group();

    // Enemy animations
    this.anims.create({
      key: "enemy_idle",
      frames: this.anims.generateFrameNumbers("enemy_idle", {
        start: 0,
        end: 6,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: "enemy_run",
      frames: this.anims.generateFrameNumbers("enemy_run", {
        start: 0,
        end: 7,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "enemy_attack",
      frames: this.anims.generateFrameNumbers("enemy_attack", {
        start: 0,
        end: 23,
      }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "enemy_death",
      frames: this.anims.generateFrameNumbers("enemy_death", {
        start: 0,
        end: 11,
      }),
      frameRate: 10,
      repeat: 0,
    });


    //anim manuscrit
    this.anims.create({
      key: "sprite_manuscrit",
      frames: this.anims.generateFrameNumbers("sprite_manuscrit", {
        start: 0,
        end: 18,
      }),
      frameRate: 10,
      repeat: 0,
    });

    // Load enemies from Tiled object layer
    const enemySpawn = map.getObjectLayer("enemy"); // Make sure the layer is named "enemy" in Tiled
    enemySpawn.objects.forEach((obj) => {
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

    // Load the enemy sound in the create function
    this.enemy1Sound = this.sound.add("rubisSound", {
      loop: true // Ensures the sound loops
    });


    // Start the sound **only when the player is close enough**
    this.soundPlaying = false; // Track if sound is playing

    // Play the sound at 100% volume initially (optional)
    this.enemy1Sound.play();
    this.enemy1Sound.setVolume(0); // Start at 0 volume to avoid abrupt noise

    // this.enemy.play("enemy_idle");

    // -------------------- 🟢 New Enemy (Slime) --------------------

    // 🟢 Slime Animations
    this.anims.create({
      key: "slime_idle",
      frames: [{
        key: "slime_jump_land",
        frame: 0
      }], // Idle frame (adjust if needed)
      frameRate: 1,
      repeat: -1,
    });

    this.anims.create({
      key: "slime_move",
      frames: this.anims.generateFrameNumbers("slime_idle", {
        start: 0,
        end: 6,
      }),
      frameRate: 6, // Adjust speed if needed
      repeat: -1, // Loop the animation continuously
    });

    // ✅ Fix for Missing Animation
    this.anims.create({
      key: "slime_jump_start",
      frames: [{
        key: "slime_jump_start",
        frame: 0
      }], // Single-frame "jump start"
      frameRate: 1,
      repeat: -1,
    });

    this.slimes = this.physics.add.group();
    const slimeLayer = map.getObjectLayer("enemy2");
    slimeLayer.objects.forEach((obj) => {
      let slime = this.slimes.create(obj.x, obj.y, "slime_jump_start");
      slime.setCollideWorldBounds(true);
      slime.setBounce(1);
      slime.setVelocityX(50); // Slime moves left/right
      slime.setScale(0.5); // Resize slime to make it smaller

      // Reverse direction every 2 seconds
      this.time.addEvent({
        delay: 3000, // Time in milliseconds (2s)
        loop: true,
        callback: () => {
          slime.setVelocityX(slime.body.velocity.x * -1); // Reverse direction
        }
      });

      this.slimes.getChildren().forEach((slime) => {
        slime.setSize(35, 20); // Adjust width and height of the hitbox
        slime.setOffset(30, 10); // Move hitbox inside the sprite (if needed)
      });


      slime.homeX = obj.x; // Store initial position
      slime.patrolRange = 80; // Slime will move 100 pixels left & right from home
      slime.speed = 50; // Adjust speed
      slime.direction = 1; // 1 for right, -1 for left

      slime.play("slime_move", true);
    });
    this.physics.add.collider(this.slimes, platformsLayer);
    this.physics.add.collider(this.slimes, landLayer);

    // Collision Detection SLIME DAMAGE
    this.physics.add.overlap(
      this.player,
      this.slimes,
      (player, slime) => {
        if (!this.isAttacking) {
          // If the player is NOT attacking, take damage
          this.dealDamage(player, slime);
        }
      },
      null,
      this
    );

    // --------------------  item group --------------------
    this.items = this.physics.add.group();
    const itemsLayer = map.getObjectLayer("items");
    itemsLayer.objects.forEach((obj) => {
      const item = this.items.create(
        obj.x,
        obj.y - 16,
        "fruitSheet",
        obj.type === "banana" ? 1 : 0
      );
      item.setOrigin(0, 0).body.setAllowGravity(false);
    });
    this.physics.add.overlap(
      this.player,
      this.items,
      this.collectItem,
      null,
      this
    );

    // --------------------  potion group --------------------
    this.potions = this.physics.add.group();

    // Load potions from Tiled object layer
    const potionsLayer = map.getObjectLayer("potion");
    if (potionsLayer) {
      potionsLayer.objects.forEach((obj) => {
        const potion = this.potions.create(obj.x, obj.y - 16, "potionsheet");
        potion.setOrigin(0, 0).setScale(1);
        potion.body.setAllowGravity(false);
      });
    }

    // Enable overlap detection between player and potions
    this.physics.add.overlap(
      this.player,
      this.potions,
      this.collectPotion,
      null,
      this
    );

    // ---------------- Quest Item Group ----------------

    this.questItems = this.physics.add.group();

    // Load Quest Items from Tiled Object Layer
    const questLayer = map.getObjectLayer("questitem");
    if (questLayer) {
      questLayer.objects.forEach((obj) => {
        const questItem = this.questItems.create(
          obj.x,
          obj.y - 16,
          "questItemSheet"
        );


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
      questItems: 0, // Track collected quest items
    };

    // ---------------- Overlap Detection for Quest Items ----------------
    this.physics.add.overlap(
      this.player,
      this.questItems,
      this.collectQuestItem,
      null,
      this
    );

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


    // ---------------- RUBIS ----------------

    // Create Rubis group (not interactive)
    this.rubisGroup = this.physics.add.staticGroup();

    // Get Rubis objects from the Tiled map
    const rubisLayer = map.getObjectLayer("Rubis");
    if (rubisLayer) {
      rubisLayer.objects.forEach((obj) => {
        const rubis = this.rubisGroup.create(obj.x, obj.y - 16, "rubis"); // Adjust Y so it aligns properly
        rubis.setOrigin(0.5, 1); // Center horizontally, align bottom

        // Adjust hitbox size (customize these values)
        rubis.body.setSize(60, 100); // Width: 20px, Height: 40px (change as needed)
        rubis.body.setOffset(-14, -50); // Offset X: 10px, Offset Y: 10px (change as needed)

        // ✅ Add this line to move Rubis behind the player
        rubis.setDepth(-1); // Ensure it renders behind the player
      });
    }

    // Create a text object (hidden by default)
    this.rubisText = this.add.text(
      this.player.x,
      this.player.y - 30,
      "Un Rubis Ancien...", {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
        
      }
    );
    this.rubisText.setOrigin(0.5, 1);
    this.rubisText.setVisible(false); // Hide initially

    this.rubisSound = this.sound.add("rubisSound", {
      loop: true,
      volume: 0
    });
    this.rubisSoundPlaying = false; // Ensure it's not playing by default


    // ---------------- ENDING ----------------

    // ---------------- OLD ENDING ----------------
    //this.physics.add.overlap(this.player, this.rubisGroup, (player, rubis) => {
    //if (this.collectedQuestItems >= 3) {
    //this.triggerEnding();
    //}

    this.physics.add.overlap(this.player, this.rubisGroup, (player, rubis) => {
      if (this.collectedQuestItems >= 3 && this.attack) {

        console.log("✅ Ending triggered by gamepad!");
       this.triggerEnding();
      }

      // Show a message based on how many quest items have been collected
      let message = "Le rubis maudit...";
      if (this.collectedQuestItems > 0) {
        message = `Vous avez trouvé ${this.collectedQuestItems} morceaux de parchemin !`;
      }
      this.rubisText.setText(message);
      this.rubisText.setPosition(this.player.x, this.player.y - 30);
      this.rubisText.setVisible(true);

      // Hide text after 2 seconds
      this.time.delayedCall(2000, () => {
        this.rubisText.setVisible(false);
      });
    });

    // Create background layers with lower depth (behind everything)
    this.bg1 = this.add.image(0, 0, "bg1").setOrigin(0, 0).setDepth(-9);
    this.bg2 = this.add.image(0, 0, "bg2").setOrigin(0, 0).setDepth(-10);
    this.bg3 = this.add.image(0, 0, "bg3").setOrigin(0, 0).setDepth(-8);
    this.bg4 = this.add.image(0, 0, "bg4").setOrigin(0, 0).setDepth(-7);
    this.bg5 = this.add.image(0, 0, "bg5").setOrigin(0, 0).setDepth(-6);
    this.bg6 = this.add.image(0, 0, "bg6").setOrigin(0, 0).setDepth(-5);
    this.bg7 = this.add.image(0, 0, "bg7").setOrigin(0, 0).setDepth(-4);
    this.bg8 = this.add.image(0, 0, "bg8").setOrigin(0, 0).setDepth(-3);
    this.bg9 = this.add.image(0, 0, "bg9").setOrigin(0, 0).setDepth(-2);
    this.bg10 = this.add.image(0, 0, "bg10").setOrigin(0, 0).setDepth(-2);
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
    this.cameras.main.setBounds(
      0,
      0,
      this.physics.world.bounds.width,
      this.physics.world.bounds.height
    );

    // Attach backgrounds to camera movement
    this.cameras.main.startFollow(this.player, true);

    // Set Debug Graphics Depth
    this.debugGraphics.setDepth(15);

    // -------------------- 🎥 Camera Setup --------------------
    this.cameras.main.setZoom(3);
    this.cameras.main.startFollow(this.player, true, 0.05, 0.02);

    // -------------------- ❤️ Player Setup --------------------
    this.player.hp = 5;
    this.player.isInvulnerable = false;
    this.player.play("idle");

    // -------------------- Enemy HP Initialization --------------------
    this.enemies.children.iterate((enemy) => {
      enemy.hp = 3;
      enemy.isHit = false;
    });

    // Create floating text but keep it invisible initially
    this.questText = this.add
      .text(0, 0, "ssssswwwwfff", {
        fontFamily: "PixelFont", // Change this to any font you want
        fontSize: "16px",
        fill: "#ffffff",
        align: "center",
        stroke: "#000000", // Adds outline
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.hpBar = this.add
      .image(20, 20, "hp_5") // Start with full HP
      .setOrigin(0, 0) // Align to the top-left
      .setScale(0.2) // Adjust size
      .setScrollFactor(0) // Keep it static
      .setDepth(1000); // Ensure it's above everything

    this.collectedQuestItems = 0; // Tracks collected quest items

    // -------------- ATTACK HITBOX --------------
    this.attackHitboxes = this.physics.add.group();
    this.physics.add.overlap(
      this.attackHitboxes,
      this.enemies,
      (hitbox, enemy) => {
        console.log("hit");
        this.damageEnemy(enemy);
      },
      null,
      this
    );

    // -------------------- 🎮 Input Handling --------------------
    // Input Handling
    this.inputHandler = {
      cursors: this.input.keyboard.createCursorKeys(),
      keys: this.input.keyboard.addKeys({
        jump: Phaser.Input.Keyboard.KeyCodes.X,
        attack: Phaser.Input.Keyboard.KeyCodes.Z,
      }),
      gamepad: null,
    };

    console.log(
      "🎮 Gamepads Connected Count:",
      this.input.gamepad.gamepads.length
    );

    // Listen for gamepad connection
    this.input.gamepad.once("connected", (pad) => {
      this.inputHandler.gamepad = pad;
      console.log("🎮 Gamepad Connected:", pad.id);
    });





    // -------------------- KING MESSAGE --------------------
    // Add the starting image
    this.startScreen = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'texte_debut')
      .setOrigin(2.3, 0)
      .setScale(0.35)
      .setDepth(100) // Ensures it appears on top of everything
      .setAlpha(0); // Start invisible

    // Fade-in effect + move up slightly
    this.tweens.add({
      targets: this.startScreen,
      alpha: 1, // Fully visible
      y: this.cameras.main.centerY - 50, // Move up
      duration: 1000, // Fade-in & move-up duration (1 sec)
      ease: 'Linear'
    });
    // Prevent interaction before the cooldown is over
    this.canDismissImage = false;

    // Start a 3-second cooldown before the player can remove the image
    this.time.delayedCall(3000, () => {
      this.canDismissImage = true; // After 3 sec, allow image removal
    }, [], this);

    // Function to fade out + move down when attack is used
    const removeStartScreen = () => {
      if (this.canDismissImage) {
        this.tweens.add({
          targets: this.startScreen,
          alpha: 0, // Fade out smoothly
          y: this.cameras.main.centerY + 50, // Move down
          duration: 1000, // Fade-out & move-down duration (1 sec)
          ease: 'Linear',
          onComplete: () => {
            this.startScreen.destroy(); // Remove image after fade-out
          }
        });
      }
    };

    // Check attack input in the update loop
    this.input.keyboard.on('keydown-Z', removeStartScreen); // Z key (attack)
    this.events.on('update', () => {
      if (this.attack) { // If attack is triggered in your existing system
        removeStartScreen();
      }
    });

    // Keep gamepad support (even if it’s not working yet)
    this.input.gamepad.on('down', (pad, button) => {
      if (button.index === 1) { // Button 1 (attack)
        removeStartScreen();
      }
    });

    this.canDoubleJump = false; // Tracks if the player can double jump
    this.hasDoubleJumped = false; // Tracks if the double jump has been used


    this.cameras.main.fadeIn(2000); // 500ms fade-in effect

    this.gamepadbutton1 = false;
    this.gamepadbutton0 = false;

    this.endingTriggered = false;
    
    this.createSoundLists();

  }

  createSoundLists() {
    this.jumpSoundList = [];

    for(let i = 1; i <= 10; i++) {
      this.jumpSoundList.push(this.sound.add(`jumpSound_${i}`));
    }

    this.landingSoundList = [];

    for (let i = 1; i <= 10; i++) {
      this.landingSoundList.push(this.sound.add(`landingSound_${i}`))
    }

    this.swordSoundList = [];

    for (let i = 1; i <= 11; i++) {
      this.swordSoundList.push(this.sound.add(`swordSound_${i}`))
    }

    this.walkingSoundList = [];

    for (let i = 1; i <= 10; i++) {
      this.walkingSoundList.push(this.sound.add(`walkingSound_${i}`))
    }

    this.healthLostSoundList = [];

    for (let i = 1; i <= 10; i++) {
      this.healthLostSoundList.push(this.sound.add(`healthLost_${i}`))
    }

    this.healthUpSoundList = [];

    for (let i = 1; i <= 10; i++) {
      this.healthUpSoundList.push(this.sound.add(`healthUp_${i}`))
    }

    this.woundedMushroomSoundList = [];

    for (let i = 1; i <= 10; i++) {
      this.woundedMushroomSoundList.push(this.sound.add(`woundedMushroom_${i}`))
    }

    this.dyingMushroomSoundList = [];

    for (let i = 1; i <= 10; i++) {
      this.dyingMushroomSoundList.push(this.sound.add(`dyingMushroom_${i}`))
    }

    this.impactMushSoundList = [];

    for (let i = 1; i <= 10; i++) {
      this.impactMushSoundList.push(this.sound.add(`impactMush_${i}`))
    }

    this.parcheminSoundList = [];

    for (let i = 1; i <= 10; i++) {
      this.parcheminSoundList.push(this.sound.add(`parchemin_${i}`))
    }

    this.slimeSoundList = [];

    for (let i = 1; i <= 10; i++) {
      this.slimeSoundList.push(this.sound.add(`slime_${i}`))
    }
  }
  

  afficherTexteNpc() {
    if (!this.texteNpc.visible) {
      this.texteNpc.setVisible(true);
      console.log('texteNPC')
      // Optionnel : Retire l'image après quelques secondes
      this.time.delayedCall(3000, () => {
        this.texteNpc.setVisible(false);
      });
    }
  }



  removeStartScreen() {
    if (this.startScreen) {
      this.startScreen.destroy();
      this.startScreen = null;
    }
  }

  updateHealthBar() {
    let textureKey = `hp_${this.player.hp}`; // Select correct texture
    if (this.textures.exists(textureKey)) {
      this.hpBar.setTexture(textureKey);
    } else {
      console.warn("Missing HP texture:", textureKey);
    }
  }

  triggerEnding() {
    console.log("🎬 Ending triggered! Transitioning to Accueil...");

    if (this.endingTriggered) return;
    this.endingTriggered = true;
    this.playerCanMove = false;

        // Fade out effect
        this.cameras.main.fadeOut(1500, 0, 0, 0);

        this.rubisSound.stop();

        

        

    // Delay before switching to Accueil scene
    this.time.delayedCall(2000, () => {
      this.scene.start("Victoire");
      this.endingTriggered = false; // ✅ Reset flag when changing scene
    });
  }

  collectPotion(player, potion) {
    if (!potion.getData("collected") && player.hp < 5) {
      potion.setData("collected", true);
      potion.destroy(); // Remove from scene

      // Restore HP one by one, but not beyond max HP (5)
      player.hp++;
      this.updateHealthBar();
      this.playRandomhealthUpSound(0.4);
      // Play potion pickup sound
    }
  }

  /*
  collectPotion(player, potion) {
    if (!potion.getData("collected")) {
      potion.setData("collected", true);
      potion.destroy(); // Remove from scene

      
      // Restore HP one by one, but not beyond max HP (5)
      if (player.hp < 5) {
        player.hp++;
        this.updateHealthBar();
        this.sound.play("potionSound", {
          volume: 1.2
        }); // Play potion pickup sound
      }
    }
  }
  */

  collectQuestItem(player, item) {
    // ✅ Play quest pickup sound effect
    this.playRandomParcheminSound(0.1);

    item.destroy(); // Remove the item
    this.collectedQuestItems++; // Increment collected count
    console.log(`Quest Items Collected: ${this.collectedQuestItems}`);

    // Show floating text for each collected item
    let pickupText = this.add
      .text(this.player.x, this.player.y - 30, "+1 Morceau de parchemin", {
        fontFamily: "PixelFont",
        fontSize: "16px",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    this.time.delayedCall(1000, () => {
      pickupText.destroy();
    });

    // 🎯 Check if player has collected 3 items
    if (this.collectedQuestItems === 3) {
      this.time.delayedCall(2000, () => {
        // Delay before message appears
        this.showQuestCompleteText();
      });
    }
  }

  showQuestCompleteText() {
    let completionText = this.add
      .text(this.player.x, this.player.y - 50, "Vous avez tous les morceaux de parchemin", {
        fontFamily: "PixelFont",
        fontSize: "18px",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.time.delayedCall(3000, () => {
      completionText.destroy(); // Remove text after 3 seconds
    });
  }

  dealDamage(player) {
    if (!player.isInvulnerable) {
      player.hp--; // Reduce HP
      console.log(`Player HP: ${player.hp}`);

      // ✅ Play damage sound effect
      this.playRandomhealthLostSound(0.2)

      // ✅ Stop all animations and enforce the hit sprite
      player.play("player_hit", true);

      // ✅ Set invulnerability
      player.isInvulnerable = true;
      player.setTint(0xff0000);
      player.setVelocityX(0);
      player.setVelocityY(0);

      this.updateHealthBar();

      // ✅ Reset hitbox immediately upon hit
      player.body.setSize(20, 40);
      player.body.setOffset(40, 40);

      // ✅ Apply Knockback
      const knockbackDirection = player.flipX ? 100 : -100;
      player.setVelocityX(knockbackDirection);
      player.setVelocityY(-150); // Slightly stronger knockback

      // ⏳ **Maintain the hit animation for a set duration**
      this.time.delayedCall(1000, () => {
        player.clearTint();
      });



      if (this.player.hp > 0) {
        // 🎯 Le joueur est en vie : il devient invulnérable pendant 1 seconde
        this.player.isInvulnerable = true;
        this.time.delayedCall(1000, () => { // ⏳ 1 seconde d'invulnérabilité
          this.player.isInvulnerable = false;

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
      } else {
        // 💀 Le joueur est mort : invulnérabilité de 5 secondes
        this.player.isDead = true;
        this.player.setVelocity(0); // Empêcher tout mouvement
        this.player.anims.play("player_death", true);

        
        this.walkSound.stop();

        this.rubisSound.stop(); // Stop sound when too far
        
        

        this.player.isInvulnerable = true; // Empêche d'autres interactions

        this.enemies.getChildren().forEach(enemy => {
          enemy.setVelocityX(0); // Arrête le mouvement
          enemy.isAttacking = false; // Désactive l'attaque
          enemy.anims.play("enemy_idle", true); // Passe en animation idle (facultatif)
        });

        // 🖥️ Start fade-out effect when player dies
        this.cameras.main.fadeOut(3000, 0, 0, 0); // 1000ms duration, black fade

        this.time.delayedCall(3000, () => { // ⏳ 5 secondes d'invulnérabilité après la mortd
          this.scene.start("Mort"); // Redémarrage après 5s
        });
      }


    }
  }

  damageEnemy(enemy) {
    if (!enemy.isHit) {
      enemy.hp--; // Reduce enemy HP
      enemy.isHit = true; // Prevent rapid damage
      this.playRandomWoundedMushroomSound(0.2);

      console.log(`Enemy HP: ${enemy.hp}`);

      // ✅ If the enemy is already dead, do nothing
      if (enemy.hp <= 0 && !enemy.isDead) {
        enemy.isDead = true;
        this.playRandomDyingMushroomSound(0.001);
        this.playRandomImpactMushSound(0.1) 
        
        console.log("Enemy dies");

        // BUG

        // ✅ **Force Death Animation Immediately**
        enemy.anims.stop(); // Stops all current animations
        enemy.setVelocity(0); // Ensures the enemy stops moving

        // ✅ Remove hitbox & disable physics body
        enemy.body.setEnable(false);

        enemy.play("enemy_death", true); // Forces death animation
        this.play
        // ⏳ **Wait until animation is complete, then remove enemy**
        enemy.once("animationcomplete", () => {
          console.log("Enemy death animation done");
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

  updatePlayer() {
    // INPUTS
    // ------------------------------------------------------



    // Read existing movement inputs
    this.jump = false;
    this.attack = false;


    const {
      cursors,
      keys,
      gamepad
    } = this.inputHandler;

    // Movement: Left / Right (Keyboard or Gamepad)
    let moveLeft =
      cursors.left.isDown || (gamepad && gamepad.axes[0].getValue() < -0.5);
    let moveRight =
      cursors.right.isDown || (gamepad && gamepad.axes[0].getValue() > 0.5);

    // Jump: Use JustDown() for keyboard and check gamepad button (Button A = index 0)



    // MANAGE GAMEPAD BUTTON 0 JUST DOWN
    let gemePadButton0JustPressed = false;
    if (gamepad) {
      let buttonPressed = gamepad.buttons[0].pressed;
      if (buttonPressed && this.gamepadbutton0 == false) {
        gemePadButton0JustPressed = true;

      }
      this.gamepadbutton0 = buttonPressed;
    }


    // JUMP INPUT
    if (Phaser.Input.Keyboard.JustDown(keys.jump) || gemePadButton0JustPressed) {
      console.log("Jump input");
      this.jump = true;

    }

    if (this.playerCanMove == false) {
      moveLeft = 0;
      moveRight = 0;
      this.jump = false;
    }

    // MANAGE GAMEPAD BUTTON 1 JUST DOWN
    let gemePadButton1JustPressed = false;
    if (gamepad) {
      let buttonPressed = gamepad.buttons[1].pressed;
      if (buttonPressed && this.gamepadbutton1 == false) {
        console.log("just");
        gemePadButton1JustPressed = true;

      }
      this.gamepadbutton1 = buttonPressed;
    }

    // Attack: Use JustDown() for better control (Button B = index 1)
    if (Phaser.Input.Keyboard.JustDown(keys.attack) || gemePadButton1JustPressed) {

      this.attack = true;
      console.log("Attack input");
    }

    // If the player is not currently attacking
    if (this.player.anims.currentAnim.key !== "attack") {
      // MOVE
      // ------------------------------------------------------

      // Handle turnaround animation
      if (
        (moveLeft && this.lastDirection === "right") ||
        (moveRight && this.lastDirection === "left")
      ) {
        this.isTurning = true;
        this.player.setVelocityX(0);
        this.player.play("turnaround", true);
        this.player.once("animationcomplete", () => {
          this.isTurning = false;
          this.lastDirection = moveLeft ? "left" : "right";
        });
      }

      // Ensure a walk sound variable exists
      if (!this.walkSound) {
        this.walkSound = this.sound.add('walkSound');
        
      }

      // Handle movement (Allowing movement both on the ground and in the air)
      if (moveLeft || moveRight) {
        let speed = this.player.body.blocked.down ? 120 : 80;
        this.player.setVelocityX(moveLeft ? -speed : speed);
        this.player.flipX = moveLeft;
        this.lastDirection = moveLeft ? "left" : "right";
    
        if (this.player.body.blocked.down) {
            this.player.play("run", true);
    
            if (!this.walkSound || !this.walkSound.isPlaying) {
                this.playRandomWalkingSound(0.2); 
            }
        }
    } else {
        if (this.player.body.blocked.down) {
            this.player.setVelocityX(0);
            this.player.play("idle", true);
            if (this.walkSound && this.walkSound.isPlaying) {
                this.walkSound.stop();
            }
        }
    }
      // Keep hitbox aligned when idle
      this.player.body.setOffset(this.lastDirection === "left" ? 54 : 44, 40);

      // JUMP
      // ------------------------------------------------------

      // 🎵 **Stop walk sound when the player is in the air**
      if (!this.player.body.blocked.down && this.walkSound.isPlaying) {
        this.walkSound.stop();
      }

      // OLD Jumping logic
      /*
            // Jumping logic
            if (this.jump && this.player.body.blocked.down) {
              this.player.setVelocityY(-340);
              this.player.play("jump", true);
              console.log("Start jump animation");
              // Play jump sound effect
              this.sound.play("jumpSound", {
                volume: 1.5
              }); // Adjust volume if needed
            }
      */

      // JUMP LOGIC (SINGLE & DOUBLE JUMP)


      if (this.jump) {
        if (this.player.body.blocked.down) {
          // ✅ Normal Jump from Ground
          this.player.setVelocityY(-340);
          this.player.play("jump", true);
          this.playRandomJumpSound(0.2);

          this.canDoubleJump = true; // Allow double jump
          this.hasDoubleJumped = false; // Reset double jump flag
        } else if (this.canDoubleJump && !this.hasDoubleJumped) {
          // ✅ Double Jump in the Air
          this.player.setVelocityY(-300); // Slightly less force than first jump
          this.player.play("jump", true);
          //this.sound.play("jumpSound", {
          //  volume: 1.2
          //}); // Lower volume for second jump
          this.playRandomJumpSound(0.2);

          this.hasDoubleJumped = true; // Mark that double jump was used
        }
      }

      // LAND
      // ------------------------------------------------------



      // Track if the player was in the air before landing
      if (!this.player.body.blocked.down && this.player.body.velocity.y > 200) {
        this.wasInAir = true; // Mark that the player is falling
      }

      // Play landing sound only once when landing
      if (this.wasInAir && this.player.body.blocked.down) {
        if (!this.landedRecently) {
          // Prevent multiple triggers
          this.playRandomLandingSound(0.1);
          this.landedRecently = true;

          // Reset the flag after a short delay
          this.time.delayedCall(100, () => {
            this.landedRecently = false;
          });
        }

        this.wasInAir = false; // Reset air state
      }

      // **In-Between Jump/Fall Logic**
      if (
        this.player.body.velocity.y > 0 &&
        this.player.body.velocity.y < 200
      ) {
        this.player.play("jump_fall_transition", true);
      }
    }

    // ATTACK
    // ------------------------------------------------------
    //

    // Trigger Attack
    if (this.attack && this.canAttack) {

      if (this.physics.overlap(this.player, this.npcs)) {
        console.log("NPC");
        
        if(this.textNpcAnimationComplete == true){
          this.displayNpcText();
        }
      }else 
      if(this.physics.overlap(this.player, this.rubisGroup)){

      }
       else {
        console.log("Attack triggered");
        this.canAttack = false; // Prevent attacking again immediately
        this.isAttacking = true; // Set attack flag

        //this.sound.play("attackSound", {
          //volume: 1.5
        //}); // Adjust volume if needed
        this.playRandomSwordSound(1);
        this.player.setVelocityX(0); // Stop movement during attack

        // Reset attack ability after cooldown

        this.time.delayedCall(600, () => { // Adjust the delay as needed
          this.canAttack = true;
        });

        this.player.play("attack", true);
        // Wait until the attack animation completes before resetting attack flag
        this.player.once("animationcomplete", () => {
          this.isAttacking = false; // Reset attack flag

          this.player.play("idle", true); // Go back to idle
          console.log("Attack animation complete");
        });

        let offsetX = this.player.flipX ? -34 : 34; // Adjust for direction
        let hitbox = this.attackHitboxes.create(
          this.player.x + offsetX,
          this.player.y + 20,
          null
        );

        hitbox.setSize(46, 40); // Set hitbox size
        hitbox.setVisible(false); // Hide hitbox
        hitbox.body.allowGravity = false; // No gravity
        // Destroy hitbox after time
        this.time.delayedCall(300, () => {
          hitbox.destroy();
        });
      }

    }

    // MOVE HITBOXES SO THEY FOLLOW PLAYER
    this.attackHitboxes.children.iterate((hitbox) => {
      let offsetX = this.player.flipX ? -34 : 34; // Adjust for direction
      hitbox.setPosition(this.player.x + offsetX, this.player.y + 20);
    });

  }

  updateUI() {
    // Update UI
    this.hpBar.setPosition(890, 380);
    //console.log(this.player.x, this.player.y - 40);

    if (this.questTextFollow) {
      this.questText.setPosition(this.player.x, this.player.y - 30);
    }
  }


  updateCamera() {
    // CAMERA
    // ------------------------------------------------------

    let cameraX = this.cameras.main.scrollX;
    let cameraY = this.cameras.main.scrollY;

    const scrollX = this.cameras.main.scrollX;

    // Reverse the speed order so far layers move slower, close layers move faster
    const backgrounds = [
      this.bg1,
      this.bg2,
      this.bg3,
      this.bg4,
      this.bg5,
      this.bg6,
      this.bg7,
      this.bg8,
      this.bg9,
      this.bg10,
      this.bg11,
      this.bg12,
    ];

    // Adjust speeds: farther layers (bg1) move the slowest, closer (bg12) move fastest
    backgrounds.forEach((bg, index) => {
      const factor = 0.02 + (backgrounds.length - index) * 0.02; // Reverse order
      bg.x = scrollX * factor;
    });
  }

  // ENEMIES
  // ------------------------------------------------------
  updateEnnemies() {
    // Vérifier si le joueur est mort et arrêter les ennemis
    if (this.player.isDead) {
      this.enemies.children.iterate((enemy) => {
        enemy.setVelocityX(0);
        enemy.play("enemy_idle", true);

      });
      return; // Sortir de la fonction pour empêcher tout autre comportement
    }

    this.enemies.children.iterate((enemy) => {
      if (enemy.hp > 0) {
        const distanceToPlayer = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          enemy.x,
          enemy.y
        );

        if (enemy.isAttacking === undefined) {
          enemy.isAttacking = false;
        }

        if (
          distanceToPlayer < 30 &&
          !enemy.isAttacking &&
          !this.player.isInvulnerable
        ) {
          enemy.setVelocityX(0);
          enemy.isAttacking = true;
          enemy.play("enemy_attack", true);
          this.sound.play("mushroomAttack", {
            volume: 0.1
          });

          enemy.flipX = this.player.x > enemy.x;

          enemy.on("animationupdate", (anim, frame) => {
            if (
              frame.index >= 4 &&
              frame.index <= 7 &&
              !this.player.isInvulnerable
            ) {
              if (
                Phaser.Math.Distance.Between(
                  enemy.x,
                  enemy.y,
                  this.player.x,
                  this.player.y
                ) < 30
              ) {
                this.dealDamage(this.player);

                // Appliquer le knockback seulement si le joueur est vivant
                if (!this.player.isDead) {
                  const knockback = 50;
                  const direction = this.player.x < enemy.x ? -1 : 1;
                  this.player.setVelocityX(knockback * direction);
                } else {
                  // Arrêter totalement le mouvement du joueur après la mort
                  this.time.delayedCall(300, () => {
                    this.player.setVelocity(0, 0);
                  });
                }
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
      }
    });
  }


  //fonction de sauts aléatoires
  playRandomJumpSound(volume = 1) { 
    if (this.jumpSoundList.length === 0) {
      console.error('No jump sounds available!');
      return; // Exit if the sound list is empty
    }
    
    let randomJumpIndex = Phaser.Math.Between(0, this.jumpSoundList.length - 1); // Generate random index
    
    let sound = this.jumpSoundList[randomJumpIndex];
    
    if (!sound) {
      console.error('Sound at index ' + randomJumpIndex + ' is undefined');
      return; // Exit if the sound at the random index is undefined
    }
  
    sound.volume = volume; // Set volume
    sound.play(); // Play sound
  }

  playRandomLandingSound(volume = 1){
    if (this.landingSoundList.length === 0) {
      console.error('No jump sounds available!');
      return; // Exit if the sound list is empty
    }

    let randomLandingIndex = Phaser.Math.Between(0, this.landingSoundList.length - 1);

    let sound = this.landingSoundList[randomLandingIndex];

    sound.volume = volume; // Set volume
    sound.play(); // Play sound
  }

  playRandomSwordSound(volume = 1) {
    if (this.swordSoundList.length === 0) {
      console.error('No jump sounds available!');
      return; // Exit if the sound list is empty
    }

    let randomSwordIndex = Phaser.Math.Between(0, this.swordSoundList.length - 1);

    let sound = this.swordSoundList[randomSwordIndex];

    sound.volume = volume; // Set volume
    sound.play(); // Play sound
  }

  playRandomWalkingSound(volume = 1) {
    // Vérifie si la liste de sons est vide
    if (this.walkingSoundList.length === 0) {
      console.error('Aucun son de marche disponible!');
      return; // Quitte la fonction si la liste est vide
    }
  
    // Vérifie si un son est déjà en train de jouer, et l'arrête si nécessaire
    if (this.walkSound && this.walkSound.isPlaying) {
      this.walkSound.stop(); // Stoppe le son précédent s'il est en train de jouer
    }
  
    // Sélectionne un son aléatoire de la liste
    this.walkSound = this.walkingSoundList[Phaser.Math.Between(0, this.walkingSoundList.length - 1)];
  
    // Vérifie que le son sélectionné est valide
    if (!this.walkSound) {
      console.error('Le son sélectionné est indéfini.');
      return; // Quitte si le son est indéfini
    }
  
    // Applique le volume et joue le son
    this.walkSound.volume = volume;
    this.walkSound.play(); // Joue le son
  }

  playRandomhealthLostSound(volume = 1) {
    if (this.healthLostSoundList.length === 0) {
      console.error('No jump sounds available!');
      return; // Exit if the sound list is empty
    }

    let randomHealthLostIndex = Phaser.Math.Between(0, this.healthLostSoundList.length - 1);

    let sound = this.healthLostSoundList[randomHealthLostIndex];

    sound.volume = volume; // Set volume
    sound.play(); // Play sound
  }

  playRandomhealthUpSound(volume = 1) {
    if (this.healthUpSoundList.length === 0) {
      console.error('No jump sounds available!');
      return; // Exit if the sound list is empty
    }

    let randomHealthUpIndex = Phaser.Math.Between(0, this.healthUpSoundList.length - 1);

    let sound = this.healthUpSoundList[randomHealthUpIndex];

    sound.volume = volume; // Set volume
    sound.play(); // Play sound
  }

  playRandomWoundedMushroomSound(volume = 1) {
    if (this.woundedMushroomSoundList.length === 0) {
      console.error('No jump sounds available!');
      return; // Exit if the sound list is empty
    }

    let randomWoundedMushroomIndex = Phaser.Math.Between(0, this.woundedMushroomSoundList.length - 1);

    let sound = this.woundedMushroomSoundList[randomWoundedMushroomIndex];

    sound.volume = volume; // Set volume
    sound.play(); // Play sound
  }

  playRandomDyingMushroomSound(volume = 1) {
    if (this.dyingMushroomSoundList.length === 0) {
      console.error('No jump sounds available!');
      return; // Exit if the sound list is empty
    }

    let randomDyingMushroomIndex = Phaser.Math.Between(0, this.dyingMushroomSoundList.length - 1);

    let sound = this.dyingMushroomSoundList[randomDyingMushroomIndex];

    sound.volume = volume; // Set volume
    sound.play(); // Play sound
  }

  playRandomImpactMushSound(volume = 1) {
    if (this.impactMushSoundList.length === 0) {
      console.error('No jump sounds available!');
      return; // Exit if the sound list is empty
    }

    let randomImpactMushSoundIndex = Phaser.Math.Between(0, this.impactMushSoundList.length - 1);

    let sound = this.impactMushSoundList[randomImpactMushSoundIndex];

    sound.volume = volume; // Set volume
    sound.play(); // Play sound
  }

  playRandomParcheminSound(volume = 1) {
    if (this.parcheminSoundList.length === 0) {
      console.error('No jump sounds available!');
      return; // Exit if the sound list is empty
    }

    let randomParcheminSoundIndex = Phaser.Math.Between(0, this.parcheminSoundList.length - 1);

    let sound = this.parcheminSoundList[randomParcheminSoundIndex];

    sound.volume = volume; // Set volume
    sound.play(); // Play sound
  
  }

  playRandomSlimeSound(slime,volume = 1) {
    // Si le slime a déjà un son en cours, on n'en joue pas un autre
    if (slime.currentSound && slime.currentSound.isPlaying) {
        return;
    }

    // Sélectionne un son aléatoire dans la liste
    slime.currentSound = this.slimeSoundList[Phaser.Math.Between(0, this.slimeSoundList.length - 1)];

    // Joue le son
    slime.currentSound.play();

    // 🔥 Quand le son est terminé, appelle cette fonction pour enchaîner
    slime.currentSound.once('complete', () => {
        this.playRandomSlimeSound(slime); // Lance automatiquement le prochain son
    });
}




  update() {
    if (!this.player.isDead) this.updatePlayer();


    this.updateEnnemies();

    this.updateUI();

    this.updateCamera();


    if (this.inputHandler.gamepad == null) {
      if (this.input.gamepad.gamepads.length > 0) {
        this.inputHandler.gamepad = this.input.gamepad.gamepads[0];
        console.log("Added gamepad");
      }
    }

    // === 🎵 RUBIS SOUND LOGIC (FADE IN/OUT BASED ON DISTANCE) ===
    if (this.rubisGroup.getChildren().length > 0) {
      let rubis = this.rubisGroup.getChildren()[0]; // Get the first Rubis object
      let distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        rubis.x, rubis.y
      );

      let maxDistance = 600; // Maximum hearing range
      let minDistance = 50; // Closest distance for full volume

      // Calculate volume based on distance
      let volume = Phaser.Math.Clamp(1 - (distance - minDistance) / (maxDistance - minDistance), 0, 0.3);

      if (volume > 0) {
        if (!this.rubisSoundPlaying) {
          this.rubisSound.play(); // Start sound
          this.rubisSoundPlaying = true;
        }
        this.rubisSound.setVolume(volume);
      } else {
        if (this.rubisSoundPlaying) {
          this.rubisSound.stop(); // Stop sound when too far
          this.rubisSoundPlaying = false;
        }
      }
    }

    // === 🎵 SLIME SOUND LOGIC (FADE IN/OUT BASED ON DISTANCE) ===
    this.slimes.children.iterate((slime) => {
      if (!slime) return;
  
      let distance = Phaser.Math.Distance.Between(
          this.player.x, this.player.y,
          slime.x, slime.y
      );
  
      let maxDistance = 300; // Max hearing range
      let minDistance = 50; // Full volume range
  
      // Calcule le volume en fonction de la distance
      let volume = Phaser.Math.Clamp(1 - (distance - minDistance) / (maxDistance - minDistance), 0, 1);
  
      if (volume > 0) {
          // ✅ Lance le son uniquement s'il n'y en a pas déjà un en train de jouer
          if (!slime.currentSound || !slime.currentSound.isPlaying) {
              this.playRandomSlimeSound(slime);
          }
          
          // Ajuste le volume en fonction de la distance
          if (slime.currentSound) {
              slime.currentSound.setVolume(volume);
          }
      } else {
          // ✅ Si le slime est trop loin, arrête le son en cours
          if (slime.currentSound && slime.currentSound.isPlaying) {
              slime.currentSound.stop();
              slime.currentSound = null;
          }
      }
  });




  }
}