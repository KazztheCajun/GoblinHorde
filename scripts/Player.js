class Player extends Entity
{
    constructor(scene, x, y)
    {
        super(scene, 2, 300, {x: x, y: y}, 'player');
        this.weapon = new Weapon(scene, x, y, this.scale); 
        this.attacking = false; 
        this.jumping = false;
        this.buttons = scene.input.keyboard.addKeys('up,down,left,right,space');
        this.offsetX = 27;
        this.offsetY = 19;
        this.lives = 6;
        this.setCollideWorldBounds(true);
        this.hitBuffer = 90;
    }

    update(time)
    {
        let last = this.animation;
        let was = this.attacking;
        this.hitBuffer++;
        this.updateState(time);
        this.updateView(last, was);
    }

    updateState(time)
    {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.animation = 'idle';

        if (time - this.lastSwing > 490)
        {
            this.attacking = false;
        }

        if (this.buttons.up.isDown)
        {
            this.body.velocity.y = -this.speed;
            this.animation = 'walk';
        }
        if (this.buttons.down.isDown)
        {
            this.body.velocity.y = this.speed;
            this.animation = 'walk';
        }
        if (this.buttons.left.isDown)
        {
            this.body.velocity.x = -this.speed;
            this.flipX = false;
            this.animation = 'walk';
        }
        if (this.buttons.right.isDown)
        {
            this.body.velocity.x = this.speed;
            this.flipX = true;
            this.animation = 'walk';
        }
        if(this.buttons.space.isDown && !this.attacking)
        {
            this.attacking = true;
            this.lastSwing = time;
        }
        if (this.lives <= 0)
        {
            this.state = 'dead';
        }
    }

    updateView(lastAnimation, wasAttacking)
    {
        this.hitbox.flipX = this.flipX;
        this.weapon.flipX = this.flipX;
        this.weapon.hitbox.flipX = this.flipX;
        if (this.flipX)
        {
            this.weapon.x = this.x+this.offsetX;
            this.weapon.y = this.y-this.offsetY;
            this.hitbox.x = this.x-8;
            this.hitbox.y = this.y+5;
        }
        else
        {
            this.weapon.x = this.x-this.offsetX;
            this.weapon.y = this.y-this.offsetY;
            this.hitbox.x = this.x+8;
            this.hitbox.y = this.y+5;
        }
        this.weapon.hitbox.x = this.weapon.x;
        this.weapon.hitbox.y = this.weapon.y+38;
        
        if (lastAnimation != this.animation)
        {
            if (!wasAttacking && !this.attacking)
            {
                this.weapon.play({key: `polearm-${this.animation}`,repeat: -1});
            }
            this.play({key: `player-${this.animation}`,repeat: -1});
        }
        if (!wasAttacking && this.attacking)
        {
            this.weapon.play({key: `polearm-attack`,repeat: -1});
        }
        if (wasAttacking && !this.attacking)
        {
            this.play({key: `player-${this.animation}`,repeat: -1});
            this.weapon.play({key: `polearm-${this.animation}`,repeat: -1});
        }
    }
}