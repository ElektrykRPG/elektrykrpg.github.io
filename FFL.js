var FFL = {
    preload: function(){
                 game.load.image("tileset_FFL", "assets/first_floor_left.png");
        game.load.tilemap("FFL", "assets/first_floor_left.csv");
    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("FFL","tileset_FFL",0,29);

        map.setTileLocationCallback(12, 12, 1, 2, function () {
            betweenMapChange = "fromLeftFF";
            game.state.start("GF");
        }, game);

        map.setTileLocationCallback(12, 15, 1, 2, function () {
            betweenMapChange = "fromLeftFF";
            game.state.start("SF");
        }, game);
        
         if(betweenMapChange == "fromLeftGF"){
            repeating.loadPlayer(896,828);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromLeftSF"){
            repeating.loadPlayer(896,1015);
            betweenMapChange = false;
        }
        else{
            repeating.loadPlayer(saveobj.positionX,saveobj.positionY);
        }

        controls = new repeating.controls();
        repeating.loadMolotovs();
        
        fpsText = game.add.text(20, 30, "CEL: " + saveobj.objective, {
        fill: "#FFFFFF",
        font:"18px 'Press Start 2P' "
        });
        fpsText.stroke = '#000000';
        fpsText.strokeThickness = 6;
        fpsText.fixedToCamera = true;
    },
    
    update: function () {      
        repeating.updateSaves();
        repeating.checkControls();
        game.physics.arcade.collide(player, layer, function(){});
    }

};