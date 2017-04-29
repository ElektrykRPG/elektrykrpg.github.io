var titlescreen,saveName;

var MainMenu = {
    create: function (game) {
        game.stage.backgroundColor = "#fff";
        if("save1" in localStorage){
        this.createButton("WCZYTAJ GRE", game.world.centerX, game.world.centerY + 32, 300, 100, function () {
            var obj1 = localStorage.getObject("save1");
            var obj2 = localStorage.getObject("save2");
            var obj3 = localStorage.getObject("save3");
           var sv1 = game.add.text(800,382,"ZAPIS 1: "+obj1.hour+":"+obj1.minute+" - "+obj1.day+":"+obj1.month+":"+obj1.year,{
           font:"14px 'Press Start 2P' ",
            fill: "#000",
            align: "center"
        });
            sv1.inputEnabled = true;
            sv1.events.onInputOver.add(function(xd){
                xd.fill = "#e50000";
            }, this);
            sv1.events.onInputOut.add(function(xd){
                xd.fill = "#000";
            }, this);
            sv1.events.onInputDown.add(function(xd){
                xd.fill = "#7f0000";
                saveName = "save1";
                game.state.start(localStorage.getObject("save1").mapName);
            }, this);
            
            
            
            var sv2 = game.add.text(800,421,"ZAPIS 2:"+obj2.hour+":"+obj2.minute+" - "+obj2.day+":"+obj2.month+":"+obj2.year,{
           font:"14px 'Press Start 2P' ",
            fill: "#000",
            align: "center"
        });
            
            sv2.inputEnabled = true;
            sv2.events.onInputOver.add(function(xd){
                xd.fill = "#e50000";
            }, this);
            sv2.events.onInputOut.add(function(xd){
                xd.fill = "#000";
            }, this);
            sv2.events.onInputDown.add(function(xd){
                xd.fill = "#7f0000";
                saveName = "save2";
                game.state.start(localStorage.getObject("save2").mapName);
            }, this);
            
            var sv3 = game.add.text(800,460,"ZAPIS 3:"+obj3.hour+":"+obj3.minute+" - "+obj3.day+":"+obj3.month+":"+obj3.year,{
           font:"14px 'Press Start 2P' ",
            fill: "#000",
            align: "center"
        });
            
            sv3.inputEnabled = true;
            sv3.events.onInputOver.add(function(xd){
                xd.fill = "#e50000";
            }, this);
            sv3.events.onInputOut.add(function(xd){
                xd.fill = "#000";
            }, this);
            sv3.events.onInputDown.add(function(xd){
                xd.fill = "#7f0000";
                saveName = "save3";
                 game.state.start(localStorage.getObject("save3").mapName);
            }, this);
        },1,0,2);
        }
else{
            this.createButton("WCZYTAJ GRE", game.world.centerX, game.world.centerY + 32, 300, 100, function () { },2,2,2);
        }
        this.createButton("NOWA GRA", game.world.centerX, game.world.centerY + 192, 300, 100, function () {
            if("save1" in localStorage && !("save2" in localStorage)){
                saveName = "save2";
                repeating.createSave();
                game.state.start("Level1");
            }
            else if("save2" in localStorage && !("save3" in localStorage)){
                saveName = "save3";
                repeating.createSave();
                game.state.start("Level1");
            }
            else if(!("save1" in localStorage) || "save3" in localStorage){
                saveName = "save1";
                repeating.createSave();
                game.state.start("Level1");
            }
        },1,0,2);

        titlescreen = game.add.sprite(game.world.centerX, game.world.centerY - 192, "titlescreen");
        titlescreen.anchor.setTo(0.5, 0.5);

    },
    update: function () {
},
    createButton: function (string, x, y, w, h, callback,o1,o2,o3) {
        var button1 = game.add.button(x, y, "button", callback,this, o1, o2, o3);
        button1.anchor.setTo(0.5, 0.55);
        button1.width = w;
        button1.height = h;

        var txt = game.add.text(button1.x, button1.y, string, {
           font:"20px 'Press Start 2P' ",
            fill: "#ffffff",
            align: "center"
        });
       
        txt.anchor.setTo(0.5, 0.5);
    }
};