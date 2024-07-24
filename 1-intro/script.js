let playerState = 'run';
const dropDown = document.getElementById('animations');
dropDown.addEventListener('change', (e) => {
  playerState = e.target.value;
})

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image(); //This is a built-in img class constructor. It will create img HTML element
playerImage.src = '/assets/shadow_dog.png';

const spriteWidth = 575; //Width of 1 frame from the spritesheet. This is result of calculation 6876px width(=the spritesheet width) divided by 12 columns.
const spriteHeight = 523; //height of 1 frame. The result of 5230px (=the spritesheet height) divided by 10 rows.


//These two values are used for slowing down the animation speed (by using the % in if statement in the animation loop)
let gameFrame = 0; //counter for the loop rotations
const staggerFrames = 5; //every x rotations of the loop, we go to the next img in the row spreadsheet.

const spritAnimations = [];
const animationStates = [
  {
    name: 'idle',
    frames: 7
  },
  {
    name: 'jump',
    frames: 7
  },
  {
    name: 'fall',
    frames: 7
  },
  {
    name: 'run',
    frames: 9
  },
  {
    name: 'dizzy',
    frames: 11
  },
  {
    name: 'sit',
    frames: 5
  },
  {
    name: 'roll',
    frames: 7
  },
  {
    name: 'bite',
    frames: 7
  },
  {
    name: 'ko',
    frames: 12
  },
  {
    name: 'gethit',
    frames: 4
  },
];

animationStates.forEach((state, index) => {
  let frames = {
    loc: [],
  }
  for(let i = 0 ; i < state.frames ; ++i){
    frames.loc.push({
      x: i * spriteWidth,
      y: index * spriteHeight,
    })
  }
  spritAnimations[state.name] = frames;
});

//This is our animation loop
function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); //clear the canvas between every animation frame
  
    let position = Math.floor(gameFrame/staggerFrames) % spritAnimations[playerState].loc.length; //we use Math.floor() to get a whole int number. % used for circular rotation of the imges in the specific y row of the spritesheet.
    let frameX = spriteWidth * position;
    let frameY = spritAnimations[playerState].loc[position].y;

   //ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);  //<-cut out from source(s) to destination(d)
   ctx.drawImage(playerImage, frameX, frameY, 
                 spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);


    gameFrame++;
    requestAnimationFrame(animate); //This is a built-in method that simply run a function we pass to it. Here we call it inside the function and so we create recursion - the animation loop.

};

animate();


