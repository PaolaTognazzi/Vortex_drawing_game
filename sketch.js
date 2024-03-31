let numeroOggetti = 20;
let t = new Array(numeroOggetti);
let posX, posY, startPosX, startPosY;
let direzioneVortice = 1;
let timer, velocita;
let curl = 0.01;
let mapLato = true;
let largoRect = 30;
let mapTrasparenza = true;
let trasparenza = 255;

let aperto = true;
let stessaPartenza = true;
let partenzaPointX;
let partenzaPointY;
let drawState = 0;
let drawMap = false;
let rotazione;
let rotazioneSingola = true;

function setup() {
  createCanvas(1100, 700);
  smooth();
  background(255);
  velocita = 1000;
  timer = millis();
  iniziaPartenza();
  inizioVortice();
  
}

function iniziaPartenza() {
  partenzaPointX = random(width);
  partenzaPointY = random(height);
}

function inizioVortice() {
    if (aperto) {
        let arriviX = mouseX;
        let arriviY = mouseY;
        posX = random(arriviX - 50, arriviX + 50);
        posY = random(arriviY - 50, arriviY + 50);
    }

    if (rotazioneSingola) {
        rotazione = random(PI);
    }
    for (let index = 0; index < t.length; index++) {
        if (stessaPartenza) {
            startPosX = partenzaPointX;
            startPosY = partenzaPointY;
        } else {
            startPosX = random(width);
            startPosY = random(height);
        }
        if (!aperto) {
            posX = random(width);
            posY = random(height);
        }
        if (!rotazioneSingola) {
            rotazione = random(TWO_PI);
        }

        let grossore = random(0.4, 1);
        let grigio = random(100, 255);
        t[index] = new Trazo(startPosX, startPosY, curl, 0.02, posX, posY, grossore, rotazione, grigio);
    }
}

function draw() {
  // noCursor();
  // fill(255,10);
  // rect(0,0,width,height);
  // background(255);
  mappings();
  tempo();

  for (let index = 0; index < t.length; index++) {
    t[index].drawTrazo();
  }
 
}

function tempo() {
  if (millis() - timer > velocita) {
    inizioVortice();
    timer = millis();
  }
}

function mappings() {
  velocita = map(mouseX, 0, width, 500, 8000);

  if (mapLato) {
    largoRect = map(mouseY, 0, height, 10, 60);
  }
  
  
  if (mapTrasparenza == false) {
    trasparenza = 255;
  } else if (mapTrasparenza==true){
    let d = dist(width / 2, height / 2, posX, posY);
    let maxDist = dist(0, 0, width / 2, height / 2);
    trasparenza = map(d, 0, maxDist, 50, 255);
  }
}

function mousePressed() {
  direzioneVortice *= -1;
}



// CLASS TRAZO

class Trazo {
  
x=0; 
y=0; 
px=0; 
py=0; // current position
tx=0;
ty=0;// target position

dir = createVector();
 
 perpendicular_dir=createVector();
 easing=0;
 easing_perpendicular=0;
 arrivoX=0;
arrivoY=0;
 departureX=0;
departureY=0; 
valoreDepX=0; valoreDepY=0;
scalato=0;
rotatogradient=0;



 speed = 0.05;
radio=0; 
angle=0;
dis=0;
variabileAmplitude=0;

  constructor(startX_, startY_, easing_dir, easing_normal, endX_, endY_, scalato_, rotato_, gradient_) {
    this.easing = easing_dir;
    this.easing_perpendicular = easing_normal;

    this.arrivoX = endX_;
    this.arrivoY = endY_;
    this.departureX = startX_;
    this.departureY = startY_;
    this.valoreDepX = this.departureX;
    this.valoreDepY = this.departureY;
    this.x = this.departureX;
    this.y = this.departureY;
    this.tx = this.arrivoX;
    this.ty = this.arrivoY;
    this.px = mouseX;
    this.py = mouseY;
    this.dir = createVector(this.tx - this.x, this.ty-this.y);
    this.perpendicular_dir = createVector(this.dir.y, -this.dir.x);
    this.scalato = scalato_;
    this.rotato = rotato_;
    this.gradient = gradient_;

    this.radio = 0;        // Initialized to 0
            // Initialized to 0
        this.dis = 0;          // Initialized to 0
        this.variabileAmplitude = 0; 
    this.angle = 1.0;
  }
  
  drawTrazo() {
    this.tx = this.arrivoX;
    this.ty = this.arrivoY;
 
    this.dir.set(this.tx - this.departureX, this.ty - this.departureY, 0);
   
    this.perpendicular_dir.set(this.dir.y, -this.dir.x, 0); 

    this.px = this.departureX;
    this.py = this.departureY;

    this.departureX = this.departureX + this.dir.x * this.easing - (this.perpendicular_dir.x * this.easing_perpendicular) * direzioneVortice;
    this.departureY = this.departureY + this.dir.y * this.easing - (this.perpendicular_dir.y * this.easing_perpendicular) * direzioneVortice;

    this.eventos();
}

eventos() {
    if (drawState == 0) {
        push();
      /*console.log("departureX:", this.departureX, "departureY:", this.departureY);*/
        translate(this.departureX, this.departureY);
        rotate(this.rotato);
        scale(1);
        stroke(0);
        strokeWeight(1);
        fill(0, 0, 255, trasparenza);
        rect(0, 0, largoRect, 140);
        pop();
    }
    if (drawState == 1) {
        push();
        translate(this.departureX, this.departureY);
        fill(204);
        stroke(0);
        ellipse(0, 0, 20, 20);
        pop();
    }
    if (drawState == 2) {
        push();
        translate(this.departureX, this.departureY);
        rotate(this.rotato);
        scale(this.scalato);
        fill(255, this.gradient, 0);
        let dis = dist(this.arrivoX, this.arrivoY, this.departureX, this.departureY);
        let maxDist = dist(0, 0, width / 2, height / 2);
        this.radio = 20 + sin(this.angle) * this.variabileAmplitude;
      this.angle += this.speed;
        this.variabileAmplitude = map(dis, 0, maxDist, 1, 100);
        ellipse(0, 0, this.radio, this.radio);
        
        pop();
    }
}

movement() {
    this.departureX = this.valoreDepX;
    this.departureY = this.valoreDepY;
    this.tx = this.arrivoX;
    this.ty = this.arrivoY;
    this.px = mouseX;
    this.py = mouseY;
}

}

function keyPressed() {
  // Removed inizioVortice() call as it's commented out in original

  if (key === '1') drawState = 0;
  else if (key === '2') drawState = 1;
  else if (key === '3') drawState = 2;
  else if (key === '4') drawState = 3;
  else if (key === '5') drawMap = true;

  switch (key) {
    // case'1': // Case is commented out in original
    //   // background(255);
    //   break;

    case '2':
      background(255);
      break;
    case '3':
      background(255);
      break;
    case '5':
      background(255);
      break;
  
    case 'l':
      mapLato = !mapLato;
      break;
    case 't':
      mapTrasparenza = !mapTrasparenza;
      break;

    case 'r':
      rotazioneSingola = !rotazioneSingola;
      break;
    case 'a':
      aperto = !aperto;
      break;

    case 's':
      stessaPartenza = !stessaPartenza;
      break;

    case 'i':
      iniziaPartenza();
      break;
    case 'z':
      curl = 0.001;
      break;
    case 'x':
      curl = 0.01;
      break;

    case 'c':
      curl = 0.05;
      break;
    case ' ':
      let image_name = day() + "" + hour() + "" + minute() + "" + second() + "" + millis() + ".png";
      save(image_name);
      break;
  }
}