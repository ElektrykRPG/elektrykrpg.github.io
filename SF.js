var SF = {
    preload: function(){
                game.load.image("tileset_SF", "assets/second_floor.png");
        game.load.tilemap("SF", "assets/second_floor.csv");
    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("SF","tileset_SF",0,32);

        map.setTileLocationCallback(39, 9, 1, 2, function () {
            betweenMapChange = "fromRightSF";
            game.state.start("FFR");
        }, game);

        map.setTileLocationCallback(3, 1, 1, 2, function () {
            betweenMapChange = "fromLeftSF";
            game.state.start("FFL");
        }, game);

        map.setTileLocationCallback(26, 40, 2, 1, function () {
            betweenMapChange = "fromDownSF";
            game.state.start("FFR");
        }, game);
        
         if(betweenMapChange == "fromRightFF"){
            repeating.loadPlayer(2442,619);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromLeftFF"){
            repeating.loadPlayer(317,145);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromDownFF"){
            repeating.loadPlayer(1742,2476);
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