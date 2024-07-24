/** @type {HTMLCanvasElement} *///<- This annotation added for the IDE to suggest canvas methods
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
//canvas width and height tneed to be similar to those in styles.css
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;
const numberOfEnemies = 100;
const enemiesArray = [];

/*
 const enemy1 = {
     x: 10,
     y: 50,
     width: 100,
     height: 100,
 }
*/

//I use class instead of an object because I want many enemies objects and so I need a blueprint(class)
class Enemy{
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.width = 100;
        this.height = 100;
        this.speed = Math.random() * 4 - 2; //To get values between: -2 and 2.
    }
    update(){
        this.x += this.speed;
        this.y += this.speed;
    }
    draw(){
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

// const enemy1 = new Enemy();
for(let i = 0 ; i < numberOfEnemies ; ++i){
    enemiesArray.push(new Enemy());
}

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    enemiesArray.forEach(enemy => {
        enemy.update();
        enemy.draw();
    })
 
    requestAnimationFrame(animate); //'requestAnimationFrame()' tells the browser you wish to perform an animation frame request and call a user-supplied callback function before the next repaint. The frequency of calls to the callback function will generally match the display refresh rate.
}

animate();