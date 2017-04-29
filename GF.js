var GF = {
    preload: function(){
               game.load.image("tileset_GF", "assets/ground_floor.png");
        game.load.tilemap("GF", "assets/ground_floor.csv");
    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("GF","tileset_GF",0,39);

       map.setTileLocationCallback(3, 18, 1, 2, function () {
            betweenMapChange = "fromLeftGF";
            game.state.start("FFL");
        }, game);

        map.setTileLocationCallback(39, 25, 1, 2, function () {
            betweenMapChange = "fromRightGF";
            game.state.start("FFR");
        }, game);

        map.setTileLocationCallback(28, 54, 2, 1, function () {
            betweenMapChange = "fromDownGF";
            game.state.start("FFR");
        }, game);
        
        map.setTileLocationCallback(26, 54, 2, 1, function () {
          betweenMapChange = "fromFrontElektryk";
          game.state.start("outsideElektryk");
        }, game);
        
         if(betweenMapChange == "fromLeftFF"){
            repeating.loadPlayer(326,1211);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromRightFF"){
            repeating.loadPlayer(2425,1648);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromDownFF"){
            repeating.loadPlayer(1861,3355);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromOutsideElektryk"){
            repeating.loadPlayer(1755,3394);
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