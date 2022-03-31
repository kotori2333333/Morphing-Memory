let dcgan;
let museum;
let pen;
let pc;
let base;

let inst = true;

let vector = [];
let grids = [];


let gridChange = 0.05;

let scroll;
let range = 0;

let penSize = 1.5

function preload() {
    dcgan = ml5.DCGAN('model/manifest.json');
    scroll = loadImage('assets/scroll.png')
    museum = loadImage('assets/museum.png')
    pen = loadImage('assets/pen.png')
    pc = loadImage('assets/pc.png')
    base = loadImage('assets/base.png')
}

function setup() {
    createCanvas(2400, 1300);
    noCursor();
    // start with random vector
    for (let i = 0; i < 512; i++) {
        vector[i] = random(-1, 1);
    }

    counter = 0
    for(i=0;i<16;i++){
      for(j=0;j<16;j++){
        grids.push(new Grid(1600+i*32,350+j*32,counter));
        counter+=1
      }
    }
    generate();
}

function draw(){

}

function keyPressed(){
  if(key=='r'){
  for (let i = 0; i < 512; i++) {
      vector[i] = random(-1, 1);
  }}
  else if(key == 't'){
    inst = !inst;
  }
}

function walk() {
    if(keyIsPressed){
      if(key == "w"){
        gridChange += 0.008;
      }
      else if(key == "s"){
        gridChange -= 0.008;
      }
      else if(key == "a"){
        penSize -= 0.015;
      }
      else if(key == "d"){
        penSize += 0.015;
      }

      gridChange = constrain(gridChange,-0.1,0.1)
      penSize = constrain(penSize,0,4)
    }

    for (let i = 0; i < 512; i++) {
        vector[i] += random(-0.08, 0.08);
        vector[i] = constrain(vector[i],-2,2)
        // vector[i] -= 0.1;

    }
}

function generate() {
  if(!mouseIsPressed){
    walk();}
    dcgan.generate(displayImage, vector);
}

function displayImage(err, result) {
    if (err) {
        console.log(err);
        return;
    }
     background(255)
     image(museum,0,0,1400,1400)

    image(scroll,32*16,300,170*3-100,200*3-100)
    image(pc,32*16+550,130,2388/1.5,1668/1.5)

    image(result.image, 32*16+55, 400, 300, 300);

    for (let i = 0; i < grids.length; i++) {
      grids[i].detection()
      grids[i].display();
    }



    push()
    imageMode(CENTER)
    penScale = map(penSize,0,4,1,4)
    image(pen,mouseX,mouseY-60,170*1.5*penScale,120*1.5*penScale)



    image(base,750+900,1030-40,2388/5,1668/5)
    fill(map(gridChange,-0.1,0.1,0,255),180)
    noStroke()
    inkSize = map(penSize,0,4,50,150);
    ellipse(730+900,1060-40,inkSize,inkSize)

    pop()

    push()

    fill(255,150,150)
    textAlign(CENTER)
    if(inst){
      textSize(25)
// W to make ink brighter
// S to to make ink darker
// A to decrease brush size
// D to increase brush size
// R to resize

      text("Draw on the computer screen and see how the artwork responds",700,950);
      text("W to make ink brighter",700,1000);
      text("S to to make ink darker",700,1050);
      text("A to decrease brush size",700,1100);
      text("D to increase brush size",700,1150);
      text("R to resize",700,1200);

    }
    else{
      textSize(70)
      text("Press t to show instructions",700,1100)
    }
    pop()

    generate();
}



class Grid{
  constructor(x,y,counter){
    this.x = x
    this.y = y
    this.side = 32;
    this.counter = counter
    this.fill = 0
  }

    display(){

      push()
      fill(map(vector[this.counter],-2,2,0,255))
      rect(this.x,this.y,this.side,this.side)
      pop()


    }

    detection(){
      if(mouseIsPressed){
        if((mouseX>this.x-penSize*32) && (mouseX<this.x+this.side+penSize*32)&& (mouseY>this.y-penSize*32)&& (mouseY<this.y+this.side+penSize*32)  ){

          vector[this.counter]+=gridChange
        }
      }


    }





}
