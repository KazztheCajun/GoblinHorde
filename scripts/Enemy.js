class Enemy extends Entity
{
    constructor(scene, x, y, type)
    {
        super(scene, 2, 0, {x: x, y: y}, type);
        //this.body.velocity.x = Phaser.Math.Between(120, 300);
        this.flipX = true;
        this.hitbox.flipX = true;
        this.state = 'dead';
        this.play({key: 'goblin-walk', repeat:-1});
        this.reset();
    }

    update(time)
    {
        this.hitbox.x = this.x+3;
        this.hitbox.y = this.y+9;

        if (this.x > this.scene.width + 50)
        {
            this.reset();
            this.scene.player.lives--;
            this.scene.destroy.play();
        }
    }

    spawn(x, y)
    {
        this.state = 'alive';
        this.x = x;
        this.y = y;
        this.hitbox.x = x;
        this.hitbox.y = y;
        this.body.velocity.x = Phaser.Math.Between(120, 300);
        this.play({key: 'goblin-walk', repeat:-1});
        this.setActive(true);
        this.setVisible(true);
    }
    
    death()
    {
        this.state = 'dying';
        this.body.velocity.x = 0;
        this.play({key: `death`, repeat: 0});
        this.on('animationcomplete', this.reset);
    }

    reset()
    {
        this.setActive(false);
        this.setVisible(false);
        this.x = 0;
        this.y = 0;
        this.body.velocity.x = 0;
        this.state = 'dead';
    }
}