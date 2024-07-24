/** @type {HTMLCanvasElement} *///<- This annotation added for the IDE to suggest canvas methods

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
//canvas width and height tneed to be similar to those in styles.css
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;
const numberOfEnemies = 100;
const enemiesArray = [];

let gameframe = 0;


class Enemy{
    constructor(){
        this.image = new Image();
        this.image.src = './enemies/enemy1.png';
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = Math.random() * 4 - 2; //To get values between: -2 and 2.
        this.spriteWidth = 293; //width of single frame in spritesheet
        this.spriteHeight = 155; //height of this specific spritesheet
        //If I want to prevent 'frozen' enemies movements:
        // this.speed = Math.floor(Math.abs(this.speed)) == 0 ? 1 : this.speed;
        this.width = this.spriteWidth / 2.5; //I need the width to be proportion to the spritesheet width in order to not distort the image proportions
        this.height = this.spriteHeight / 2.5; //I need the height to be proportion to the spritesheet height in order to not distort the image proportions
        this.frame = 0; //This will be used to lip between frames of the image spritsheet to get animation of enemy moving wings
        //I want to randomize the bats speed and direction of wings movements:
        this.flapSpeed = Math.floor(Math.random() * 3 + 1); //random between 1-3 (Math.floor() to get a whole number)
    }
    update(){
        this.x += this.speed;
        this.y += this.speed;
        if(gameframe % this.flapSpeed === 0){  //simplest way for slowing down movement
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
    }
    draw(){
        // ctx.strokeRect(this.x, this.y, this.width, this.height);
        // ctx.drawImage(enemyImage, this.x, this.y, this.width, this.height);
        // ctx.drawImage(enemyImage, this.x, this.y);
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