var game = null;

const start = async () =>
{
    let config = {};
    config.width = 800*1.5;
    config.height = 640*1.5;
    config.scene = [PlayScene];
    config.physics = {default:'arcade'};
    config.parent = "canvas-box";
    game = new Phaser.Game(config);
}

// handler for starting the app
window.addEventListener("load", start);