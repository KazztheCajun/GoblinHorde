class Weapon extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, scale)
    {
        super(scene, x, y, 'polearm');
        this.depth = 1;
        this.scale = scale;
        this.hitbox = scene.add.rectangle(x, y, 60, 7);
        this.hitbox.depth = 0;
        this.hitbox.scale = 2;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.add.existing(this.hitbox);
    }
}