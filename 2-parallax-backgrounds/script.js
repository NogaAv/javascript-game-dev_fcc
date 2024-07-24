const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800; //we give the same value as in the styles.css file
const CANVAS_HEIGHT = canvas.height = 700;
let gameSpeed = 5;

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

//If this code was hosted somewhere online (and not on my local machine), I would need to make sure all images and HTML 
//elements on my page are fully loaded before we start the game. So we do the following: 
//we listen to the load event, and in a callback function, only after my page is fully loaded, only then I will run 
//all this code - images, canvas, and slider element need to be first properly loaded and available.
//  'window' is the browser window object.
window.addEventListener('load', function(){
    const slider = document.getElementById('slider');
    slider.value = gameSpeed;
    const showGameSpeed = document.getElementById('showGameSpeed');
    showGameSpeed.innerText = gameSpeed;
    slider.addEventListener('change', (e)=>{
        gameSpeed = e.target.value;
        showGameSpeed.innerText = gameSpeed;
    })
    
    class Layer{
        constructor(image, speedModifier){
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 700;
            this.image = image;
            this.speedModifier = speedModifier;
            this.speed = gameSpeed * this.speedModifier; //gameSpeed is the global variable
        }
    
        //1:17:51 - We modified this method to use only 1 x variable: The scrolling of the 2 images is different now
        update(){
            this.speed = gameSpeed * this.speedModifier; //In order to enable changing speed of scrolling the background imges
            if(this.x < -this.width){
                this.x = 0;
            }
            this.x -= this.speed;
            
        }
        draw(){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);       
        }
    }
    
    const layer1 = new Layer(backgroundLayer1, 0.2) //0.5 = I want this image to move at half the gameSpeed
    const layer2 = new Layer(backgroundLayer2, 0.4) //0.5 = I want this image to move at half the gameSpeed
    const layer3 = new Layer(backgroundLayer3, 0.6) //0.5 = I want this image to move at half the gameSpeed
    const layer4 = new Layer(backgroundLayer4, 0.8) //0.5 = I want this image to move at half the gameSpeed
    const layer5 = new Layer(backgroundLayer5, 1) 
    
    const gameObjects = [layer1, layer2, layer3, layer4, layer5];
    
    function animate(){
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        gameObjects.forEach((obj) => {
            obj.update();
            obj.draw();
        })
    
        requestAnimationFrame(animate);
    }
    
    animate();
})



