
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
            this.enemyInterval = 500; //interval for creating new enemy
            this.enemyTimer = 0;
            this.enemyTypes = ['worm', 'ghost', 'spider'];
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
            this.enemies.forEach(enemy => enemy.update(deltatime));
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion); //for performance improvement: I can move it to the 'if' statement, this way filter will not happen every update, and instead every time enemy created
        }
        draw(){
            this.enemies.forEach(enemy => enemy.draw(this.ctx));

        }
        //addNewEnemy is private class method ('#')
        #addNewEnemy(){
            const randomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
            if(randomEnemy === 'worm'){
                this.enemies.push(new Worm(this)); //we pass the 'this' of game to the enemy class, because I want my enemies to be aware of the width and hight of my game so that they will move inside the game-bounderies
            }else if(randomEnemy === 'ghost'){
                this.enemies.push(new Ghost(this));
            }else if(randomEnemy === 'spider'){
                this.enemies.push(new Spider(this));
                console.log(this.enemies.length);
            }
            //I want to give depth feeling to my game, so- moving enemies closer to the bottom will be gradually closer then enemies closer to top of canvas. so I will use Array.sort() to push to the array the worms that positioned higher in the screen, this way- draw image will draw them first and so as the worm is closer to bottom it will be drawn later and will not be overriden by higher and more 'far away' worm
            this.enemies.sort(function(a, b){
                return a.y - b.y; //ascending order (small y value to high value)
            })
        }
    }

    class Enemy{
        constructor(game){
            this.game = game; //now, I have access to my game object from the enemy class
            // this.x = this.game.width;
            // this.y  =Math.random() * canvas.height;
            // this.width = 100;
            // this.height = 100;
            this.markedForDeletion = false;
            this.frameX = 0;
            this.maxFrames = 5;
            //we use delta-time for switching frames, for competability of speed between computers
            this.frameInterval = 100;
            this.frameTimer = 0;
        }
        update(deltatime){
            this.x -= this.vx * deltatime; //multiplying with deltatime assures same speed on slow and fast computers and different web-page refresh speed
            //remove enemies
            if(this.x < 0 - this.width) this.markedForDeletion = true;
            if(this.frameTimer > this.frameInterval){
                if(this.frameX < this.maxFrames) this.frameX++;
                else this.frameX = 0;
                this.frameTimer = 0;
            }else{
                this.frameTimer += deltatime;//deltatime is milliseconds between frames. so, fast computers will serve frames very fast but will have smaller deltatime, on the other hand- slow computers can't serve frame as often but their deltatime is larger = so as a result it's even-up at both slow and fast machines, this ensures all the movements and animation in our game has the same timing regardless of speed of the machine we run the code on.
            }
            

        }
        draw(ctx){
            //ctx.fillRect(this.x, this.y, this.width, this.height);
            // ctx.drawImage(this.image, this.x, this.y, this.width, this.height);            
            ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
                this.x, this.y, this.width, this.height);
            
        }
    }

    //4:14 - sub-classing enemies:
    class Worm extends Enemy{
        constructor(game){
            super(game); //parent initialization. super must come as first line
            //extra properties for child class
            this.spriteWidth = 229;
            this.spriteHeight = 171;
            this.width = this.spriteWidth/2; //I corelate the image width and height to the spritesheet width and height in order to get correct proportions and not distort the image
            this.height = this.spriteHeight/2;
            this.x = this.game.width;
            this.y  = canvas.height - this.height; //I want worms to slide on the floor
            //vx = velocity on x
            this.vx = Math.random() * 0.1 + 0.1; //every worm differs in speed moving. I use deltatime in 'Enemy.update(deltatime)' for same speed on different computers. I renamed this speed property to vx(velocity on x coordinate)- because other enemies will have also movements on y coordinates
            this.image = worm;//NOTE!- Any element in the DOM with an id attribute is automatically added to the javascript execution environment as a global variable.
//this mesnd that I can access any html element from javascript using its id. no need for document.getElementById or document.querySelector
//NOTE: when I call update and draw methods on my worm object, it will first look for their ovridding implementation in the child class and if not exist-> the parent method will get triggered
        }
    }

    class Ghost extends Enemy{
        constructor(game){
            super(game);
            this.spriteWidth = 261;
            this.spriteHeight = 209;
            this.width = this.spriteWidth/2; 
            this.height = this.spriteHeight/2;
            this.x = this.game.width;
            this.y  =Math.random() * canvas.height * 0.6; //I want ghost to only occupy 60% of the top screen
            this.vx = Math.random() * 0.2 + 0.1; 
            this.image = ghost; //on html: <img id=ghost src="..."/>
            this.angle = 0;
            this.curve = Math.random() * 3; //I want every ghost to have it's own wave size of movement
        }

        //we want the ghosts to move different then basic enemy (streight right to left)
        //
        update(deltatime){
            super.update(deltatime);
            //remember: sin(angle) -> between -1 to 1 
            this.y += Math.sin(this.angle) * this.curve; //this.curve - randomizes the wave of every ghost
            this.angle += 0.04;

        }
        //We want to draw the ghost as transparent.So I can do 2 things:
        //1- Override the parent draw method with whole new code, and then this method will be invoked and not the parent
        //2- call the parent draw method and also add to it this Ghost class code. By using super.draw() - as we do here
        draw(ctx){
            ctx.save();
            ctx.globalAlpha = 0.7;//This affects all enemies(also worms), that's because global xtc is common to the entire canvas.
            super.draw(ctx);
            ctx.restore();
            //ctx.globalAlpha = 1;//So- one way to deal with that - We can reset the opacity back to 1 after my ghost were all drawn. Alternatively- use save() restore()
            
        }
    }

    class Spider extends Enemy{
        constructor(game){
            super(game); 
            this.spriteWidth = 310;
            this.spriteHeight = 175;
            this.width = this.spriteWidth/2; 
            this.height = this.spriteHeight/2;
            this.image = spider;
            this.x = Math.random() * (this.game.width - this.width);
            this.y  = 0 - this.height;//I want spider to appear from top of screen
            this.vx = 0; //I only want them to move up and down
            this.vy = Math.random() * 0.1 + 0.1; //vy = velocity y . I want every spider to move at different speed
            this.maxLength = Math.random() * this.game.height - this.height;
        }
        update(deltatime){
            super.update(deltatime);
            this.y += this.vy * deltatime; //deltatime - to make sure same speen on different machines
            if(this.y > this.maxLength) this.vy *= -1; //reversing vy to get spiders to move up and down
            else if(this.y < 0 - this.height && this.vy < 0) this.markedForDeletion = true;  //spiders have no x movement, only y, so their markedForDeletion is true when finishing one round of moving down and up
            
            // alternatively (instructor version:)
            //else if(this.y < 0 - this.height * 2) this.markedForDeletion = true;  //spiders start moving from y = -this.height. so passing that point (to mpre negative) insures the spider is on its way back and not only starting down

        }
        //I want the spiders to hang from a net. So I will add it to draw:
        draw(ctx){
            //I will draw the net before the spider (upwords from spider)
            ctx.beginPath(); //to start drawing on canvas
            ctx.moveTo(this.x + this.width/2, 0); //starting cordinates of the line
            ctx.lineTo(this.x + this.width/2, this.y +10);//ending cordinates of my line (where my spider at the moment). we add 10 for the line to reach the spider all the way
            ctx.stroke();// drawing the line
            super.draw(ctx);

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