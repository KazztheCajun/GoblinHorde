class PlayScene extends Phaser.Scene
{
    constructor()
    {
        super('play');
        this.winner = 'Top Score';
        this.width = 1200;
        this.height = 960;
        this.enemies = [];
    }

    preload()
    {
        this.load.path = 'assets/';
        this.load.image('background', 'FantasyTest.png');
        this.load.image('enemy', 'enemy.png');
        this.load.image('hitbox', 'hitbox.png');
        this.load.aseprite('player', 'player.png','player.json');
        this.load.aseprite('polearm', 'polearm.png', "polearm.json");
        this.load.aseprite('death', 'death.png', 'death.json');
        this.load.aseprite('goblin', 'goblin.png', 'goblin.json');
        this.load.audio('slice-effect', "slice.ogg");
        this.load.audio('smack-effect', "smack.ogg");
        this.load.audio('sadtown-music', "sadtown.ogg");
        this.load.audio('gameover-effect', "gameover.ogg");
        this.load.audio('mainbattle-music', "mainbattle.ogg");
        this.load.audio('destroy', 'destroy.ogg');
    }

    create()
    {
        this.anims.createFromAseprite('player');
        this.anims.createFromAseprite('polearm');
        this.anims.createFromAseprite('death');
        this.anims.createFromAseprite('goblin');
        this.slice = this.sound.add('slice-effect');
        this.smack = this.sound.add('smack-effect');
        this.music = this.sound.add('sadtown-music');
        this.ending = this.sound.add('gameover-effect');
        this.destroy = this.sound.add("destroy");
        this.player = new Player(this, this.width/2, this.height/2);
        this.player.play({key: `player-${this.player.animation}`,repeat: -1});
        this.player.weapon.play({key: `polearm-${this.player.animation}`,repeat: -1});
        this.createMap();
        this.createObjectPool();
        this.setupPhysics();
        this.setupHUD();

        let bgmusic = {
            mute: false,
            volume: .75,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }

        this.music.play(bgmusic);
    }

    createMap()
    {
        let i = this.add.image(1200/2, 960/2, 'background');
        i.scale = 1.5;
    }

    createObjectPool()
    {
        while(this.enemies.length < 15)
        {
            let monster = new Enemy(this, 0, 0, "goblin");
            this.enemies.push(monster);
        }

        // use event to spawn enemies from pool
        let event = new Object();
        event.delay = Phaser.Math.Between(400, 800);
        event.callback = this.spawnEnemy;
        event.callbackScope = this;
        event.loop = true;
        this.time.addEvent(event, this);
    }

    setupPhysics()
    {
        this.physics.add.overlap(this.player.hitbox, this.enemies, this.hitPlayer, null, this);
        this.physics.add.overlap(this.player.weapon.hitbox, this.enemies, this.hitEnemy, null, this);
    }

    setupHUD()
    {
        this.score = 0;
        this.topScore = 20;
        this.elapsedTime = 0;
        this.score_text = document.getElementById("score-field");
        this.topScore_text = document.getElementById("top-score-field");
        this.lives_text = document.getElementById('lives-field');
    }

    spawnEnemy()
    {
        let dead = this.enemies.filter(e => e.state == 'dead')
        if (dead.length > 1)
        {
            dead[Phaser.Math.Between(0, (dead.length - 1))].spawn(Phaser.Math.Between(0, 100), Phaser.Math.Between(200, this.height-250));
        }
        else if (dead.length == 1)
        {
            dead[0].spawn(Phaser.Math.Between(0, 200), Phaser.Math.Between(10, this.height));
        }
    }

    update(time)
    {
        if (this.player.state != 'dead')
        {
            this.elapsedTime = time;
            this.player.update(time);
            for(let e of this.enemies)
            {
                e.update(time);
            }
            if (this.player.state == 'dead')
            {
                this.physics.pause();
                this.player.weapon.setVisible(false);
                this.player.play({key: `death`, repeat: -1})
                this.gameover();
            }
        }
        this.updateHUD();
    }

    hitEnemy(weapon, enemy)
    {
        if (this.player.attacking && enemy.state == 'alive')
        {
            enemy.death();
            this.score += 1;
            this.slice.play();
        //    console.log("Enemy Struck");
        }
    }

    hitPlayer(player, enemy)
    {
        if(enemy.state == 'alive' && this.player.hitBuffer > 90 && this.physics.overlap(player, enemy.hitbox, null, null, this))
        {
            this.player.lives--;
            this.player.hitBuffer = 0;
            this.smack.play();
        //    console.log("Player Hit");
        }
    }

    updateHUD()
    {
        this.score_text.innerHTML = `${this.score}`;
        if (this.score > this.topScore)
        {
            this.topScore = this.score;
        }
        this.topScore_text.innerHTML = `${this.topScore}`;
        switch (this.player.lives)
        {
            case 6: // 6 full 
                this.lives_text.innerHTML = '<i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart-fill"></i>'
                break;
            case 5: // 5 full | 1 empty
                this.lives_text.innerHTML = '<i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart"></i>'
                break;
            case 4: // 4 full | 2 empty
                this.lives_text.innerHTML = '<i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart"></i><i class="h1 bi-suit-heart"></i>'
                break;
            case 3: // 3 full | 3 empty
                this.lives_text.innerHTML = '<i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart"></i><i class="h1 bi-suit-heart"></i><i class="h1 bi-suit-heart"></i>'
                break;
            case 2: // 2 full | 4 empty
                this.lives_text.innerHTML = '<i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart"></i><i class="h1 bi-suit-heart"></i><i class="h1 bi-suit-heart"></i><i class="h1 bi-suit-heart"></i>'
                break;
            case 1: // 1 full | 5 empty
                this.lives_text.innerHTML = '<i class="h1 bi-suit-heart-fill"></i><i class="h1 bi-suit-heart"></i><i class="h1 bi-suit-heart"></i><i class="h1 bi-suit-heart"></i><i class="h1 bi-suit-heart"></i><i class="h1 bi-suit-heart"></i>'
                break;
            default: // 0 full | 6 empty
                this.lives_text.innerHTML = '<i class="h1 bi-suit-heart"></i><i class="h1 bi-suit-heart"></i><i class="h1 bi-suit-heart"></i><i class="h1 bi-suit-heart"></i><i class="h1 bi-suit-heart"></i><i class="h1 bi-suit-heart"></i>'    
        }
    }

    gameover()
    {
        this.music.stop();
        let seconds = Math.floor((this.elapsedTime / 1000) % 60);
        let minutes = Math.floor(this.elapsedTime / 6000);
        document.getElementById("kill-field").innerHTML = `${this.score}`;
        document.getElementById("time-field").innerHTML = `${minutes} minutes and ${seconds} seconds!`
        document.getElementById("backdrop").style.display = "block";
        document.getElementById("gameover-modal").style.display = "block";
        document.getElementById("gameover-modal").className = document.getElementById("gameover-modal").className.replace("none", "show");
        this.ending.play();
    }

}