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
        this.x = x - this.width/2; //division to centrelize the animation
        this.y = y - this.height/2;
        this.image = new Image();
        this.image.src = 'boom.png';
        this.frame = 0;
        this.timer = 0; //For slowing down the animation
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
        //drawImage() has 3 versions. with 3, 5 and 9 arguments - depends on how much control I want over my drawing image
        //We will use the longest version with 9 args:
        //ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height);

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


