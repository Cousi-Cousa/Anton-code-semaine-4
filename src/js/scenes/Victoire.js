class Victoire extends Phaser.Scene {
    constructor() {
        super({ key: 'Victoire' });
    }

    preload() {
        this.load.image('btnMenu', './images/bouton-menu-principal.png');
    }

    create() {
        let graphics = this.add.graphics();
        graphics.fillStyle(0x78F6AF);
        graphics.fillRect(0, 0, 1400, 1000);

        const menuBtn = this.add.image(700, 400, 'btnMenu').setInteractive().setScale(0.5);
        menuBtn.on('pointerdown', () => this.scene.start('Accueil'));
    }
}
