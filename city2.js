var city2 = {
        preload: function(){
          game.load.image("tileset_city2", "assets/city2.png");
        game.load.tilemap("city2", "assets/city2.csv");
        
    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("city2","tileset_city2",0,79);

     map.setTileLocationCallback(107, 4, 1, 3, function () {
            betweenMapChange = "fromCity2";
            game.state.start("city1");
        }, game);
        
        map.setTileLocationCallback(5, 3, 3, 1, function () {
            betweenMapChange = "fromCity2";
            game.state.start("bodrum");
        }, game);
        
         if(betweenMapChange == "fromCity1"){
            repeating.loadPlayer(6775,346);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromBodrum"){
            repeating.loadPlayer(418,334);
            betweenMapChange = false; 
        }
        else if(betweenMapChange == "toBodrum"){
            repeating.loadPlayer(693,313);
            betweenMapChange = false; 
        }
        else{
            repeating.loadPlayer(saveobj.positionX,saveobj.positionY);
        }

          if(saveobj.quotes.flags.bikePosition == "bodrum"){
            map.putTile(24,12,4);
            map.putTile(32,12,5);
            map.setTileLocationCallback(12, 4, 1, 2, function () {
        
            repeating.addLowerOption(
                                "Dokad chcesz pojechac?",
                                  "ELEKTRYK",
                                  "HAYATI",
                                  function () {
                                      var xd = localStorage.getObject(saveName);
                                       xd.quotes.flags.bikePosition = "";
                                       localStorage.setObject(saveName, xd);
                                      
                                       betweenMapChange = "toOutsideElektryk";
                                       game.state.start("outsideElektryk");
                                  },
                                 function () {
                                       var xd = localStorage.getObject(saveName);
                                       xd.quotes.flags.bikePosition = "hayati";
                                       localStorage.setObject(saveName, xd);
                                     
                                     betweenMapChange = "toHayati";
                                       game.state.start("city1");
                                  }
            );
        }, game);
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