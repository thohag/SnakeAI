import {settings} from "./SnakeAI.js";
import Food from "./Food.js";
import Vector from "./Vector.js";
import NeuralNet from "./NeuralNet.js";
import renderer from "./Renderer.js";

export default class Snake {
   
    
    constructor(argument) {

        this.score = 1;
        this.lifeLeft = 200;  //amount of moves the snake can make before it dies
        this.lifetime = 0;  //amount of time the snake has been alive
        this.xVel;
        this.yVel;
        this.foodItterate = 0;  //itterator to run through the foodlist (used for replay)
        
        this.fitness = 0;
        
        this.dead = false;
        this.replay = false;  //if this snake is a replay of best snake
        
        this.vision;  //snakes vision
        this.decision;  //snakes decision
        
        this.head;
        
        this.body;  //snakes body
        this.foodList;  //list of food positions (used to replay the best snake)
        
        this.food;
        this.brain;

        if (argument == null || typeof argument == "number") {
            var layers;
            if (argument == null) {
                layers = settings.hidden_layers
            } else {
                layers = argument;
            }
            this.head = new Vector(800,settings.height/2);
            this.food = new Food();
            this.body = new Array();
            if(!settings.humanPlaying) {
                this.vision = new Array(24).fill(0);
                this.decision = new Array(4);
                this.foodList = new Array();
                this.foodList.push(this.food.clone());
                this.brain = new NeuralNet(24,settings.hidden_nodes,4,layers);
                this.body.push(new Vector(800,(settings.height/2)+settings.SIZE));  
                this.body.push(new Vector(800,(settings.height/2)+(2*settings.SIZE)));
                this.score+=2;
            }
        } else if (argument instanceof Array) { //this constructor passes in a list of food positions so that a replay can replay the best snake
            var foods = argument;
            this.replay = true;
            this.vision = new Array(24).fill(0);
            this.decision = new Array(4);
            this.body = new Array();
            this.foodList = [];
            for(let f of foods) {  //clone all the food positions in the foodlist
                this.foodList.push(f.clone());
            }
            this.food = this.foodList[this.foodItterate];
            this.foodItterate++;
            this.head = new Vector(800,settings.height/2);
            this.body.push(new Vector(800,(settings.height/2)+settings.SIZE));
            this.body.push(new Vector(800,(settings.height/2)+(2*settings.SIZE)));
            this.score+=2;
        }
    }
    
    bodyCollide(x, y) {  //check if a position collides with the snakes body
       for(let i = 0; i < this.body.length; i++) {
          if(x == this.body[i].x && y == this.body[i].y)  {
             return true;
          }
       }
       return false;
    }
    
    foodCollide(x, y) {  //check if a position collides with the food
       if(x == this.food.pos.x && y == this.food.pos.y) {
           return true;
       }
       return false;
    }
    
    wallCollide(x, y) {  //check if a position collides with the wall
       if(x >= settings.width-(settings.SIZE) || x < 400 + settings.SIZE || y >= settings.height-(settings.SIZE) || y < settings.SIZE) {
         return true;
       }
       return false;
    }
    
    show() {  //show the snake
        this.food.show();
        renderer.fillStyle("rgb(255,255,255)");
        renderer.strokeStyle("rgb(0,0,0)");
        for(let i = 0; i < this.body.length; i++) {
            renderer.fillRect(this.body[i].x,this.body[i].y,settings.SIZE,settings.SIZE);
            renderer.rect(this.body[i].x,this.body[i].y,settings.SIZE,settings.SIZE);
        }
        if(this.dead) {
            renderer.fillStyle("rgb(150,150,150)");
        } else {
            renderer.fillStyle("rgb(255,255,255)");
        }
        renderer.fillRect(this.head.x,this.head.y,settings.SIZE,settings.SIZE);
        renderer.rect(this.head.x,this.head.y,settings.SIZE,settings.SIZE);
    }
    
    move() {  //move the snake
        if(!this.dead){
            if(!settings.humanPlaying && !settings.modelLoaded) {
                this.lifetime++;
                this.lifeLeft--;
            }
            if(this.foodCollide(this.head.x,this.head.y)) {
                this.eat();
            }
            this.shiftBody();
            if(this.wallCollide(this.head.x,this.head.y)) {
                this.dead = true;
            } else if(this.bodyCollide(this.head.x,this.head.y)) {
                this.dead = true;
            } else if(this.lifeLeft <= 0 && !settings.humanPlaying) {
                this.dead = true;
            }
        }
    }
    
    eat() {  //eat food
      var len = this.body.length-1;
      this.score++;
      if(!settings.humanPlaying && !settings.modelLoaded) {
        if(this.lifeLeft < 500) {
          if(this.lifeLeft > 400) {
            this.lifeLeft = 500; 
          } else {
            this.lifeLeft+=100;
          }
        }
      }
      if(len >= 0) {
        this.body.push(new Vector(this.body[len].x,this.body[len].y));
      } else {
        this.body.push(new Vector(this.head.x,this.head.y)); 
      }
      if(!this.replay) {
        this.food = new Food();
        while(this.bodyCollide(this.food.pos.x,this.food.pos.y)) {
           this.food = new Food();
        }
        if(!settings.humanPlaying) {
          this.foodList.push(this.food);
        }
      } else {  //if the snake is a replay, then we dont want to create new random foods, we want to see the positions the best snake had to collect
        this.food = this.foodList[this.foodItterate];
        this.foodItterate++;
      }
    }
    
    shiftBody() {  //shift the body to follow the head
        var tempx = this.head.x;
        var tempy = this.head.y;
        this.head.x += this.xVel;
        this.head.y += this.yVel;
        var temp2x;
        var temp2y;
        for(let i = 0; i < this.body.length; i++) {
            temp2x = this.body[i].x;
            temp2y = this.body[i].y;
            this.body[i].x = tempx;
            this.body[i].y = tempy;
            tempx = temp2x;
            tempy = temp2y;
        } 
    }
    
    cloneForReplay() {  //clone a version of the snake that will be used for a replay
       var clone = new Snake(this.foodList);
       clone.brain = this.brain.clone();
       return clone;
    }
    
    clone() {  //clone the snake
       var clone = new Snake(settings.hidden_layers);
       clone.brain = this.brain.clone();
       return clone;
    }
    
    crossover(parent) {  //crossover the snake with another snake
       var child = new Snake(settings.hidden_layers);
       child.brain = this.brain.crossover(parent.brain);
       return child;
    }
    
    mutate() {  //mutate the snakes brain
       this.brain.mutate(settings.mutationRate); 
    }
    
    calculateFitness() {  //calculate the fitness of the snake
        if(this.score < 10) {
            this.fitness = Math.floor(this.lifetime * this.lifetime) * Math.pow(2,this.score); 
        } else {
            this.fitness = Math.floor(this.lifetime * this.lifetime);
            this.fitness *= Math.pow(2,10);
            this.fitness *= (this.score-9);
        }
    }
    
    look() {  //look in all 8 directions and check for food, body and wall
      this.vision = new Array(24).fill(0);
      var temp = this.lookInDirection(new Vector(-settings.SIZE,0));
      this.vision[0] = temp[0];
      this.vision[1] = temp[1];
      this.vision[2] = temp[2];
      temp = this.lookInDirection(new Vector(-settings.SIZE,-settings.SIZE));
      this.vision[3] = temp[0];
      this.vision[4] = temp[1];
      this.vision[5] = temp[2];
      temp = this.lookInDirection(new Vector(0,-settings.SIZE));
      this.vision[6] = temp[0];
      this.vision[7] = temp[1];
      this.vision[8] = temp[2];
      temp = this.lookInDirection(new Vector(settings.SIZE,-settings.SIZE));
      this.vision[9] = temp[0];
      this.vision[10] = temp[1];
      this.vision[11] = temp[2];
      temp = this.lookInDirection(new Vector(settings.SIZE,0));
      this.vision[12] = temp[0];
      this.vision[13] = temp[1];
      this.vision[14] = temp[2];
      temp = this.lookInDirection(new Vector(settings.SIZE,settings.SIZE));
      this.vision[15] = temp[0];
      this.vision[16] = temp[1];
      this.vision[17] = temp[2];
      temp = this.lookInDirection(new Vector(0,settings.SIZE));
      this.vision[18] = temp[0];
      this.vision[19] = temp[1];
      this.vision[20] = temp[2];
      temp = this.lookInDirection(new Vector(-settings.SIZE,settings.SIZE));
      this.vision[21] = temp[0];
      this.vision[22] = temp[1];
      this.vision[23] = temp[2];
    }
  
    lookInDirection(direction) {  //look in a direction and check for food, body and wall
        var look = new Array(3).fill(0);
        var pos = new Vector(this.head.x, this.head.y);
        var distance = 0;
        var foodFound = false;
        var bodyFound = false;
        pos.add(direction);
        distance +=1;
        while (!this.wallCollide(pos.x,pos.y)) {
        if(!foodFound && this.foodCollide(pos.x,pos.y)) {
            foodFound = true;
            look[0] = 1;
        }
        if(!bodyFound && this.bodyCollide(pos.x,pos.y)) {
            bodyFound = true;
            look[1] = 1;
        }
        if(this.replay && settings.seeVision) {
            stroke(0,255,0);
            point(pos.x,pos.y);
            if(foodFound) {
                //noStroke();
                fillStyle("rgb(255,255,51)");
                //ellipseMode(CENTER);
                ellipse(pos.x,pos.y,5,5); 
            }
            if(bodyFound) {
                noStroke();
                fill(102,0,102);
                ellipseMode(CENTER);
                ellipse(pos.x,pos.y,5,5); 
            }
        }
        pos.add(direction);
        distance +=1;
        }
        if(this.replay && settings.seeVision) {
            noStroke();
            fill(0,255,0);
            ellipseMode(CENTER);
            ellipse(pos.x,pos.y,5,5); 
        }
        look[2] = 1/distance;
        return look;
    }
    
    think() {  //think about what direction to move
        this.decision = this.brain.output(this.vision);
        
        var maxIndex = 0;
        var max = 0;
        for(let i = 0; i < this.decision.length; i++) {
            if(this.decision[i] > max) {
            max = this.decision[i];
            maxIndex = i;
            }
        }
        
        switch(maxIndex) {
            case 0:
                this.moveUp();
                break;
            case 1:
                this.moveDown();
                break;
            case 2:
                this.moveLeft();
                break;
            case 3: 
                this.moveRight();
                break;
        }
    }
    
    moveUp() { 
        if(this.yVel!=settings.SIZE) {
            this.xVel = 0; this.yVel = -settings.SIZE;
        }
    }
    moveDown() { 
        if(this.yVel!=-settings.SIZE) {
            this.xVel = 0; this.yVel = settings.SIZE; 
        }
    }
    moveLeft() { 
        if(this.xVel!=settings.SIZE) {
            this.xVel = -settings.SIZE; this.yVel = 0; 
        }
    }
    moveRight() { 
        if(this.xVel!=-settings.SIZE) {
            this.xVel = settings.SIZE; this.yVel = 0;
        }
    }
}