var Level1 = {
preload: function(){
       game.load.tilemap("map", "assets/lechuroom.csv");
         game.load.image("tileset_lechuroom", "assets/lechu_room_tileset.png");
    game.load.spritesheet("lechu", "assets/lechu.png", 50, 59);
    game.load.image("lechuHead", "assets/lechu_head.png");
    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("map","tileset_lechuroom",0,11);
        map.setTileIndexCallback(2, function(){
            betweenMapChange = "fromLechu";
            game.state.start("FFR");}, game);
        
        lechu = game.add.sprite(290,97,"lechu");
        game.physics.arcade.enable(lechu);
        lechu.anchor.setTo(0.5, 0.5);
        lechu.enableBody = true;
        lechu.body.immovable = true;
        
        if(betweenMapChange == true){
            repeating.loadPlayer(672,920);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromDead"){
            repeating.loadPlayer(477,340);
            betweenMapChange = false;
        }
        else{
            repeating.loadPlayer(saveobj.positionX,saveobj.positionY);
        }
        
        controls = new repeating.controls();

       repeating.loadMolotovs();
        
        fpsText = game.add.text(20, 30, "CEL: " + saveobj.objective, {
       fill: "#FFFFFF",
       font: "18px 'Press Start 2P' "
       });
       fpsText.stroke = '#000000';
       fpsText.strokeThickness = 6;
       fpsText.fixedToCamera = true;
    },
    update: function () {
        repeating.updateSaves();
        repeating.checkControls();
        game.physics.arcade.collide(player, layer, function(){});
        
       game.physics.arcade.collide(player, lechu, function (arg1, arg2) {
           
           repeating.addLowerChat(
                                quotes.lechu.start,
                                  "Lechu",
                                  "lechuHead",
                                  lechu, 
                                  arg1, 
                                  arg2, 
                                  localStorage.getObject(saveName).quotes.lechu.start,
                                  function () {
                                       var xd = localStorage.getObject(saveName);
                                       xd.objective = "Dolacz do dowolnej frakcji";
                                      xd.quotes.lechu.start = true;
                                      xd.money += 10;
                                       localStorage.setObject(saveName, xd);
                                       fpsText.text = "CEL: Dolacz do dowolnej frakcji";
                                      repeating.addLowerText("Dostales: 10zl!");
                                  });
           
       });
     //   fpsText.text = "FPS: " + game.time.fps + " XY: " + game.input.x + "," + game.input.y;

    },
};