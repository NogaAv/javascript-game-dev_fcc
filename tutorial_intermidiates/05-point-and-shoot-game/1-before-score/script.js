/* 2:49:00

In this tutorial:
1) Pixel perfect collision detection using colors
2) Timestamps and delta time - in order for our game to run at same speed on different machines
3) Array.filter() method
4) Array.sort() method
5) ES6 syntax, spread operator
*/

/** @type {HTMLCanvasElement} */         //NOTE: the /** */ wrapping is vaital

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
//Window: window property
//The window property of a Window object points to the window object itself.
/**
 In web pages, the window object is also a global object. This means:
---------------------------------------------------------
1) Global variables of your script are, in fact, properties of window:
        var global = { data: 0 };
        alert(global === window.global); // displays "true"
2) You can access the built-in properties of the window object without having to prefix them with window.:
        setTimeout("alert('Hi!')", 50); // equivalent to using window.setTimeout().
        alert(window === window.window); // displays "true"
The point of having the window property refer to the object itself, was likely to make it easy to refer to the global object. Otherwise, you'd have to do a manual let window = this; assignment at the top of your script.
 */
const CANVAS_WIDTH = canvas.width = window.innerWidth; 
const CANVAS_HEIGHT = canvas.height = window.innerHeight;
let score = 0;

let timeToNextRaven = 0;
let ravenInterval = 500; //milliseconds
let lastTime = 0;

let ravens = [];
class Raven{
    constructor(){
        this.spriteWidth = 271; //width of single frame
        this.spriteHeight = 194; //height of frame
        this.sizeModifier = Math.random() * 0.6 + 0.4;//I want ravens in defferent sizes
        this.width = this.spriteWidth/2 * this.sizeModifier;
        this.height = this.spriteHeight/2 * this.sizeModifier;
        this.x = CANVAS_WIDTH;//I want ravens to start fly from the right corner of screen
        this.y = Math.random() * (CANVAS_HEIGHT - this.height);//I don't want the bottom ravens to be partially cut, so I added '-this.height'
        this.directionX = Math.random() * 5 + 3; //horizontal speed (3-8)
        this.directionY = Math.random() * 5 - 2.5; //-2.5 to +2.5  - minus values will move the raven upwards andplus values move it downwards
        this.markedForDeletion = false; //ravens that passed the screen will be removed from the ravens array. (new ravens keep being created every 500 ms)
        this.image = new Image();
        this.image.src = 'raven.png';
        this.frame = 0;
        this.maxFrame = 4;
        //I want my ravens to flap wings slower then default:
        this.timeSliceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
    }
    update(deltatime){
        //if raven gets close to top screen (y == 0) or to bottom, it will reverse direction (I don't want ravens to disappear from top or bottom of screen)
        if(this.y < 0|| this.y > CANVAS_HEIGHT - this.height){
            this.directionY *= -1; 
        }
        this.x -= this.directionX;
        this.y += this.directionY;
        if(this.x < 0 - this.width) this.markedForDeletion = true; 
        this.timeSliceFlap += deltatime;
        if(this.timeSliceFlap > this.flapInterval){
            this.frame > this.maxFrame ? this.frame = 0 : this.frame++;
            this.timeSliceFlap = 0;
        }
        
    }
    draw(){
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        // ctx.strokeRect(this.x, this.y, this.width, this.height);

        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height
        );
    }
}
//3:17
function drawScore(){

}

/* timestemp - We want to make sure periodic event is triggered at the same interval on very slow old computers and on brain new super computers */
//To make sure timimg in my games are consistent and based on time in milliseconds rather then on power of my computer, I will use timestamps.
//I will compare how many milliseconds elapsed since my last loop and only when we reach certain amount of time between frames, only then we will draw the next frame.

//So-Where is my timestamp value come from?? -
//Inside animation loop we call 'requestAnimationFrame' with 'animate'. so 'animate' becomes a callback function, and- default javascript behaviour 
//here in the requestAnimationFrame is to pass the callback function a timestamp argument. it's value is in milliseconds.
//NOTE: first timstamp value is 'undefined' and only on second call for 'requestAnimationFrame' there is a proper value. so I pass timestamp = 0 when calling animate(0)
function animate(timestamp){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltatime;
    // console.log(deltatime); //this vlue will differ between computers
    if(timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        timeToNextRaven = 0;
    }
    //Using here "array literal": for creating array on the fly, and the 3 dots are called: 'spread opeator'
    //I am spreading my raven array inside the array I just created.
    //Why Do I use this spread operation syntax instead of the simple regular call: ravens.forEach?  -> 
    // Because this spread operator will enable me to load more arrays of different elements, like explosion particales, other enemies etc..and 
    //I will be able to load them all to this literal array and call common methods on all of them. 
    [...ravens].forEach(object => object.update(deltatime));
    [...ravens].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion);

    requestAnimationFrame(animate); //'requestAnimationFrame()' tells the browser you wish to perform an animation frame request and call a user-supplied callback function before the next repaint. The frequency of calls to the callback function will generally match the display refresh rate.
}

animate(0);//I pass 0 as initial value for timestamp. because- first timstamp value is 'undefined' and only on second call for 'requestAnimationFrame' there is a proper value

