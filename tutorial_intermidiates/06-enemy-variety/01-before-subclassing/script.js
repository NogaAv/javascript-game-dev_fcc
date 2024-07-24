
/*
We want to add event-listener on the DOM that will run our js game script only
after all the HTML, stylesheet and images are loaded: this is critical when running the game online from server (locally we will not see any problems downloading..)
-----------------------------------------------------
Listening to DOM content loaded javascript event:
'DOMContentLoaded' - fires when the initial document has been loaded and parsed, BUT it 
doesn't wait for stylesheet and images to be loaded

 document.addEventListener('DOMContentLoaded', function(){

 });*/

//so- we will add the proper eventListener: 'load', that waits for all to be uploaded:
    //NOTE: 
    //document.addEventListener('load', function(){  <- document.addEventListener() is unreliable, so it pops error.
    //using window.addEventListener() is o.k

window.addEventListener('load', function(){
/**@type {HTMLCanvasElement} */

    //the usual setup for canvas:
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 800;

    class Game{
        constructor(ctx, width, height){ //I am passing: ctx, canvas.width and canvas.height as arguments to avoid using global variables in my class
            this.ctx = ctx;
            this.width = width;
            this.height = height;
            this.enemies = [];
            this.enemyInterval = 1000; //interval for creating new enemy
            this.enemyTimer = 0;
        }
        //update and draw are public class methods
        update(deltatime){
            if(this.enemyTimer > this.enemyInterval){
                // this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion); 
                this.#addNewEnemy();
                this.enemyTimer = 0;
            }else{
                this.enemyTimer += deltatime;
            }
            this.enemies.forEach(enemy => enemy.update());
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion); //for performance improvement: I can move it to the 'if' statement, this way filter will not happen every update, and instead every time enemy created
        }
        draw(){
            this.enemies.forEach(enemy => enemy.draw(this.ctx));

        }
        //addNewEnemy is private class method ('#')
        #addNewEnemy(){
            this.enemies.push(new Enemy(this)); //we pass the 'this' of game to the enemy class, because I want my enemies to be aware of the width and hight of my game so that they will move inside the game-bounderies
        }
    }

    class Enemy{
        constructor(game){
            this.game = game; //now, I have access to my game object from the enemy class
            this.x = this.game.width;
            this.y  =Math.random() * canvas.height;
            this.width = 100;
            this.height = 100;
            this.markedForDeletion = false;
        }
        update(){
            this.x--;
            //remove enemies
            if(this.x < 0 - this.width) this.markedForDeletion = true;

        }
        draw(ctx){
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    const game = new Game(ctx, canvas.width, canvas.height);
    //we will use delta-time: because not every computer is capable of serve frame at the same speed.
    //and also: some screens have different refresh rates, and 'requestAnimationFrame' adjusts when it serves the
    //next frame based on screen refresh rate.
    let lastTimeStamp = 1;

    function animate(timeStamp){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let deltatime = timeStamp - lastTimeStamp;
        lastTimeStamp = timeStamp;
        game.update(deltatime);
        game.draw();

        requestAnimationFrame(animate); //'requestAnimationFrame' adjusts when it serves the next frame based on screen refresh rate.
    }

    animate(0);
});


/**----------------------------------------------------
 NOTE:
 x=0, y=0  : this is the left corner of canvas.
 increasing x values result in moving to right on canvas, and:
 !! increasing y values result in moving down on canvas (and not up!)

 for example- x:200, y: 200 dot is about here:
__________________________
|                         |
|                         |    
|    (x)                  | 
|                         |
|                         |
|                         | 
|                         |
|                         |
|                         |
|_________________________|
 */