/** @type {HTMLCanvasElement} *///<- This annotation added for the IDE to suggest canvas methods

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 700;

/* Testing:
//fillStyle = This will apply to all fill shapes. unless I declair it again with different color
ctx.fillStyle = 'white'; //'.fillStyle' = for filling any type of shape with that chosen color
ctx.fillRect(50, 50, 100, 150); 
*/
const explosions = [];//will hold all active explosions objects I create
//2:30:00 - Explanation for the followings:
let canvasPosition = canvas.getBoundingClientRect();//'getBoundingClientRect' = built-in javascript method that returns an object providing information on the size of the element and it's position relative to the view-port
//console.log(canvasPosition); //DOMRect object. here- returns the canvas positions. I can use it to measure any html objet on my page

//2:47 - adding sound - from website:
//https://opengameart.org/

class Explosion{
    constructor(x, y){ //We want to pass coordinates of dot where for example- 2 objects collided, or where user mouse-clicked on screen
        this.spriteWidth = 200;//-this is result of calculating the width of the spritesheet divided by number of frames (In this case: 1,000 px wide, divided by 5 frames)
        this.spriteHeight = 179;
        // this.width = this.spriteWidth * 0.5; // multiply by 0.5 is better performance then dividing by 2
        // this.height = this.spriteHeight * 0.5; 
        this.width = this.spriteWidth * 0.7; 
        this.height = this.spriteHeight * 0.7;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = 'boom.png';
        this.frame = 0;
        this.timer = 0; //For slowing down the animation
        //angle - for rotation movement of the explosion:
        this.angle = Math.random() * 6.2; //circle is 360 degrees, html canvas rotate() method expect radians, so - 360 degrees are roughly 6.2 radians
        this.sound = new Audio();
        this.sound.src = 'boom.wav';
    }
    update(){
        if(this.frame === 0) this.sound.play();//I want the sound to play 1 time for single explosion
        this.timer++;
        if(this.timer % 10 === 0){
            this.frame++;
        }
    }
    draw(){
        //2:40:00 - Adding rotation movement for whenever we create new explosion: We do that by adding: save() and restore() built-in canvas methods:
        ctx.save(); //for rotation movement -> we first save the current state of canvas to make sure the following changes affect only one draw call.
        ctx.translate(this.x, this.y); //..we then call translate to set rotation central point. Here we want it to rotate around it's center
        ctx.rotate(this.angle);//angle for the rotation. we rotate the entire canvas context by a random angle value
        //we draw our image
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight,
            0 - this.width/2, 0 - this.height/2, this.width, this.height); //NOTE: 0, 0 - because the this.x and this.y were already captured in the 'ctx.translate(this.x, this.y)' code above. and also we divide by 2 in order to centrelize the animation
        ctx.restore(); //we restore canvas context state to the original safe-point to make sure the translate and rotate only effect one draw call of one object.

    }
}

//NOTE: e.x gives values that doesn't account for the top and left margin of the black canvas. So we need to offset the coordinates to account for it
/* window.addEventListener('click', function(e){
     ctx.fillStyle = 'white';
     ctx.fillRect(e.x - canvasPosition.left - 25, e.y - canvasPosition.top - 25, 50, 50); //-25 : half of the rec 50px width and height - In order for the rectangle to be drawn in the middle
 })
*/
window.addEventListener('click', function(e){
    createAnimation(e);
});

// window.addEventListener('mousemove', function(e){
//     createAnimation(e);
// });

function createAnimation(e){
    let positionX = e.x - canvasPosition.left;
    let positionY = e.y - canvasPosition.top;
    explosions.push(new Explosion(positionX, positionY));
}

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for(let i = 0 ; i < explosions.length ; ++i){
        explosions[i].update();
        explosions[i].draw();
        if(explosions[i].frame === 5){
            explosions.splice(i, 1);
            --i; //adjusting i after the splicing
        }
    }
    requestAnimationFrame(animate);
};

animate();


