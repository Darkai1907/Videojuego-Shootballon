////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////// TRATAR DE SIEMPRE LEER LOS COMENTARIOS //////////
////////// Aún no está completo, pero se está     //////////
////////// terminando, ver en dado caso, video    //////////
////////// de Código Facilito con Canvas          //////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

var canva = document.querySelector(`canvas`);
var ctx = canva.getContext(`2d`);

var keyboard = {}

var spaceship = new Image();
spaceship.src = 'images/Ship/spaceship.png';

var ship = {
    x: ctx.canvas.width - 20,
    y: ctx.canvas.height - 80,
    width: 20,
    height: 20
};

var fondo = new Image();

var hud = {
    //Cantidad de intervalos transcurridos
    counter_i: 1,
    //Cantidad de segundos transcurridos
    counter_s: 0,
    //Cantidad de helio del tanque (esta en %)
    counter_h: 100,
    //Suma de puntos * globos reventados
    counter_p: 0
}

//Evalua si el juego inicio
var controls = {
    gameInit: false
}

var ballon = {
    x: ctx.canvas.width - 50,
    y: ctx.canvas.height - 50,
    width: 30,
    height: 30
}

var ballon_imgs = new Array();

//Distancias en la que se moveran los glovos
var limity = new Array();
var limitx = canva.width / 4;

//Se determinaran los colores
var ballon_color = new Array();

//Se determinaran las distancias
var ballon_distance = new Array();

const btnStart = document.querySelector(`#btn-start`);

btnStart.onclick = function () {
    //Evalua si el juego ha comenzado
    if (controls.gameInit == false) {
        function Cargar() {
            fondo.src = "images/fondo-animado-cielo-azul-full-apk.png";
            ballon_atributes();
            fondo.onload = function () {
                document.querySelector(`.power`).classList.add('power-on');
                setInterval(frameloop, 1000 / 10);
            }
        }
        //Cargan los elementos del juego
        Cargar();

        this.value = "Restart";
        controls.gameInit = true
    }
    else {
        //Reinicia el juego
        location.reload();
    }
};

function drawBackground() {
    ctx.save();
    ctx.drawImage(fondo, 0, 0);
    ctx.restore();
}

function helioTank() {

    //Muestra la cantidad de helio de la nave en el juego en porcentaje y uns barra
    ctx.save();
    ctx.fillStyle = "#aaa";
    ctx.fillRect(0, 0, 175, 15);
    ctx.fillStyle = "#000";
    ctx.font = "bold 10px Comic Sans MS"
    ctx.fillText(`Helio: ${hud.counter_h}%`, 2, 11);
    ctx.fillStyle = "red";
    ctx.fillRect(70, 4, hud.counter_h, 7);
    ctx.restore();

}

function score() {

    //Muestra los puntos de helio obtenidos en el juego
    ctx.save();
    ctx.fillStyle = "#aaa";
    ctx.fillRect(0, 15, 110, 15);
    ctx.fillStyle = "#000";
    ctx.font = "bold 10px Comic Sans MS";
    ctx.fillText(`H-Points: ${hud.counter_p} / 500`, 2, 26);
    ctx.restore();

    //Comentario, cada que se sumen puntos
    //tan solo cambia el valor de hud.counter_p, 
    //y para la cantidad de helio de la nave es hud.counter_h
    //que hay un intervalo que actualiza el valor en pantalla.

}



function timer() {

    //Muestra el tiempo transcurrido en el juego en segundos
    let x_0 = 240;
    let x_1 = canva.width - 90;
    ctx.save();
    ctx.fillStyle = "#aaa";
    ctx.fillRect(x_1, 0, 90, 15);
    ctx.fillStyle = "#000";
    ctx.arc(x_1, 7.25, 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x_1, 7.5);
    ctx.lineTo(x_1, 3);
    ctx.moveTo(x_1, 8);
    ctx.lineTo(x_1, 2);
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.font = "bold 10px Comic Sans MS";

    if (hud.counter_i == 10) {
        if (hud.counter_s == 100) x_0 -= 5;
        if (hud.counter_s == 1000) x_0 -= 5;
        hud.counter_i = 0;
        ctx.fillText("Time: " + hud.counter_s++ + "s", x_0, 11);

        if (hud.counter_s % 10 === 0) {
            ballon_atributes();
        }

    } else {
        hud.counter_i++;
        ctx.fillText("Time: " + hud.counter_s + "s", x_0, 11);

    }


    //Comentario para Edgar, te recomiendo que pongas la función o el codigo que vayas
    //a utilizar apartir de aqui, porque tu parte depende el timer.

    //Te recomiendo tomar el valor de hud.counter_s que es la que guarda los segundos
    //trancurridos en el juego y que para modificar el valor de el tanque de helio
    //cambia el valor de hud.counter_h que es la cantidad de helio del tanque.
    //Estos valores se actualizan en pantalla.


    ctx.restore();

}

function drawShip() {
    //Muestra la nave en el canvas
    ctx.save();
    ctx.drawImage(spaceship, ship.x, ship.y, ship.width, ship.height);
    ctx.restore();
}

function KeyboardEvent() {
    addEvent(document, "keydown", function (e) {
        //Key pulsada true
        keyboard[e.keyCode] = true;
    });

    addEvent(document, "keyup", function (e) {
        //Key pulsada false
        keyboard[e.keyCode] = false;
        // console.log("Disabled");
    });

    function addEvent(element, nameElement, eFunction) {
        if (element.addEventListener) {
            //General Browsers
            element.addEventListener(nameElement, eFunction, false);
        }
        else if (element.attachEvent) {
            //Explorer
            element.attachEvent(nameElement, eFunction);
        }
    }
}

function moveShip() {
    var limit1 = ctx.canvas.height - 120;
    var limit2 = ctx.canvas.height - 20;
    // console.log("Limite 1: " + limit1);
    // console.log("Limite 2: " + limit2);
    // console.log("Y: " + ship.y);
    if (keyboard[39]) {
        //UP
        if (ship.y != limit1) { ship.y -= 10 }
        else if (ship.y == limit1) ship.y = limit1
    }
    if (keyboard[37]) {
        //DOWN
        if (ship.y != limit2) { ship.y += 10 }
        else if (ship.y == limit2) ship.y = limit2
    }
}


function ballon_atributes() {
    loadBallons();
    resetPosition();
    newDistancex();
    newDistancey();
    newColor();
}

function loadBallons() {
    //Se cargaran las imagenes
    ballon_imgs[0] = new Image();
    ballon_imgs[0].src = 'images/Balloon/blue1.png';
    ballon_imgs[1] = new Image();
    ballon_imgs[1].src = 'images/Balloon/green1.png';
    ballon_imgs[2] = new Image();
    ballon_imgs[2].src = 'images/Balloon/orange1.png';
    ballon_imgs[3] = new Image();
    ballon_imgs[3].src = 'images/Balloon/rose1.png';
    ballon_imgs[4] = new Image();
    ballon_imgs[4].src = 'images/Balloon/yellow1.png';

}


function newDistancex() {
    //Distancias en la que se moveran los glovos
    ballon_distance[0] = Math.floor(Math.random() * 85) + 10;
    ballon_distance[1] = Math.floor(Math.random() * 85) + 15;
    ballon_distance[2] = Math.floor(Math.random() * 85) + 5;
    ballon_distance[3] = Math.floor(Math.random() * 85) + 20;
    ballon_distance[4] = Math.floor(Math.random() * 85) + 10;
    ballon_distance[5] = Math.floor(Math.random() * 85) + 15;
}

function newDistancey() {
    //Distancias en la que se moveran los glovos
    ballon_distance[6] = Math.floor(Math.random() * 50) + 10;
    ballon_distance[7] = Math.floor(Math.random() * 50) + 15;
    ballon_distance[8] = Math.floor(Math.random() * 50) + 5;
    ballon_distance[9] = Math.floor(Math.random() * 50) + 20;
    ballon_distance[10] = Math.floor(Math.random() * 50) + 10;
    ballon_distance[11] = Math.floor(Math.random() * 50) + 15;
}

function newColor() {
    //Se determinaran los colores
    ballon_color[0] = ballon_imgs[Math.floor(Math.random() * 5)];
    ballon_color[1] = ballon_imgs[Math.floor(Math.random() * 5)];
    ballon_color[2] = ballon_imgs[Math.floor(Math.random() * 5)];
    ballon_color[3] = ballon_imgs[Math.floor(Math.random() * 5)];
    ballon_color[4] = ballon_imgs[Math.floor(Math.random() * 5)];
    ballon_color[5] = ballon_imgs[Math.floor(Math.random() * 5)];
    ballon_color[6] = ballon_imgs[Math.floor(Math.random() * 5)];
}

function resetPosition() {
    //Se reinicia la posición, se eliminan los globos para hacer nuevos, para optimizar el uso de memoria
    //cada 10 segundos se reinicia, según el tiempo de timer(), pude revisar la función para mayor claridad
    limity[0] = canva.height;
    limity[1] = canva.height;
    limity[2] = canva.height;
    limity[3] = canva.height;
    limity[4] = canva.height;
    limity[5] = canva.height;
    limity[6] = canva.height;

}

function ballon_draw() {

    //Se dibujan las imagenes de los globos aquí

    //Aqui se determina la velocidad de los globos, una ayuda para quien se encarga de ello
    for (let i = 0; i < ballon_color.length; i++) {

        if (ballon_color[i] === ballon_imgs[0] /* Evalua si los globos son azules*/) {
            limity[i] -= 3;
        } else {
            limity[i] -= 2;
        }

    }

    ctx.save();
    ctx.drawImage(ballon_color[0], limitx, limity[0], ballon.width, ballon.height);
    ctx.restore();

    ctx.save();
    ctx.drawImage(ballon_color[1], limitx + ballon_distance[0], limity[1] + ballon_distance[6], ballon.width, ballon.height);
    ctx.restore();

    ctx.save();
    ctx.drawImage(ballon_color[2], limitx + ballon_distance[1], limity[2] + ballon_distance[7], ballon.width, ballon.height);
    ctx.restore();

    ctx.save();
    ctx.drawImage(ballon_color[3], limitx + ballon_distance[2], limity[3] + ballon_distance[8], ballon.width, ballon.height);
    ctx.restore();

    ctx.save();
    ctx.drawImage(ballon_color[4], limitx + ballon_distance[3], limity[4] + ballon_distance[9], ballon.width, ballon.height);
    ctx.restore();

    ctx.save();
    ctx.drawImage(ballon_color[5], limitx + ballon_distance[4], limity[5] + ballon_distance[10], ballon.width, ballon.height);
    ctx.restore();

    ctx.save();
    ctx.drawImage(ballon_color[6], limitx + ballon_distance[5], limity[6] + ballon_distance[11], ballon.width, ballon.height);
    ctx.restore();

}

// Añadido

function frameloop() {
    //Encargada de llamar a todas las funciones que componen el juego

    moveShip();
    drawBackground();
    drawShip();
    ballon_draw();
    timer();
    helioTank();
    score();
}

KeyboardEvent();