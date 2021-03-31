////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////// TRATAR DE SIEMPRE LEER LOS COMENTARIOS //////////
////////// Aún no está completo, pero se está     //////////
////////// terminando, ver en dado caso, video    //////////
////////// de Código Facilito con Canvas          //////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

var canva = document.querySelector(`canvas`);
const btnStart = document.querySelector(`#btn-start`);

var ctx = canva.getContext(`2d`);

var keyboard = {};

// Images
var spaceship = new Image();
spaceship.src = 'images/Ship/spaceship.png';
let spaceshipLaser = new Image();
spaceshipLaser.src = 'images/Ship/laser.png';
var fondo = new Image();

// Sounds
let sounds = {
  fire: new Audio('../resource/fire.mp3'),
  ballonExplosion: new Audio('../resource/ballon-explosion.mp3'),
  backgroundMusic: new Audio('../resource/background.mp3'),
};

let shoots = [],
  ballons = [];

// Objeto nave
var ship = {
  x: ctx.canvas.width - 20,
  y: ctx.canvas.height - 80,
  width: 20,
  height: 20,
};

// Objeto globo
var ballon = {
  x: ctx.canvas.width - 50,
  y: ctx.canvas.height - 50,
  width: 30,
  height: 30,
};

// The Ship movement limits
var LIMIT_SHIP_TOP = ctx.canvas.height - 120;
var LIMIT_SHIP_BOTTOM = ctx.canvas.height - 20;

var hud = {
  //Cantidad de intervalos transcurridos
  counter_i: 1,
  //Cantidad de segundos transcurridos
  counter_s: 0,
  //Cantidad de helio del tanque (esta en %)
  counter_h: 100,
  //Suma de puntos * globos reventados
  counter_p: 0,
};

//Evalua si el juego inicio
var controls = {
  gameInit: false,
};

//Distancias en la que se moveran los glovos
var limity = new Array();
var limitx = canva.width / 4;

//Se determinaran los colores
var ballon_color = new Array();

//Se determinaran las distancias
var ballon_distance = new Array();

//Se determina las imagenes de los globos
var ballon_imgs = new Array();

btnStart.onclick = function () {
  //Evalua si el juego ha comenzado
  if (controls.gameInit == false) {
    function Cargar() {
      fondo.src = 'images/fondo-animado-cielo-azul-full-apk.png';

      // Cargar ballons
      loadBallons();
      ballon_atributes();

      //Fondo
      fondo.onload = function () {
        document.querySelector(`.power`).classList.add('power-on');
        setInterval(frameloop, 100);
        setInterval('RestarVida()', 11000);
        // este fue el otro sett interval que cree con la funcion restar vida.
      };

      //Reproducir sonido de fondo
      sounds.backgroundMusic.play();
    }
    //Cargan los elementos del juego
    Cargar();

    this.value = 'Restart';

    controls.gameInit = true;
  } else {
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
  ctx.fillStyle = '#aaa';
  ctx.fillRect(0, 0, 175, 15);
  ctx.fillStyle = '#000';
  ctx.font = 'bold 10px Comic Sans MS';
  ctx.fillText(`Helio: ${hud.counter_h}%`, 2, 11);
  ctx.fillStyle = 'red';
  ctx.fillRect(70, 4, hud.counter_h, 7);
  ctx.restore();
}

function score() {
  //Muestra los puntos de helio obtenidos en el juego
  ctx.save();
  ctx.fillStyle = '#aaa';
  ctx.fillRect(0, 15, 110, 15);
  ctx.fillStyle = '#000';
  ctx.font = 'bold 10px Comic Sans MS';
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
  ctx.fillStyle = '#aaa';
  ctx.fillRect(x_1, 0, 90, 15);
  ctx.fillStyle = '#000';
  ctx.arc(x_1, 7.25, 7, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x_1, 7.5);
  ctx.lineTo(x_1, 3);
  ctx.moveTo(x_1, 8);
  ctx.lineTo(x_1, 2);
  ctx.strokeStyle = '#fff';
  ctx.stroke();
  ctx.font = 'bold 10px Comic Sans MS';

  if (hud.counter_i == 10) {
    if (hud.counter_s == 100) x_0 -= 5;
    if (hud.counter_s == 1000) x_0 -= 5;

    hud.counter_i = 0;
    ctx.fillText('Time: ' + hud.counter_s++ + 's', x_0, 11);

    if (hud.counter_s % 10 === 0) {
      ballon_atributes();
    }
  } else {
    hud.counter_i++;
    ctx.fillText('Time: ' + hud.counter_s + 's', x_0, 11);
  }

  ctx.restore();
}

// esta funcion es para restar la vida cada 5 segundos junto a otro set interval que hice arriba para los seg
function RestarVida() {
  hud.counter_h = hud.counter_h - 5;
}

function SumarVida(){

  

}

function drawShip() {
  //Muestra la nave en el canvas
  ctx.save();
  ctx.drawImage(spaceship, ship.x, ship.y, ship.width, ship.height);
  ctx.restore();
}

function drawLaser() {
  ctx.save();

  shoots.forEach(shoot => {
    ctx.drawImage(spaceshipLaser, shoot.x, shoot.y, shoot.width, shoot.height);
  });

  ctx.restore();
}

function moveLaser(speedInX = 2) {
  //velocidad de los disparos
  shoots = shoots.map((shoot, id) => {
    shoot.x -= speedInX;
    return shoot;
  });

  // eliminar disparos cuando llegen al final
  shoots = shoots.filter(shoot => shoot.x > 0);
}

function shoot() {
  shoots.push({
    x: ship.x - ship.width,
    y: ship.y + 5,
    width: 15,
    height: 10,
  });
}

function KeyboardEvent() {
  addEvent(document, 'keydown', function (e) {
    e.preventDefault();
    //Key pulsada true
    keyboard[e.keyCode] = true;
  });

  addEvent(document, 'keyup', function (e) {
    e.preventDefault();
    //Key pulsada false
    keyboard[e.keyCode] = false;
    // console.log("Disabled");
  });

  function addEvent(element, nameElement, eFunction) {
    if (element.addEventListener) {
      //General Browsers
      element.addEventListener(nameElement, eFunction, false);
    } else if (element.attachEvent) {
      //Explorer
      element.attachEvent(nameElement, eFunction);
    }
  }
}

function moveShip() {
  // console.log("Limite 1: " + limit1);
  // console.log("Limite 2: " + limit2);
  // console.log("Y: " + ship.y);
  if (keyboard[39]) {
    //UP
    if (ship.y != LIMIT_SHIP_TOP) {
      ship.y -= 10;
      8;
    } else {
      alert('Has llegado al limite de altura!' + document.location.reload());
    }
  }

  if (keyboard[37]) {
    //DOWN
    if (ship.y != LIMIT_SHIP_BOTTOM) {
      ship.y += 10;
    } else
      alert(
        'Has llegado al limite mas bajo de altura!' + document.location.reload()
      );
  }

  if (keyboard[32]) {
    if (!keyboard.fire) {
      shoot();
      sounds.fire.play();
      keyboard.fire = true;
    }
  } else {
    keyboard.fire = false;
  }
}

function ballon_atributes() {
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

// aqui cuando se acaba el helio se resetea el juego
function gameover() {
  if (hud.counter_h === 0) {
    sounds.backgroundMusic.pause();
    alert('KBOOM se te acabo el helio ' + document.location.reload());
  }
}

function ballon_draw() {
  //Se dibujan las imagenes de los globos aquí

  //Aqui se determina la velocidad de los globos
  for (let i = 0; i < ballon_color.length; i++) {
    if (
      ballon_color[i] === ballon_imgs[0] /* Evalua si los globos son azules*/
    ) {
      limity[i] -= 4;
    } else {
      // Algoritmo para que la velocidad de los grlobos sea aleatoria
      function velocidadAleatoria(inferior, superior) {
        let numPosibilidades = superior - inferior;
        let aleatorio = Math.random() * (numPosibilidades + 1);
        aleatorio = Math.floor(aleatorio);
        return inferior + aleatorio;
      }

      limity[i] -= velocidadAleatoria(1, 3);
    }
  }
  ballons = [];
  //1
  ballons.push({ x: limitx, y: limity[0] });
  //2
  ballons.push({
    x: limitx + ballon_distance[0],
    y: limity[1] + ballon_distance[2],
  });
  //3
  ballons.push({
    x: limitx + ballon_distance[1],
    y: limity[2] + ballon_distance[7],
  });
  //4
  ballons.push({
    x: limitx + ballon_distance[2],
    y: limity[3] + ballon_distance[8],
  });
  //5
  ballons.push({
    x: limitx + ballon_distance[3],
    y: limity[4] + ballon_distance[5],
  });
  //6
  ballons.push({
    x: limitx + ballon_distance[4],
    y: limity[5] + ballon_distance[10],
  });
  //7
  ballons.push({
    x: limitx + ballon_distance[5],
    y: limity[5] + ballon_distance[12],
  });

  ctx.save();
  ctx.drawImage(
    ballon_color[0],
    ballons[0].x,
    ballons[0].y,
    ballon.width,
    ballon.height
  );
  ctx.restore();

  ctx.save();
  ctx.drawImage(
    ballon_color[1],
    ballons[1].x,
    ballons[1].y,
    ballon.width,
    ballon.height
  );
  ctx.restore();

  ctx.save();
  ctx.drawImage(
    ballon_color[2],
    ballons[2].x,
    ballons[2].y,
    ballon.width,
    ballon.height
  );
  ctx.restore();

  ctx.save();
  ctx.drawImage(
    ballon_color[3],
    ballons[3].x,
    ballons[3].y,
    ballon.width,
    ballon.height
  );
  ctx.restore();

  ctx.save();
  ctx.drawImage(
    ballon_color[4],
    ballons[4].x,
    ballons[4].y,
    ballon.width,
    ballon.height
  );
  ctx.restore();

  ctx.save();
  ctx.drawImage(
    ballon_color[5],
    ballons[5].x,
    ballons[5].y,
    ballon.width,
    ballon.height
  );
  ctx.restore();

  ctx.save();
  ctx.drawImage(
    ballon_color[6],
    ballons[6].x,
    ballons[6].y,
    ballon.width,
    ballon.height
  );
  ctx.restore();
}

function collisionDetectedBallons(shoot) {
  for (let i = 0; i < ballons.length; i++) {
    let y = ballons[i].y;
    let x = ballons[i].x;

    if (y !== canva.height) {
      // Detectar collision de tiro con globos
      if (
        shoot.x + shoot.width / 2 > x &&
        shoot.x + shoot.width / 2 < x + ballon.width / 2 &&
        shoot.y + shoot.height / 2 > y &&
        shoot.y + shoot.height / 2 < y + ballon.height
      ) {
        // Que hacer cuando el disparo le de a un globo
        limity[i] = canva.height;
        //Si son azules aumenta 10 de puntuacion, de lo contrario 1
        if (ballon_color[i] === ballon_imgs[0]) hud.counter_p += 10;
        else hud.counter_p++;
        shoots = shoots.filter(shooted => shooted !== shoot);
        sounds.ballonExplosion.play();
      }
    }
  }
}

//
function collisionDetectedShoot() {
  // Detectar todos si algun tiro impacto con un globo
  shoots.forEach(shoot => {
    collisionDetectedBallons(shoot);
  });
}

// Añadido

function frameloop() {
  //Encargada de llamar a todas las funciones que componen el juego

  moveShip();
  drawBackground();
  drawShip();
  drawLaser();
  moveLaser(9);
  collisionDetectedShoot();
  ballon_draw();
  timer();
  helioTank();
  score();
  gameover();
}

KeyboardEvent();
