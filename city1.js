var uczen1,uczen2;

var city1 = {
    preload: function(){
         game.load.image("tileset_city1", "assets/city1.png");
        game.load.tilemap("city1", "assets/city1.csv");
    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("city1","tileset_city1",0,139);

     map.setTileLocationCallback(49, 17, 3, 1, function () {
            betweenMapChange = "fromCity1";
            game.state.start("city2");
        }, game);
        
        map.setTileLocationCallback(77, 11, 2, 1, function () {
            betweenMapChange = "fromCity1Right";
            game.state.start("hayati");
        }, game);

        map.setTileLocationCallback(70, 11, 2, 1, function () {
             if(saveobj.boughtHayatiLeft){
        betweenMapChange = "fromCity1Left";
        game.state.start("hayati");
             }
            else{
                //dialog z kupnem
            }
    }, game); 
        
     

    //    map.setTileLocationCallback(20, 2, 2, 2, function () {
     //       betweenMapChange = "fromOutsideElektryk";
     //       game.state.start("city1");
     //   }, game);
        
         if(betweenMapChange == "fromCity2"){
            repeating.loadPlayer(3235,1030);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromHayatiLeft"){
            repeating.loadPlayer(4572,822);
            betweenMapChange = false;
        }
         else if(betweenMapChange == "fromHayatiRight"){
            repeating.loadPlayer(5009,809);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "toHayati"){
            repeating.loadPlayer(4723,815);
            betweenMapChange = false;
        }
        else{
            repeating.loadPlayer(saveobj.positionX,saveobj.positionY);
        }
        
        if(saveobj.quotes.flags.bikePosition == "hayati"){
            map.putTile(24,75,12);
            map.putTile(32,75,13);
            map.setTileLocationCallback(75, 12, 1, 2, function () {
        
            repeating.addLowerOption(
                                "Dokad chcesz pojechac?",
                                  "ELEKTRYK",
                                  "BODRUM",
                                  function () {
                                      var xd = localStorage.getObject(saveName);
                                       xd.quotes.flags.bikePosition = "";
                                       localStorage.setObject(saveName, xd);
                                      
                                       betweenMapChange = "toOutsideElektryk";
                                       game.state.start("outsideElektryk");
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
        }
        if(!saveobj.quotes.flags.uczen1Defeated){
            uczen1 = game.add.sprite(361, 607, "uczen1");
            game.physics.arcade.enable(uczen1);
            uczen1.anchor.setTo(0.5, 0.5);
            uczen1.enableBody = true;
            uczen1.body.immovable = true;
            uczen1.frame = 3;
        }
          if(!saveobj.quotes.flags.uczen2Defeated){
             uczen2 = game.add.sprite(104, 666, "uczen2");
            game.physics.arcade.enable(uczen2);
            uczen2.anchor.setTo(0.5, 0.5);
            uczen2.enableBody = true;
            uczen2.body.immovable = true;
        uczen2.frame = 2;
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
        game.physics.arcade.collide(player, layer);
        
        game.physics.arcade.collide(player, uczen1, function (arg1, arg2) {
                        var saveobj = localStorage.getObject(saveName);
                        if (!saveobj.quotes.flags.uczen1Defeated && saveobj.faction) {
                            repeating.addLowerChat(
                                quotes.uczen1.start,
                                "Uczen",
                                "uczen1Head",
                                uczen1,
                                arg1,
                                arg2,
                                localStorage.getObject(saveName).quotes.uczen1.start,
                                function () {

                                       repeating.addBattle("uczen1","Uczen",30,5,function(){
                                           repeating.addLowerChat(quotes.uczen1.afterFight,
                       "Uczen",
                       "uczen1Head",
                       uczen1,
                       arg1,
                       arg2,
                       localStorage.getObject(saveName).quotes.uczen1.afterFight,
                       function () {});
                                           
                                                        var xd = localStorage.getObject(saveName);
                                           xd.quotes.flags.uczen1Defeated = true;
                                        if(xd.quotes.flags.uczen1Defeated && xd.quotes.flags.uczen2Defeated && xd.faction == "hayati"){
                                            xd.objective = "Wroc do Hayati";
                                        }
                                        else if(xd.quotes.flags.uczen1Defeated && xd.quotes.flags.uczen2Defeated && xd.faction == "bodrum"){
                                            xd.objective = "Wroc do Bodruma";
                                        }
                                            fpsText.text = "CEL: " + xd.objective;
                                            localStorage.setObject(saveName, xd);
                                       });

                                }

                            );


                        }
                    });
        
         game.physics.arcade.collide(player, uczen2, function (arg1, arg2) {
                        var saveobj = localStorage.getObject(saveName);
                        if (!saveobj.quotes.flags.uczen2Defeated && saveobj.faction) {
                            repeating.addLowerChat(
                                quotes.uczen2.start,
                                "Uczen",
                                "uczen2Head",
                                uczen2,
                                arg1,
                                arg2,
                                localStorage.getObject(saveName).quotes.uczen2.start,
                                function () {

                                       repeating.addBattle("uczen2","Uczen",30,5,function(){
                                           repeating.addLowerChat(quotes.uczen2.afterFight,
                       "Uczen",
                       "uczen2Head",
                       uczen2,
                       arg1,
                       arg2,
                       localStorage.getObject(saveName).quotes.uczen2.afterFight,
                       function () {});
                                                        var xd = localStorage.getObject(saveName);
                                           xd.quotes.flags.uczen2Defeated = true;
                                        if(xd.quotes.flags.uczen1Defeated && xd.quotes.flags.uczen2Defeated && xd.faction == "hayati"){
                                            xd.objective = "Wroc do Hayati";
                                        }
                                        else if(xd.quotes.flags.uczen1Defeated && xd.quotes.flags.uczen2Defeated && xd.faction == "bodrum"){
                                            xd.objective = "Wroc do Bodruma";
                                        }
                                            fpsText.text = "CEL: " + xd.objective;
                                            localStorage.setObject(saveName, xd);
                                       });

                                }

                            );


                        }
                    });
        
    }

};