var FFR = {
        preload: function(){
    game.load.tilemap("FFR", "assets/first_floor_right.csv");
        game.load.image("tileset_FFR", "assets/first_floor_right.png");

    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("FFR","tileset_FFR",0,29);

        map.setTileLocationCallback(18,2, 1, 1, function(){
            betweenMapChange = true;
          game.state.start("Level1");}, game);
        
        map.setTileLocationCallback(20,5, 1, 2, function(){
            betweenMapChange = "fromRightFF";
          game.state.start("GF");}, game);
        
        map.setTileLocationCallback(20,7, 1, 2, function(){
            betweenMapChange = "fromRightFF";
          game.state.start("SF");}, game);
        
        map.setTileLocationCallback(7,36, 2, 1, function(){
            betweenMapChange = "fromDownFF";
          game.state.start("GF");}, game);
        
        map.setTileLocationCallback(9,36, 2, 1, function(){
            betweenMapChange = "fromDownFF";
          game.state.start("SF");}, game);
        
        if(betweenMapChange == "fromLechu"){
            repeating.loadPlayer(1102,150);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromRightSF"){
            repeating.loadPlayer(1239,495);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromDownSF"){
            repeating.loadPlayer(615,2200);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromRightGF"){
            repeating.loadPlayer(1239,379);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromDownGF"){
            repeating.loadPlayer(540,2237);
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