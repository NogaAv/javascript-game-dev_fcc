const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800; //we give the same value as in the styles.css file
const CANVAS_HEIGHT = canvas.height = 700;
let gameSpeed = 15;


const backgroundLayer1 = new Image(); //exactly like: document.createElement("img");
backgroundLayer1.src = 'backgroundLayers/layer-1.png';
const backgroundLayer2 = new Image(); 
backgroundLayer2.src = 'backgroundLayers/layer-2.png';
const backgroundLayer3 = new Image(); 
backgroundLayer3.src = 'backgroundLayers/layer-3.png';
const backgroundLayer4 = new Image(); 
backgroundLayer4.src = 'backgroundLayers/layer-4.png';
const backgroundLayer5 = new Image(); 
backgroundLayer5.src = 'backgroundLayers/layer-5.png';

let x = 0; //represents coordinate x of the 1'st bkground img
let x2 = 2400;

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(backgroundLayer4, x, 0);
    ctx.drawImage(backgroundLayer4, x2, 0);

    //We know that the imges assets width is: 2400 px
    if(x < -2400) x = 2400 + x2 - gameSpeed; // +x2 - gameSpeed  : this is used for corecting a gap between x and x2 images painted in the canvas
   // x--;   //images moving to the left 1 px per frame
   else x -= gameSpeed;
   if(x2 < -2400) x2 = 2400 + x - gameSpeed;
   else x2 -= gameSpeed;



    requestAnimationFrame(animate);
}

animate();

