var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var font = new FontFace("goosefoot","url(./font/goosefoot.ttf)");
font.load().then((font) => {   
    document.fonts.add(font);
    ctx.font="10px goosefoot";
    startscreen();
});

var music = document.getElementById("tundra");
music.loop = true;
music.volume = 0.1;
music.play();

const gravity = 1;
const scale = 36;//36
var gameover = "false";
var reverse = false;
ctx.imageSmoothingEnabled = false;
ctx.save();
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
// resize();
// window.addEventListener('resize', resize);

var keys = [];
window.addEventListener('keydown', (event) => {
    if (event.key == "ArrowUp" || event.key == "ArrowLeft" || event.key == "ArrowDown" || event.key == "ArrowRight" || event.key == "z" || event.key == "c") {
        if (keys.indexOf(event.key) === -1) {
            keys.unshift(event.key)
        }
        if (gameover == "won" || gameover == "died") {
            gameover = "false";
            player.restart();
            loop();
        }
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key == "ArrowUp" || event.key == "ArrowLeft" || event.key == "ArrowDown" || event.key == "ArrowRight" || event.key == "z" || event.key == "c") {
        var index = keys.indexOf(event.key)
        keys.splice(index, 1)
    }
});

function replaceAt(string, index, replacement) {
    return string.substring(0, index) + replacement + string.substring(index + replacement.length);
}

class map {
    constructor() {
        this.map = 
`F...................................................................D
F...................................................................D
F...................................................................D
F...................................................................D
F...................................................................D
F....................B...........................B..................D
F..............B.....B....................................ALMLMLC...D
F..........B...B.....B....................................GHHHHHI...D
FBBC.....ABBBBBBBBBBBBBBBBBBBBC...............J.....................D
FHHI.....DF.........................................................D
F........DF...........................JBBBJ.........................D
F........DF.........................................................D
F........DF.......JJJJJJJJJJJJJBBBC.................................D
F....ABBBDFBC.....................F.................................D
F....GHHHHHHI.....................BBBBBBBBBBBBBBBBBBBBBBBBBBBBBC....D
F.............................................................DF....D
F..............JJ.............................................DF....D
F.............................................................DF....D
FBBBB.........................................................DF....D
F.........BBBBBBBBBBBB...JJ..AC...............................DF....D
F............................GI...JJ...AC...JJ................AC....D
F......................................GI.........AC..........DF....D
F..................................................GC.........DF....D
F...................................................GC........DF....D
F.............................................................DF....D
F.............................................................DF....D
F..................ABBC.....JJ.....ABC..........ABCJJJJJJJJJJJDF....D
F................ABBEEF............DEF....JJ....GHI...........DF....D
F................DEEEEF............DEF........................DF....D
F.........AC.....DEEEEF............DEFC.......................DF....D
F.........GI.....DEEEEFJJJJJJJJJJJJDEEFJJJJJJJJJJJJJJJJJJJJJJJDFJJJJD
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB`;

        this.rows = this.map.split("\n");
        this.height = this.rows.length;
        this.width = this.rows[0].length;
        this.interval = Date.now() + 3000; 
    }

    touches(player, type) {
        let xStart = Math.floor(player.x/36);
        let xEnd = Math.ceil((player.x + player.w)/36);
        let yStart = Math.floor(player.y/36);
        let yEnd = Math.ceil((player.y + player.h)/36);
        for (let y = yStart; y < yEnd; y++) {
          for (let x = xStart; x < xEnd; x++) {
            let isOutside = x < 0 || x >= this.width ||
                            y < 0 || y >= this.height;
            let here = isOutside ? "." : this.rows[y][x];
            if (here == type) return true;
          }
        }
        return false;
    };

    AABB(rect1, rect2) {
        return rect1.x + rect1.w > rect2.x &&
               rect1.x < rect2.x + rect2.w &&
               rect1.y + rect1.h > rect2.y &&
               rect1.y < rect2.y + rect2.h;
    }

    draw() {
        var Otiles = document.getElementById("Otiles");
        var Gtiles = document.getElementById("Gtiles");
        var Ospikes = document.getElementById("Ospikes");
        var Gspikes = document.getElementById("Gspikes");
        var flag = document.getElementById("flag");
        // console.log(mapper)
        for (let y = 0; y < this.rows.length; y++) {
            const characters = this.rows[y];
            for (let x = 0; x < characters.length; x++) {
                const char = characters[x];

                switch (char) {
                    case ".":
                        //ingnore air
                        break;
                    case "A":
                        ctx.drawImage(Otiles, 0, 0, 6, 6, (x*scale), (y*scale), scale, scale)
                        break;
                    case "B":
                        ctx.drawImage(Otiles, 6, 0, 6, 6, (x*scale), (y*scale), scale, scale)
                        break;
                    case "C":
                        ctx.drawImage(Otiles, 12, 0, 6, 6, (x*scale), (y*scale), scale, scale)
                        break;
                    case "D":
                        ctx.drawImage(Otiles, 0, 6, 6, 6, (x*scale), (y*scale), scale, scale)
                        break;
                    case "E":
                        ctx.drawImage(Otiles, 6, 6, 6, 6, (x*scale), (y*scale), scale, scale)
                        break;
                    case "F":
                        ctx.drawImage(Otiles, 12, 6, 6, 6, (x*scale), (y*scale), scale, scale)
                        break;
                    case "G":
                        ctx.drawImage(Otiles, 0, 12, 6, 6, (x*scale), (y*scale), scale, scale)
                        break;
                    case "H":
                        ctx.drawImage(Otiles, 6, 12, 6, 6, (x*scale), (y*scale), scale, scale)
                        break;
                    case "I":
                        ctx.drawImage(Otiles, 12, 12, 6, 6, (x*scale), (y*scale), scale, scale)
                        break;
                    case "J":
                        ctx.drawImage(Gtiles, 6, 0, 6, 6, (x*scale), (y*scale), scale, scale)
                        break;
                    case "K":
                        ctx.drawImage(Gspikes, 6, 0, 6, 6, (x*scale), (y*scale), scale, scale)
                        break;
                    case "L":
                        ctx.drawImage(flag, 0, 0, 6, 6, (x*scale), (y*scale), scale, scale)
                        break;
                    case "M":
                        ctx.drawImage(flag, 6, 0, 6, 6, (x*scale), (y*scale), scale, scale)
                        break;
                    default:
                        break;
                }
            }

        };
    }

    update() {
        if (this.interval <= Date.now()) {
            for (let i = 0; i < this.map.length; i++) {
                const char = this.map[i];
                switch (char) {
                    case "J":
                        this.map = replaceAt(this.map, i, "K");
                        break;

                    case "K":
                        this.map = replaceAt(this.map, i, "J");
                        break;
                    default:
                        break;
                }
            }
            this.rows = this.map.split("\n");
            this.interval = Date.now() + 3000;
            reverse = !reverse;
        }
    }
}
var gamemap = new map;

class character {
    constructor() {
        this.x = 100;
        this.y = 1000;
        this.w = scale*2;
        this.h = scale*2;
        this.xvelocity = 0;
        this.yvelocity = 0;
        this.isgrounded = false;
        this.flip = false;
        this.xframe = 0;
        this.yframe = 12;
        this.nextframe = Date.now();
    }

    draw() {
        var sprite = document.getElementById("player");
        var middleWidth = canvas.width/2
        var middleHeight = canvas.height/2
        ctx.save();
        ctx.scale((this.flip ? -1 : 1), 1);
        ctx.drawImage(sprite, this.xframe, this.yframe, 12, 12, (this.flip ? -middleWidth-this.w/2 : middleWidth-this.w/2), middleHeight-this.h/2, this.w, this.h)
        ctx.restore();
    }
    
    update() {
        this.yvelocity += gravity; //gravity

        if (keys.indexOf("ArrowUp") !== -1) {

        }
        if (keys.indexOf("ArrowLeft") !== -1) {
            if (reverse) {
                this.xvelocity--;
                this.flip = true;
            } else {
                this.xvelocity++;
                this.flip = false;
            }
        }
        if (keys.indexOf("ArrowDown") !== -1) {

        }
        if (keys.indexOf("ArrowRight") !== -1) {
            if (reverse) {
                this.xvelocity++;
                this.flip = false;
            } else {
                this.xvelocity--;
                this.flip = true;
            }
        }
        if (keys.indexOf("z") !== -1) {//jump key
            var audio = document.getElementById("jump");
            audio.volume = 1;
            if (this.isgrounded) {
                this.yvelocity -= 15;
                this.isgrounded = false
                this.xframe = 0;
                this.yframe = 12;
            }
            audio.play();
        }
        if (keys.indexOf("c") !== -1) {

        }

        if (this.xvelocity >= 10) {
            this.xvelocity = 10;
        }
        if (this.xvelocity <= -10) {
            this.xvelocity = -10;
        }

        this.xvelocity *= 0.9;

        var newpos = {
            x: this.x + this.xvelocity,
            y: this.y,
            w: this.w,
            h: this.h
        }

        if ((!gamemap.touches(newpos, "A")) && (!gamemap.touches(newpos, "B")) && (!gamemap.touches(newpos, "C")) && (!gamemap.touches(newpos, "D")) && (!gamemap.touches(newpos, "E")) && (!gamemap.touches(newpos, "F")) && (!gamemap.touches(newpos, "G")) && (!gamemap.touches(newpos, "H")) && (!gamemap.touches(newpos, "I")) && (!gamemap.touches(newpos, "J"))) {
            this.x += this.xvelocity;
        } else {
            this.xvelocity = 0;
        }
        
        newpos.y += this.yvelocity;
        newpos.x -= this.xvelocity;

        if ((!gamemap.touches(newpos, "A")) && (!gamemap.touches(newpos, "B")) && (!gamemap.touches(newpos, "C")) && (!gamemap.touches(newpos, "D")) && (!gamemap.touches(newpos, "E")) && (!gamemap.touches(newpos, "F")) && (!gamemap.touches(newpos, "G")) && (!gamemap.touches(newpos, "H")) && (!gamemap.touches(newpos, "I")) && (!gamemap.touches(newpos, "J"))) {
            this.y += this.yvelocity;
        } else {
            this.yvelocity = 0;
        }
        newpos.x += this.xvelocity;
        if (gamemap.touches(newpos, "A") || gamemap.touches(newpos, "B") || gamemap.touches(newpos, "C") || gamemap.touches(newpos, "J")) {
            this.isgrounded = true;
            this.yframe = 0;
        }

        if (gamemap.touches(newpos, "K")) {
            gameover = "died";
        }
        if (gamemap.touches(newpos, "M")) {
            gameover = "won";
        }

        if (this.nextframe <= Date.now()) {
            if (this.isgrounded == true) {
                if ((this.xvelocity >= 1) || (this.xvelocity <= -1)) {
                    if (this.xframe != 36) {
                        this.xframe += 12; 
                    } else {
                        this.xframe = 0;
                    }
                } else {
                    this.xframe = 0;
                }
            }
            
            if (this.isgrounded == false) {
                if (this.xframe != 24) {
                    this.xframe += 12; 
                } else {
                    this.xframe = 0;
                }
            }
            this.nextframe = Date.now()+200;
        }
    }
    restart() {
        this.x = 100;
        this.y = 1000;
    }
};
var player = new character;



const game = () => {
    player.update();
    gamemap.update();
}

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    var middleWidth = canvas.width/2
    var middleHeight = canvas.height/2
    ctx.translate(-player.x+middleWidth-(player.w/2), -player.y+middleHeight-(player.h/2));
    gamemap.draw();
    ctx.restore();
    player.draw();

    var clock = document.getElementById("clock")
    if (gamemap.interval - Date.now() <= 187) {
        ctx.drawImage(clock, 0, 0, 11, 11, 0, 0, scale*1.84, scale*1.84)
    } else if (gamemap.interval - Date.now() <= 187*2) {
        ctx.drawImage(clock, 11, 0, 11, 11, 0, 0, scale*1.84, scale*1.84)
    } else if (gamemap.interval - Date.now() <= 187*3) {
        ctx.drawImage(clock, 22, 0, 11, 11, 0, 0, scale*1.84, scale*1.84)
    } else if (gamemap.interval - Date.now() <= 187*4) {
        ctx.drawImage(clock, 33, 0, 11, 11, 0, 0, scale*1.84, scale*1.84)
    } else if (gamemap.interval - Date.now() <= 187*5) {
        ctx.drawImage(clock, 44, 0, 11, 11, 0, 0, scale*1.84, scale*1.84)
    } else if (gamemap.interval - Date.now() <= 187*6) {
        ctx.drawImage(clock, 55, 0, 11, 11, 0, 0, scale*1.84, scale*1.84)
    } else if (gamemap.interval - Date.now() <= 187*7) {
        ctx.drawImage(clock, 66, 0, 11, 11, 0, 0, scale*1.84, scale*1.84)
    } else if (gamemap.interval - Date.now() <= 187*8) {
        ctx.drawImage(clock, 77, 0, 11, 11, 0, 0, scale*1.84, scale*1.84)
    } else if (gamemap.interval - Date.now() <= 187*9) {
        ctx.drawImage(clock, 88, 0, 11, 11, 0, 0, scale*1.84, scale*1.84)
    } else if (gamemap.interval - Date.now() <= 187*10) {
        ctx.drawImage(clock, 99, 0, 11, 11, 0, 0, scale*1.84, scale*1.84)
    } else if (gamemap.interval - Date.now() <= 187*11) {
        ctx.drawImage(clock, 121, 0, 11, 11, 0, 0, scale*1.84, scale*1.84)
    } else if (gamemap.interval - Date.now() <= 187*12) {
        ctx.drawImage(clock, 143, 0, 11, 11, 0, 0, scale*1.84, scale*1.84)
    } else if (gamemap.interval - Date.now() <= 187*13) {
        ctx.drawImage(clock, 154, 0, 11, 11, 0, 0, scale*1.84, scale*1.84)
    } else if (gamemap.interval - Date.now() <= 187*14) {
        ctx.drawImage(clock, 165, 0, 11, 11, 0, 0, scale*1.84, scale*1.84)
    } else if (gamemap.interval - Date.now() <= 187*15) {
        ctx.drawImage(clock, 176, 0, 11, 11, 0, 0, scale*1.84, scale*1.84)
    } else if (gamemap.interval - Date.now() <= 3000) {
        ctx.drawImage(clock, 187, 0, 11, 11, 0, 0, scale*1.84, scale*1.84)
    }
    if (gameover == "died") {
        var audio = document.getElementById("death");
        audio.volume = 1;
        ctx.font="100px goosefoot";
        ctx.fillStyle = "#ffd307";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", canvas.width/2, canvas.height/2);
        ctx.font="50px goosefoot";
        ctx.fillText("Press any key to restart!", canvas.width/2, 300);
        audio.play();
    }
    if (gameover == "won") {
        var audio = document.getElementById("won");
        audio.volume = 1;
        ctx.font="100px goosefoot";
        ctx.fillStyle = "#4ba5a1";
        ctx.textAlign = "center";
        ctx.fillText("You won!", canvas.width/2, canvas.height/2);
        ctx.font="50px goosefoot";
        ctx.fillText("Press any key to play again!", canvas.width/2, 300);
        audio.play();
    }
}

const startscreen = () => {
    var sprite = document.getElementById("branding")
    ctx.font="100px goosefoot";
    ctx.fillStyle = "#f48417";
    ctx.textAlign = "center";
    ctx.fillText("Wizard Reverse", canvas.width/2, 100);
    ctx.drawImage(sprite, (canvas.width/2)-((sprite.width*5)/2), 200, sprite.width*5, sprite.height*5)
    ctx.font="30px goosefoot";
    ctx.fillText("Music: Evan King - Tundra", canvas.width/2, 400);
    ctx.fillText("https://www.youtube.com/ContextSensitive", canvas.width/2, 430);
    ctx.fillText("https://contextsensitive.bandcamp.com/", canvas.width/2, 460);
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        loop();
    }, 3000);
}

const loop = () => {
    game();
    draw()
    window.requestAnimationFrame(() => {
        if (gameover == "false") {
            loop();
        }
    })
}