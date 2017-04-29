var bodrum = {
    preload: function(){
        game.load.image("tileset_bodrum", "assets/bodrum.png");
        game.load.tilemap("bodrum", "assets/bodrum.csv");
        game.load.spritesheet("szef", "assets/szef.png", 50, 59);
        game.load.image("szefHead", "assets/szef_head.png");
    },
        create: function () {

            var saveobj = localStorage.getObject(saveName);
            repeating.loadMap("bodrum", "tileset_bodrum", 0, 28);

            map.setTileLocationCallback(5, 13, 3, 1, function () {
                            betweenMapChange = "fromBodrum";
                            game.state.start("city2");
                        }, game);
            map.setTileLocationCallback(9, 7, 1, 2, function () {
                        repeating.addShop("bodrum",player.x - 15,player.y);
                    }, game);
            
            if (betweenMapChange == "fromCity2") {
                repeating.loadPlayer(418, 759);
                betweenMapChange = false;
            }
            else {
                repeating.loadPlayer(saveobj.positionX, saveobj.positionY);
            }

            lechu = game.add.sprite(550, 642, "szef");
            game.physics.arcade.enable(lechu);
            lechu.anchor.setTo(0.5, 0.5);
            lechu.enableBody = true;
            lechu.body.immovable = true;
            lechu.frame = 1;
            
            if(saveobj.quotes.flags.uczen1Defeated && saveobj.faction == "bodrum"){
            var uczen1 = game.add.sprite(150, 665, "uczen1");
            game.physics.arcade.enable(uczen1);
            uczen1.anchor.setTo(0.5, 0.5);
            uczen1.enableBody = true;
            uczen1.body.immovable = true;
            uczen1.frame = 0;
        }
          if(saveobj.quotes.flags.uczen2Defeated && saveobj.faction == "bodrum"){
            var uczen2 = game.add.sprite(400, 280, "uczen2");
            game.physics.arcade.enable(uczen2);
            uczen2.anchor.setTo(0.5, 0.5);
            uczen2.enableBody = true;
            uczen2.body.immovable = true;
        uczen2.frame = 0;
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
                game.physics.arcade.collide(player, layer);
                game.physics.arcade.collide(player, lechu, function (arg1, arg2) {
                        var saveobj = localStorage.getObject(saveName);
                        if (saveobj.objective === "Dolacz do dowolnej frakcji") {
                            repeating.addLowerChat(
                                quotes.szef.start,
                                "Szef",
                                "szefHead",
                                lechu,
                                arg1,
                                arg2,
                                localStorage.getObject(saveName).quotes.szef.start,
                                function () {

                                    repeating.addLowerOption(
                                        "Czy chcesz dolaczyc do frakcji Bodrum?",
                                        "TAK",
                                        "NIE",
                                        function () {
                                            var xd = localStorage.getObject(saveName);
                                            xd.objective = "Naklon klientow Gucia do Bodruma";
                                            xd.quotes.szef.start = true;
                                            xd.faction = "bodrum";
                                            xd.weapons.plastikowynozbodrum = weapons.plastikowynozbodrum;
                                            localStorage.setObject(saveName, xd);
                                            repeating.addLowerText("Dostales bron: Plastikowy noz Bodrum!");
                                            fpsText.text = "CEL: Naklon klientow Gucia do Bodruma";
                                        },
                                        function () {});

                                }

                            );


                        }
                    });

        } };