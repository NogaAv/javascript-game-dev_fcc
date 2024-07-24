//1:58:00
/** @type {HTMLCanvasElement} *///<- This annotation added for the IDE to suggest canvas methods

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
//canvas width and height tneed to be similar to those in styles.css
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;
const numberOfEnemies = 20;
const enemiesArray = [];

let gameframe = 0;

class Enemy{
    constructor(){
        this.image = new Image();
        this.image.src = './enemies/enemy3.png';
        this.speed = Math.random() * 4 + 1; //To get values between: 1 and 5
        this.spriteWidth = 218; //width of single frame in spritesheet
        this.spriteHeight = 177; //height of this specific spritesheet
        this.width = this.spriteWidth / 2.5; //I need the width to be proportion to the spritesheet width in order to not distort the image proportions
        this.height = this.spriteHeight / 2.5; //I need the height to be proportion to the spritesheet height in order to not distort the image proportions
        this.x = Math.random() * (canvas.width - this.width); //added '- this.width' to adjust bats to be displayed inside the canvas
        this.y = Math.random() * (canvas.height - this.height);
        this.frame = 0; //This will be used to lip between frames of the image spritsheet to get animation of enemy moving wings
        //I want to randomize the bats speed and direction of wings movements:
        this.flapSpeed = Math.floor(Math.random() * 3 + 1); //random between 1-3 (Math.floor() to get a whole number)
        this.angle = 0; //Math.random() * 2;
        this.angleSpeed = Math.random() * 2 + 0.5;
        // this.curve = Math.random() * 200 + 50;
    }
    update(){
        //2:00:00 cos and sin explained!
        // this.x = this.curve * Math.sin(this.angle * Math.PI/90) + canvas.width/2 - this.width/2;
        // this.y = this.curve * Math.cos(this.angle * Math.PI/270) + canvas.height/2 - this.height/2;
        this.x = canvas.width/2 * Math.cos(this.angle * Math.PI/90) + canvas.width/2 - this.width/2;
        this.y = canvas.height/2 * Math.sin(this.angle * Math.PI/270) + canvas.height/2 - this.height/2;

        this.angle += this.angleSpeed; //and then I change the angel to get the sin wavy movement
        //To get endless fly movement to the left:
        if(this.x + this.width < 0) this.x = canvas.width;
        if(gameframe % this.flapSpeed === 0){  
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height);

    }
}

for(let i = 0 ; i < numberOfEnemies ; ++i){
    enemiesArray.push(new Enemy());
}

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    enemiesArray.forEach(enemy => {
        enemy.update();
        enemy.draw();
    })
 
    gameframe++;
    requestAnimationFrame(animate); //'requestAnimationFrame()' tells the browser you wish to perform an animation frame request and call a user-supplied callback function before the next repaint. The frequency of calls to the callback function will generally match the display refresh rate.
}

animate();