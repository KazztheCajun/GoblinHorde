class Entity extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, scale, speed, pos, type)
    {
        super(scene, pos.x, pos.y, type);
        this.depth = 1;
        this.speed = speed;
        this.scale = scale;
        this.animation ='idle'; 
        this.state = 'alive';
        this.hitbox = scene.add.ellipse(pos.x, pos.y, 18, 21);
        this.hitbox.depth = 1;
        this.hitbox.scale = 2;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.add.existing(this.hitbox);
    }
}