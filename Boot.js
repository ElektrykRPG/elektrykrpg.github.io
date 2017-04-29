var Boot = {
    preload: function () {
        this.load.image("preloaderBar", "assets/titlescreen.png");
    },
    create: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.time.advancedTiming = true;
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;
        game.stage.backgroundColor = "#fff";
        game.stage.smoothed = false;
        game.antialias = false;
        
        Storage.prototype.setObject = function(key, value) {
        this.setItem(key, JSON.stringify(value));
        }
        Storage.prototype.getObject = function(key) {
        var value = this.getItem(key);
        return value && JSON.parse(value);
        }
        
        
        game.state.start("Preloader");
    }
};