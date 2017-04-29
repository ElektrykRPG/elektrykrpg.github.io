var map, inChat = false,
    betweenMapChange = false,
    controls, lechuHead, lowerMenu, lechu, fpsText, layer, player, respawn, nuts,
    shootTime = 0,
    playerSpeed = 250,
    jumpTimer = 0;
var text, textgrp, middleweapontext, hpgrp, enemi, enHP, enemyHP, enemyName, enDMG, inFight, menu, kolba;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}
var quotes = {
    lechu: {
        start: [
            "Jeszcze w szkole? Juz dawno po dzwonku. Dobra dziecko, idz juz do domu.",
            "Chociaz czekaj... Ty pierwszak jestes? Trzeba cie zaznajomic z radomszczanskimi realiami.",
            "Radomskiem rzadza dwa kartele kebabowe: Bodrum Kebab i Hayati Kebab. Hayati probuje pokonac konkurencje, a Bodrum  - wedlug poglosek - potajemnie rzadzi calym miastem",
            "Ja to tam takich rzeczy nie jem, ale dzieciaki w elektryku aktywnie walcza w tych frakcjach. Tylko nie mow nikomu, ze ci powiedzialem o potedze Bodruma. Jesli faktycznie maja takie wplywy, to jeszcze mnie odstrzela.",
            "Jesli chcesz przetrwac w tej szkole, musisz do ktorejs z frakcji dolaczyc. Zmykaj juz... Chociaz w sumie jak juz bedziesz kupowal kebsa, to mi tez mozesz kupic. Masz tu 10zl na start."]
    },
    szefowa: {
        start: [
            "Witamy. Wygladasz na ucznia Elektryka. Ostatnio wielu ludzi w twoim wieku przychodzi walczyc dla Hayati Kebab.",
            "Radomsko jest w stanie wojny kebabowej. Potrzebujemy osob takich jak ty, aby zwalczyc konkurencje.",
            "Jestesmy nowi, ale szybko udalo nam sie wbic na rynek. Ludzie maja dosc dominacji Bodruma, ktory w swojej kieszeni ma wszystkie organy miasta.",
        "Z twoja pomoca mozemy wspolnie zniszczyc Bodruma raz na zawsze. Dolaczysz sie?"]
    },
    szef: {
        start: ["O, mlody. Ty z Elektryka, tak?",
            "Bodrum do niedawna kontrolowal cale Radomsko. Mielismy agentow we wszystkich organach miasta, rowniez w Elektryku.",
        "W czasach swietnosci zaczelismy takze ekspansje na inne tereny Radomska. Lecz nasza nowa restauracja przy Baszcie sie nie przyjela...",
              "Do miasta wkroczyla konkurencja, a my powoli tracilismy pienadze, kontrole i wplywy...",
              "Nie zamierzamy sie jednak poddac. Musimy pokazac Hayati gdzie jest ich miejsce oraz odzyskac wladze nad miastem.",
              "Wojna juz sie zaczela. Chcesz walczyc z nami ramie w ramie?"]
    },
    uczen1: {
        start: ["O nie, znowu wy...",
                   "Ja sie w te wasze kebaby nie bawie!"],
        afterFight: ["Dobra, niech ci bedzie. Zjem kebsa", "Moze ta wasza kebabiarnia nie jest jednak taka zla..."]
    },
    uczen2: {
        start: ["Zostawcie mnie, nie lubie kebabow!"],
        afterFight: ["No dobra juz, zjem kebsa..."]
    }
};

var weapons = {
    piesc: {
        name: "Piesc",
        dmg: 5
    },
    pantadeusz: {
        name: "Pan Tadeusz",
        dmg: 100
    },
    nozcygana: {
        name: "Noz od cygana",
        dmg: 15
    },
    plastikowynozhayati: {
        name: "Plastikowy noz Hayati",
        dmg: 10
    },
    plastikowynozbodrum: {
        name: "Plastikowy noz Bodrum",
        dmg: 10
    },
    maczeta: {
        name: "Maczeta do krojenia kebabow",
        dmg: 25
    },
    ukryteostrze: {
        name: "Ukryte ostrze",
        dmg: 25
    },
    jedynka: {
        name: "Jedynka trygonometryczna",
        dmg: 40
    },
};

var items = {
    malapita: {
        name: "Mala pita",
        key: "malapita",
        type: "heal",
        soldIn: "hayati",
        heal: 15,
        cost: 8,
        amount: 1
    },
    duzapita: {
        name: "Duza pita",
        key: "duzapita",
        type: "heal",
        soldIn: "hayati",
        heal: 30,
        cost: 14,
        amount: 1
    },
    malykapsalon: {
        name: "Maly kapsalon",
        key: "malykapsalon",
        type: "heal",
        soldIn: "hayati",
        heal: 40,
        cost: 17,
        amount: 1
    },
    pitaxxl: {
        name: "Pita XXL",
        type: "heal",
        key: "pitaxxl",
        soldIn: "hayati",
        heal: 50,
        cost: 21,
        amount: 1
    },
    bulka: {
        name: "Bulka",
        type: "heal",
        key: "bulka",
        soldIn: "bodrum",
        heal: 20,
        cost: 9,
        amount: 1
    },
    tortilla: {
        name: "Tortilla",
        type: "heal",
        key: "tortilla",
        soldIn: "bodrum",
        heal: 35,
        cost: 15,
        amount: 1
    },
    kubek: {
        name: "Kubek XXL",
        type: "heal",
        key: "kubek",
        soldIn: "bodrum",
        heal: 50,
        cost: 21,
        amount: 1
    }

};

var repeating = {
    controls: function () {
        this.right = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.left = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.up = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.down = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.shoot = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.e = game.input.keyboard.addKey(Phaser.Keyboard.E);

    },
    updateSaves: function () {
        var date = new Date();
        var sejw = localStorage.getObject(saveName);
        sejw.mapName = game.state.current;
        sejw.positionX = player.x;
        sejw.positionY = player.y;
        sejw.hour = date.getHours();
        sejw.minute = date.getMinutes();
        sejw.day = date.getDate();
        sejw.month = date.getMonth() + 1;
        sejw.year = date.getFullYear();
        localStorage.setObject(saveName, sejw);
    },
    checkControls: function () {
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        if (controls.up.isDown && !inChat) {
            player.animations.play("up");
            player.body.velocity.y -= playerSpeed;
        } else if (controls.down.isDown && !inChat) {
            player.animations.play("down");
            player.body.velocity.y += playerSpeed;

        } else if (controls.right.isDown && !inChat) {
            player.animations.play("right");
            player.body.velocity.x += playerSpeed;
        } else if (controls.left.isDown && !inChat) {
            player.animations.play("left");
            player.body.velocity.x -= playerSpeed;
        } else if (controls.shoot.isDown) {
            repeating.throwMolotov();
        }
        if (controls.e.isDown) {
            if (playerSpeed == 900) {
                playerSpeed = 250;
            } else {
                playerSpeed = 900;
            }
            fpsText.text = "TX: " + layer.getTileX(player.x) + " TY: " + layer.getTileY(player.y) + " PX: " + Math.round(player.x) + " PY: " + Math.round(player.y) + " MX: " + game.input.x + " MY:" + game.input.y;
        }
        if (!player.body.velocity.x && !player.body.velocity.y && !inChat) {
            player.frame = 1;
        }
    },
    loadMolotovs: function () {
        nuts = game.add.group();
        nuts.enableBody = true;
        nuts.physicsBodyType = Phaser.Physics.ARCADE;
        nuts.createMultiple(5, "nut");
        nuts.setAll("anchor.x", 0.5);
        nuts.setAll("anchor.y", 0.5);
        nuts.setAll("scale.x", 0.5);
        nuts.setAll("scale.y", 0.5);
        nuts.setAll("outOfBoundsKill", true);
        nuts.setAll("checkWorldBounds", true);
    },
    throwMolotov: function () {
        if (game.time.now > shootTime) {
            nut = nuts.getFirstExists(false);
            if (nut) {
                nut.reset(player.x, player.y);
                nut.body.velocity.y = -600;
                shootTime = game.time.now + 900;
            }
        }
    },
    loadMap: function (tilemapKey, tilesetKey, collision1, collision2) {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor = "#000";
        map = game.add.tilemap(tilemapKey, 64, 64);
        map.addTilesetImage(tilesetKey);
        layer = map.createLayer(0);
        layer.resizeWorld();
        map.setCollisionBetween(collision1, collision2);
    },
    loadPlayer: function (x, y) {
        player = game.add.sprite(x, y, "player");
        player.scale.setTo(0.9, 0.9);
        player.anchor.setTo(0.5, 0.5);
        player.animations.add("up", [12, 13, 14, 15], 7, true);
        player.animations.add("down", [0, 1, 2, 3], 7, true);
        player.animations.add("left", [8, 9, 10, 11], 7, true);
        player.animations.add("right", [4, 5, 6, 7], 7, true);
        game.physics.arcade.enable(player);
        game.camera.follow(player);
        player.body.collideWorldBounds = true;
    },
    addLowerMenu: function () {








    },
    addLowerChat: function (kwestie, name, headpic, lechuuu, arg1, arg2, arg3, callback) {
        if (!arg3) {
            playerSpeed = 0;
            inChat = true;
            player.animations.stop()

            if (arg1.x > arg2.x && arg1.y > arg2.y - arg2.height + 15 && arg1.y <= arg2.y + 30) {
                arg2.frame = 2;
                arg1.frame = 8;
            } else if (arg1.x < arg2.x && arg1.y > arg2.y - arg2.height + 15 && arg1.y <= arg2.y + 30) {
                arg2.frame = 1;
                arg1.frame = 5;
            } else if (arg1.y > arg2.y) {
                arg2.frame = 0;
                arg1.frame = 3;
            } else if (arg1.y < arg2.y) {
                arg2.frame = 3;
            }

            var lowerMenuu = game.add.sprite(0, 550, "lowerBar");
            lowerMenuu.fixedToCamera = true;

            var lechuHead = game.add.sprite(lowerMenuu.x + 50, lowerMenuu.y + 50, headpic);
            lechuHead.fixedToCamera = true;
            var i = 0;
            var nametext = game.add.text(lechuHead.x + lechuHead.width * 0.5, lechuHead.y + lechuHead.height + 20, name, {
                fill: "#FFFFFF",
                font: "14px 'Press Start 2P' "
            });
            nametext.fixedToCamera = true;
            nametext.anchor.setTo(0.5, 0.5);
            var skip = game.add.text(lowerMenuu.x + lowerMenuu.width * 0.5, lowerMenuu.y + lowerMenuu.height - 30, "[[  SPACJA - PRZEWIN DIALOG  ]]", {
                fill: "#FFFFFF",
                font: "16px 'Press Start 2P' "
            });
            skip.fixedToCamera = true;
            skip.anchor.setTo(0.5, 0.5);
            var talk = game.add.text(230, lowerMenuu.y + 50, kwestie[i], {
                fill: "#FFFFFF",
                font: "18px 'Press Start 2P' ",
                align: "left",
                wordWrap: true,
                wordWrapWidth: 1000
            });
            talk.fixedToCamera = true;
            game.input.keyboard.start();
            game.input.keyboard.addCallbacks(game, function (char) {
                if (char.keyCode === 32) {
                    if (kwestie.length > i + 1) {
                        talk.text = kwestie[++i];
                    } else {
                        i = 0;
                        playerSpeed = 250;
                        inChat = false;
                        lechuuu.frame = 0;
                        lowerMenuu.kill();
                        lechuHead.kill();
                        talk.kill();
                        skip.kill();
                        nametext.kill();
                        callback();
                    }
                }
            });
        };
    },
    addLowerText: function (text, callback) {

        playerSpeed = 0;
        inChat = true;
        player.animations.stop()
        var lowerMenuu = game.add.sprite(0, 550, "lowerBar");
        lowerMenuu.fixedToCamera = true;

        var nametext = game.add.text(lowerMenuu.x + lowerMenuu.width * 0.5, lowerMenuu.y + lowerMenuu.height * 0.3, text, {
            fill: "#FFFFFF",
            font: "20px 'Press Start 2P' ",
            wordWrap: true,
            wordWrapWidth: 1000
        });
        nametext.fixedToCamera = true;
        nametext.anchor.setTo(0.5, 0.5);

        var skip = game.add.text(lowerMenuu.x + lowerMenuu.width * 0.5, lowerMenuu.y + lowerMenuu.height - 30, "[[  SPACJA - PRZEWIN DIALOG  ]]", {
            fill: "#FFFFFF",
            font: "16px 'Press Start 2P' "
        });
        skip.fixedToCamera = true;
        skip.anchor.setTo(0.5, 0.5);
        game.input.keyboard.addCallbacks(game, function (char) {
            if (char.keyCode === 32) {
                playerSpeed = 250;
                inChat = false;
                lowerMenuu.kill();
                skip.kill();
                nametext.kill();
                game.input.keyboard.addCallbacks(game, function (char) {});
                if (callback) {
                    callback();
                }
            }
        });
    },
    addLowerOption: function (question, option1, option2, callback1, callback2) {
        if (!inChat || inFight) {
            playerSpeed = 0;
            inChat = true;
            player.animations.stop()

            var lowerMenuu = game.add.sprite(0, 550, "lowerBar");
            lowerMenuu.fixedToCamera = true;

            var nametext = game.add.text(640, 625, question, {
                fill: "#FFFFFF",
                font: "20px 'Press Start 2P' ",
                wordWrap: true,
                wordWrapWidth: 1000
            });
            nametext.fixedToCamera = true;
            nametext.anchor.setTo(0.5, 0.5);

            var talk1 = game.add.text(nametext.x - 125, nametext.y + 100, option1, {
                fill: "#FFFFFF",
                font: "20px 'Press Start 2P' ",
                strokeThickness: 6
            });
            talk1.fixedToCamera = true;

            talk1.anchor.setTo(0.5, 0.5);
            var talk2 = game.add.text(talk1.x + 250, nametext.y + 100, option2, {
                fill: "#FFFFFF",
                font: "20px 'Press Start 2P' ",
            });
            talk2.fixedToCamera = true;
            talk2.anchor.setTo(0.5, 0.5);
            var options = [talk1, talk2];
            var currentOption = 0;
            game.input.keyboard.addCallbacks(game, function (char) {
                if (char.keyCode === 68 && currentOption < 1) {
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 0;
                    currentOption++;
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 6;

                } else if (char.keyCode === 65 && currentOption > 0) {
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 0;
                    currentOption--;
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 6;

                } else if (char.keyCode === 32) {
                    playerSpeed = 250;
                    inChat = false;
                    lowerMenuu.kill();
                    talk1.kill();
                    talk2.kill();
                    nametext.kill();
                    if (currentOption == 0) {
                        callback1();
                    } else if (currentOption == 1) {
                        callback2();
                    }

                }
            });
        }
    },
    addBattle: function (enemy, enemyNamee, enemyyHP, enemyDMG, callback) {
        game.camera.flash(
            0xffffff, 1000);
        menu = game.add.sprite(0, 0, "fullMenu");
        menu.fixedToCamera = true;
        playerSpeed = 0;
        inFight = true;
        inChat = true;
        player.animations.stop();
        enHP = enemyyHP;
        enemyHP = enemyyHP;
        enemyName = enemyNamee;
        enDMG = enemyDMG;
        kolba = callback;

        enemi = game.add.sprite(640, 400, enemy);
        enemi.anchor.setTo(0.5, 0.5);
        enemi.scale.setTo(3, 3);
        enemi.fixedToCamera = true;

        repeating.showHP();
        repeating.addFightOption();

    },
    showHP: function () {
        inChat = true;
        hpgrp = game.add.group();
        var xd = localStorage.getObject(saveName);
        var ay = "GRACZ: " + xd.playerHP + "/100"
        var nametext = game.add.text(25, 25, ay, {
            fill: "#FFFFFF",
            font: "16px 'Press Start 2P' ",
            strokeThickness: 6
        }, hpgrp);
        nametext.fixedToCamera = true;

        var nametext2 = game.add.text(25, 60, enemyName + ": " + enHP + "/" + enemyHP, {
            fill: "#FFFFFF",
            font: "16px 'Press Start 2P' ",
            strokeThickness: 6
        }, hpgrp);
        nametext2.fixedToCamera = true;

    },
    showWeapons: function () {
        inChat = true;
        var xd = localStorage.getObject(saveName).weapons;
        var wps = [];
        var roll = [];
        for (var prop in xd) {
            wps.push(xd[prop]);
        }
        textgrp = game.add.group();
        for (var i = 0; i < wps.length; i++) {
            roll[i] = game.add.text(25, i * 25 + 35, wps[i].name, {
                fill: "#FFFFFF",
                font: "14px 'Press Start 2P' "
            }, textgrp);
            roll[i].fixedToCamera = true;
        }
        roll[0].strokeThickness = 6;
        middleweapontext = game.add.text(640, 675, "DMG: " + wps[0].dmg, {
            fill: "#FFFFFF",
            font: "20px 'Press Start 2P' ",
            strokeThickness: 6
        });
        middleweapontext.anchor.setTo(0.5, 0.5);
        middleweapontext.fixedToCamera = true;
        var curOpt = 0;
        game.input.keyboard.addCallbacks(game, function (char) {
            if (char.keyCode === 87 && curOpt > 0) {
                roll[curOpt].strokeThickness = 0;
                curOpt--;
                roll[curOpt].strokeThickness = 6;
                middleweapontext.text = "DMG: " + wps[curOpt].dmg;
            } else if (char.keyCode === 83 && curOpt < roll.length - 1) {
                roll[curOpt].strokeThickness = 0;
                curOpt++;
                roll[curOpt].strokeThickness = 6;
                middleweapontext.text = "DMG: " + wps[curOpt].dmg;
            } else if (char.keyCode === 32) {
                game.input.keyboard.addCallbacks(game, function (char) {});
                textgrp.destroy();
                hpgrp.destroy();
                middleweapontext.destroy();
                enemi.cameraOffset.x = enemi.x;
                enemi.cameraOffset.y = enemi.y;
                enemi.fixedToCamera = false;
                var enemii = game.add.tween(enemi);
                enemi.tint = 9439240;
                enemii.to({
                    x: enemi.x + 10
                }, 150, null, true, 0, 0, true);

                enemii.onComplete.addOnce(function (enemii) {
                    enemii.tint = 0xFFFFFF;
                    rest();
                }, this);
                enemii.start();


                function rest() {

                    if (enHP - wps[curOpt].dmg > 0) {
                        enHP -= wps[curOpt].dmg;
                        hpgrp.destroy();
                        repeating.showHP();

                        var enemiii = game.add.tween(enemi);
                        enemiii.to({
                            x: enemi.x - 15
                        }, 150, Phaser.Easing.Sinusoidal.Out, true, 0, 0, true);
                        enemiii.onComplete.addOnce(function (enemii) {

                            game.camera.shake(0.001 * enDMG, 15 * enDMG);
                            var xdd = localStorage.getObject(saveName);
                            if (xdd.playerHP - enDMG > 0) {
                                //przezyles atak
                                xdd.playerHP -= enDMG;
                                localStorage.setObject(saveName, xdd);
                                hpgrp.destroy();
                                repeating.showHP();
                                repeating.addFightOption();

                            } else {
                                // deadles
                                xdd.playerHP = 0;
                                localStorage.setObject(saveName, xdd);
                                hpgrp.destroy();
                                repeating.showHP();
                                var xdddd = localStorage.getObject(saveName);
                                xdddd.playerHP = 100;
                                localStorage.setObject(saveName, xdddd);
                                game.input.keyboard.start();
                                repeating.addLowerText("Zostales pokonany!", function () {
                                    menu.destroy();
                                    hpgrp.destroy();
                                    enemi.destroy();
                                    inChat = false;
                                    inFight = false;
                                    betweenMapChange = "fromDead";
                                    game.state.start("Level1");
                                });
                            }

                        }, this);
                        enemiii.start();



                    } else {
                        //enemy nie przezyl          
                        enHP = 0;
                        hpgrp.destroy();
                        repeating.showHP();
                        game.input.keyboard.start();
                        repeating.addLowerText("Przeciwnik pokonany!", function () {
                            menu.destroy();
                            hpgrp.destroy();
                            enemi.destroy();
                            inChat = false;
                            inFight = false;
                            kolba();
                        });
                    }

                }


            }
        });

    },
    showItems: function () {
        inChat = true;
        var xd = localStorage.getObject(saveName).items;
        var wps = [];
        var roll = [];
        for (var prop in xd) {
            wps.push(xd[prop]);
        }
        textgrp = game.add.group();
        for (var i = 0; i < wps.length; i++) {
            roll[i] = game.add.text(25, i * 25 + 35, wps[i].amount + "x " + wps[i].name, {
                fill: "#FFFFFF",
                font: "14px 'Press Start 2P' "
            }, textgrp);
            roll[i].fixedToCamera = true;
        }
        roll[0].strokeThickness = 6;
        if (wps[0].type == "heal") {
            middleweapontext = game.add.text(640, 675, "HEAL: " + wps[0].heal, {
                fill: "#FFFFFF",
                font: "20px 'Press Start 2P' ",
                strokeThickness: 6
            });
        } else {
            // item nie jest healem
        }

        middleweapontext.anchor.setTo(0.5, 0.5);
        middleweapontext.fixedToCamera = true;
        var curOpt = 0;
        game.input.keyboard.start();
        game.input.keyboard.addCallbacks(game, function (char) {
            if (char.keyCode === 87 && curOpt > 0) {
                roll[curOpt].strokeThickness = 0;
                curOpt--;
                roll[curOpt].strokeThickness = 6;
                middleweapontext.text = "HEAL: " + wps[curOpt].heal;
            } else if (char.keyCode === 83 && curOpt < roll.length - 1) {
                roll[curOpt].strokeThickness = 0;
                curOpt++;
                roll[curOpt].strokeThickness = 6;
                middleweapontext.text = "HEAL: " + wps[curOpt].heal;
            } else if (char.keyCode === 32) {
                textgrp.destroy();
                hpgrp.destroy();
                middleweapontext.destroy();
                var ed = localStorage.getObject(saveName);
                var na = wps[curOpt];
                if (ed.playerHP + wps[curOpt].heal > 100) {
                    ed.playerHP = 100;
                } else {
                    ed.playerHP += wps[curOpt].heal;
                }
                for (var propp in ed.items) {
                    if (wps[curOpt].name === ed.items[propp].name) {
                        if (ed.items[propp].amount - 1 > 0) {
                            ed.items[propp].amount -= 1;
                            localStorage.setObject(saveName, ed);
                        } else {
                            delete ed.items[propp];
                            localStorage.setObject(saveName, ed);
                        }
                    }
                }
                game.input.keyboard.start();
                hpgrp.destroy();
                repeating.showHP();
                repeating.addFightOption();

            }
        });

    },
    addFightOption: function () {
        inChat = true;
        repeating.addLowerOption(
            "",
            "BRON",
            "PRZEDMIOTY",
            function () {
                hpgrp.destroy();
                repeating.showWeapons();
                playerSpeed = 0;
            },
            function () {
                hpgrp.destroy();
                if (!isEmpty(localStorage.getObject(saveName).items)) {
                    repeating.showItems();
                } else {
                    repeating.showHP();
                    repeating.addFightOption();
                }
            });
    },
    addShop: function (soldIn,a,b) {
        if(!inFight){
        menu = game.add.sprite(0, 0, "fullMenu");
        menu.fixedToCamera = true;
        playerSpeed = 0;
        inFight = true;
        inChat = true;
        player.animations.stop();



        var xd = localStorage.getObject(saveName);
        var filteredItems = [];
        var roll = [];

        for (var pro in items) {
            if (items[pro].soldIn == soldIn) {
                filteredItems.push(items[pro]);
            }
        }

        textgrp = game.add.group();

        var money = game.add.text(212, 40, "Portfel: " + xd.money + "zl", {
            fill: "#FFFFFF",
            font: "20px 'Press Start 2P' ",
            strokeThickness: 6
        }, textgrp);
        money.fixedToCamera = true;
        money.anchor.setTo(0.5, 0.5);

        for (var i = 0; i < filteredItems.length; i++) {
            roll[i] = game.add.text(25, i * 25 + 35 + money.y, filteredItems[i].name + " - " + filteredItems[i].cost + "zl", {
                fill: "#FFFFFF",
                font: "14px 'Press Start 2P' "
            }, textgrp);
            roll[i].fixedToCamera = true;
        }
        roll[0].strokeThickness = 6;

        middleweapontext = game.add.text(640, 620, "Po uzyciu: +" + filteredItems[0].heal + " HP", {
            fill: "#FFFFFF",
            font: "20px 'Press Start 2P' ",
            strokeThickness: 6
        });
        middleweapontext.anchor.setTo(0.5, 0.5);
        middleweapontext.fixedToCamera = true;

           var talk1 = game.add.text(middleweapontext.x - 125, middleweapontext.y + 100, "KUP", {
                fill: "#FFFFFF",
                font: "20px 'Press Start 2P' ",
                strokeThickness: 6
            });
            talk1.fixedToCamera = true;

            talk1.anchor.setTo(0.5, 0.5);
            var talk2 = game.add.text(talk1.x + 250, middleweapontext.y + 100, "WYJDZ", {
                fill: "#FFFFFF",
                font: "20px 'Press Start 2P' ",
            });
            talk2.fixedToCamera = true;
            talk2.anchor.setTo(0.5, 0.5);
            var options = [talk1, talk2];
            var currentOption = 0;
        
        var curOpt = 0;
        game.input.keyboard.start();
        game.input.keyboard.addCallbacks(game, function (char) {
            if (char.keyCode === 87 && curOpt > 0) {
                roll[curOpt].strokeThickness = 0;
                curOpt--;
                roll[curOpt].strokeThickness = 6;
                middleweapontext.text = "Po uzyciu: +" + filteredItems[curOpt].heal + " HP";
            } else if (char.keyCode === 83 && curOpt < roll.length - 1) {
                roll[curOpt].strokeThickness = 0;
                curOpt++;
                roll[curOpt].strokeThickness = 6;
                middleweapontext.text = "Po uzyciu: +" + filteredItems[curOpt].heal + " HP";
            } 
           else if (char.keyCode === 68 && currentOption < 1) {
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 0;
                    currentOption++;
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 6;

                } else if (char.keyCode === 65 && currentOption > 0) {
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 0;
                    currentOption--;
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 6;}
            
            else if (char.keyCode === 32) {
                if(currentOption === 0){
                var ed = localStorage.getObject(saveName);
                if (ed.money - filteredItems[curOpt].cost >= 0) {
                    ed.money -= filteredItems[curOpt].cost;
                    money.text = "Portfel: " + ed.money + "zl";
                    middleweapontext.text = "Kupiono: " + filteredItems[curOpt].name;

                    var papk = false;
                    if (!isEmpty(ed.items)) {
                        for (var pra in ed.items) {

                            if (filteredItems[curOpt].name === ed.items[pra].name) {
                                ed.items[pra].amount += 1;
                                localStorage.setObject(saveName, ed);
                                break;
                            } else if (filteredItems[curOpt].key in ed.items) {
                                ed.items[filteredItems[curOpt].key].amount += 1;
                                localStorage.setObject(saveName, ed);
                                break;
                            } else {
                                var op = filteredItems[curOpt].key;
                                ed.items[op] = filteredItems[curOpt];
                                localStorage.setObject(saveName, ed);
                                break;
                            }
                        }
                    } else {
                        ed.items[filteredItems[curOpt].key] = filteredItems[curOpt];
                        localStorage.setObject(saveName, ed);
                    }
                } else {
                    middleweapontext.text = "Nie stac cie na zakup przedmiotu";
                }
                game.input.keyboard.start();
            }else{
                playerSpeed = 250;
                player.reset(a,b);
                    inChat = false;
                inFight = false;
                    talk1.destroy();
                    talk2.destroy();
                textgrp.destroy();
                menu.destroy();
                middleweapontext.destroy();
            }
            }
        });}
    },
    createSave: function () {
        localStorage.setObject(saveName, {
            mapName: "Level1",
            positionX: 477,
            positionY: 340,
            objective: "Porozmawiaj z Lechem",
            hour: 0,
            minute: 0,
            day: 0,
            month: 0,
            year: 0,
            playerHP: 100,
            money: 0,
            faction: "",
            items: {},
            weapons: {
                piesc: weapons.piesc
            },
            quotes: {
                flags: {
                    bikePosition: "",
                    boughtHayatiLeft: false,
                    emptiedUpperBin: false,
                    emptiedLowerBin: false,
                    uczen1Defeated: false,
                    uczen2Defeated: false
                },
                lechu: {
                    start: false
                },
                szefowa: {
                    start: false
                },
                szef: {
                    start: false
                },
                uczen1: {
                    start: false
                },
                uczen2: {
                    start: false
                }
            }
        });
    }
};
