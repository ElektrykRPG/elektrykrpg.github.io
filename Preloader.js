var preloadBar = null;

var Preloader = {
    preload: function () {
        game.preloadBar = game.add.sprite(game.world.centerX, game.world.centerY, "preloaderBar");
        game.preloadBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(game.preloadBar);
        
        game.load.image("nut", "assets/nut.png");
        game.load.spritesheet("player", "assets/player.png", 48, 62.5);
        
        game.load.image("lowerBar", "assets/lowerMenu.png");
        game.load.image("fullMenu", "assets/fullMenu.png");
        game.load.spritesheet("button", "assets/button.png",74,43);
        game.load.image("titlescreen", "assets/titlescreen.png");
        
        
        game.load.spritesheet("uczen1", "assets/uczen1.png", 50, 59);
        game.load.image("uczen1Head", "assets/uczen1_head.png");
        game.load.spritesheet("uczen2", "assets/uczen2.png", 50, 59);
        game.load.image("uczen2Head", "assets/uczen2_head.png");
    },
    create: function () {
        game.state.start("MainMenu");
    }

};