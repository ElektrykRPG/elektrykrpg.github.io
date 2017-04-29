var outsideElektryk = {
    preload: function(){
        game.load.image("tileset_outsideElektryk", "assets/outsideElektryk.png");
        game.load.tilemap("outsideElektryk", "assets/outsideElektryk.csv");
    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("outsideElektryk","tileset_outsideElektryk",0,33);

     map.setTileLocationCallback(8, 2, 2, 1, function () {
            betweenMapChange = "fromOutsideElektryk";
            game.state.start("GF");
        }, game);

     map.setTileLocationCallback(20, 2, 1, 2, function () {
        
            repeating.addLowerOption(
                                "Dokad chcesz pojechac?",
                                  "HAYATI",
                                  "BODRUM",
                                  function () {
                                      var xd = localStorage.getObject(saveName);
                                       xd.quotes.flags.bikePosition = "hayati";
                                       localStorage.setObject(saveName, xd);
                                      
                                       betweenMapChange = "toHayati";
                                       game.state.start("city1");
                                  },
                                 function () {
                                       var xd = localStorage.getObject(saveName);
                                       xd.quotes.flags.bikePosition = "bodrum";
                                       localStorage.setObject(saveName, xd);
                                     
                                     betweenMapChange = "toBodrum";
                                       game.state.start("city2");
                                  }
            );
        }, game);
        
         if(betweenMapChange == "fromFrontElektryk"){
            repeating.loadPlayer(589,247);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "toOutsideElektryk"){
            repeating.loadPlayer(1210,193);
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