var ucz2;
var hayati = {
    preload: function () {
        game.load.image("tileset_hayati", "assets/hayati.png");
        game.load.tilemap("hayati", "assets/hayati.csv");
        game.load.spritesheet("szefowa", "assets/szefowa.png", 50, 59);
        game.load.image("szefowaHead", "assets/szefowa_head.png");
    },
    create: function () {

        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("hayati", "tileset_hayati", 0, 31);

        map.setTileLocationCallback(5, 16, 1, 1, function () {
            betweenMapChange = "fromHayatiLeft";
            game.state.start("city1");
        }, game);
        map.setTileLocationCallback(12, 16, 2, 1, function () {
            betweenMapChange = "fromHayatiRight";
            game.state.start("city1");
        }, game);

        map.setTileLocationCallback(16, 12, 1, 2, function () {
            repeating.addShop("hayati",player.x - 15,player.y);
        }, game);
        
        if (betweenMapChange == "fromCity1Left") {
            repeating.loadPlayer(358, 947);
            betweenMapChange = false;
        } else if (betweenMapChange == "fromCity1Right") {
            repeating.loadPlayer(864, 991);
            betweenMapChange = false;
        } else {
            repeating.loadPlayer(saveobj.positionX, saveobj.positionY);
        }

        if (saveobj.faction == "hayati") {
            map.putTile(35, 15, 2);
        }

        lechu = game.add.sprite(988, 680, "szefowa");
        game.physics.arcade.enable(lechu);
        lechu.anchor.setTo(0.5, 0.5);
        lechu.enableBody = true;
        lechu.body.immovable = true;

        if (saveobj.quotes.flags.uczen1Defeated && saveobj.faction == "hayati") {
            var uczen1 = game.add.sprite(758, 690, "uczen1");
            game.physics.arcade.enable(uczen1);
            uczen1.anchor.setTo(0.5, 0.5);
            uczen1.enableBody = true;
            uczen1.body.immovable = true;
            uczen1.frame = 2;
        }
        if (saveobj.quotes.flags.uczen2Defeated && saveobj.faction == "hayati") {
            ucz2 = game.add.sprite(1122, 156, "uczen2");
            game.physics.arcade.enable(ucz2);
            ucz2.anchor.setTo(0.5, 0.5);
            ucz2.enableBody = true;
            ucz2.body.immovable = true;
            ucz2.frame = 3;
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
        game.physics.arcade.collide(player, layer, function () {});
        game.physics.arcade.collide(player, ucz2);
        game.physics.arcade.collide(player, lechu, function (arg1, arg2) {
            var saveobj = localStorage.getObject(saveName);
            if (saveobj.objective === "Dolacz do dowolnej frakcji") {
                repeating.addLowerChat(
                    quotes.szefowa.start,
                    "Szefowa",
                    "szefowaHead",
                    lechu,
                    arg1,
                    arg2,
                    localStorage.getObject(saveName).quotes.szefowa.start,
                    function () {

                        repeating.addLowerOption(
                            "Czy chcesz dolaczyc do frakcji Hayati?",
                            "TAK",
                            "NIE",
                            function () {
                                map.putTile(35, 15, 2);
                                var xd = localStorage.getObject(saveName);
                                xd.objective = "Naklon klientow Gucia do Hayati";
                                xd.quotes.szefowa.start = true;
                                xd.faction = "hayati";
                                xd.weapons.plastikowynozhayati = weapons.plastikowynozhayati;
                                localStorage.setObject(saveName, xd);
                                repeating.addLowerText("Dostales bron: Plastikowy noz Hayati!");
                                fpsText.text = "CEL: Naklon klientow Gucia do Hayati";
                            },
                            function () {});
                    });
            }
        });

    }
};