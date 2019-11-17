
export var settings = {
    width: 1200,
    height: 800,
    SIZE: 20,
    hidden_nodes: 16,
    hidden_layers: 2,
    fps: 100,  //15 is ideal for self play, increasing for AI does not directly increase speed, speed is dependant on processing power
    highscore: 0,
    mutationRate: 0.05,
    defaultmutation: 0.05,
    humanPlaying: false,  //false for AI, true to play yourself
    replayBest: true,  //shows only the best of each generation
    seeVision: false,  //see the snakes vision
    modelLoaded: false,
    evolution: []
}



import Population from "./Population.js";
import Button from "./Button.js";
import renderer from "./Renderer.js";

class SnakeAI {

    constructor() {
        this.setup();
    }

    setup() {
        renderer.setup(settings.width, settings.height);
        
        settings.evolution = [];
        // graphButton = new Button(349,15,100,30,"Graph");
        // loadButton = new Button(249,15,100,30,"Load");
        // saveButton = new Button(149,15,100,30,"Save");
        this.increaseMut = new Button(340,105,20,20,"+");
        this.decreaseMut = new Button(365,105,20,20,"-");
        if(settings.humanPlaying) {
            this.snake = new Snake();
        } else {
            this.pop = new Population(2000); //adjust size of population
        }

        document.getElementById("canvas").addEventListener("click", (event) =>{            
            let rect = document.getElementById("canvas").getClientRects()[0];
            let x = event.clientX - rect.x;
            let y = event.clientY - rect.y;
            this.mousePressed(x,y);
        });

        renderer.start(()=>{this.draw();});
    }

    draw() {
        renderer.clear();
        //noFill();
        renderer.strokeStyle("rgb(255,255,255)");
        renderer.line(400,0,400,settings.height);
        //rectMode(CORNER);
        renderer.rect(400 + settings.SIZE,settings.SIZE,settings.width-400-40,settings.height-40);
        //textFont(font);
        if(settings.humanPlaying) {
            this.snake.move();
            this.snake.show();
            renderer.fillStyle("rgb(150,150,150)");
            renderer.textSize(20);
            renderer.text("SCORE : "+this.snake.score,500,50);
            if(this.snake.dead) {
                this.snake = new Snake(); 
            }
        } else {
            if(!settings.modelLoaded) {
                if(this.pop.done()) {
                    settings.highscore = this.pop.bestSnake.score;
                    this.pop.calculateFitness();
                    this.pop.naturalSelection();
                } else {
                    this.pop.update();
                    this.pop.show(); 
                }
                renderer.fillStyle("rgb(150,150,150)");
                renderer.textSize(25);
                renderer.textAlign("left");
                renderer.text("GEN : "+this.pop.gen,120,60);
                //text("BEST FITNESS : "+pop.bestFitness,120,50);
                //text("MOVES LEFT : "+pop.bestSnake.lifeLeft,120,70);
                renderer.text("MUTATION RATE : "+settings.mutationRate*100+"%",120,90);
                renderer.text("SCORE : "+this.pop.bestSnake.score,120,settings.height-45);
                renderer.text("HIGHSCORE : "+settings.highscore,120,settings.height-15);
                this.increaseMut.show();
                this.decreaseMut.show();
            } else {
                model.look();
                model.think();
                model.move();
                model.show();
                model.brain.show(0,0,360,790,model.vision, model.decision);
                if(model.dead) {
                    var newmodel = new Snake();
                    newmodel.brain = model.brain.clone();
                    model = newmodel;
                    
                }
                renderer.textSize(25);
                renderer.fillStyle("rgb(150,150,150)");
                renderer.textAlign("left");
                renderer.text("SCORE : "+model.score,120,settings.height-45);
            }
            renderer.textAlign("left");
            renderer.textSize(18);
            renderer.fillStyle("rgb(255,0,0)");
            renderer.text("RED < 0",120,settings.height-75);
            renderer.fillStyle("rgb(0,0,255)");
            renderer.text("BLUE > 0",200,settings.height-75);
            // graphButton.show();
            // loadButton.show();
            // saveButton.show();
        }

    }

    fileSelectedIn(selection) {
    }

    fileSelectedOut(selection) {
    }

    mousePressed(mouseX, mouseY) {
        // if(graphButton.collide(mouseX,mouseY)) {
        //     graph = new EvolutionGraph();
        // }
        // if(loadButton.collide(mouseX,mouseY)) {
        //     //selectInput("Load Snake Model", "fileSelectedIn");
        // }
        // if(saveButton.collide(mouseX,mouseY)) {
        //     //selectOutput("Save Snake Model", "fileSelectedOut");
        // }
        if(this.increaseMut.collide(mouseX,mouseY)) {
            settings.mutationRate *= 2;
            settings.defaultmutation = settings.mutationRate;
        }
        if(this.decreaseMut.collide(mouseX,mouseY)) {
            settings.mutationRate /= 2;
            settings.defaultmutation = settings.mutationRate;
        }
    }


    keyPressed() {
        if(humanPlaying) {
            if(key == CODED) {
                switch(keyCode) {
                    case UP:
                        snake.moveUp();
                        break;
                    case DOWN:
                        snake.moveDown();
                        break;
                    case LEFT:
                        snake.moveLeft();
                        break;
                    case RIGHT:
                        snake.moveRight();
                        break;
                }
            }
        }
    }

}

new SnakeAI();