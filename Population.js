import Snake from "./Snake.js";
import {settings} from "./SnakeAI.js";

export default class Population {
  
    
    constructor(size) {
        this.bestSnakeScore = 0;
        this.gen = 0;
        this.samebest = 0;
        this.bestFitness = 0;
        this.fitnessSum = 0;
        this.snakes = new Array(size); 
        for(let i = 0; i < this.snakes.length; i++) {
            this.snakes[i] = new Snake(); 
        }
        this.bestSnake = this.snakes[0].clone();
        this.bestSnake.replay = true;
    }
    
    done() {  //check if all the snakes in the population are dead
       for(let i = 0; i < this.snakes.length; i++) {
          if(!this.snakes[i].dead)
            return false;
       }
       if(!this.bestSnake.dead) {
          return false; 
       }
       return true;
    }
    
    update() {  //update all the snakes in the generation
        if(!this.bestSnake.dead) {  //if the best snake is not dead update it, this snake is a replay of the best from the past generation
            this.bestSnake.look();
            this.bestSnake.think();
            this.bestSnake.move();
        }
        for(let i = 0; i < this.snakes.length; i++) {
            if(!this.snakes[i].dead) {
                this.snakes[i].look();
                this.snakes[i].think();
                this.snakes[i].move(); 
            }
        }
    }
    
    show() {  //show either the best snake or all the snakes
       if(settings.replayBest) {
         this.bestSnake.show();
         this.bestSnake.brain.show(0,0,360,790,this.bestSnake.vision, this.bestSnake.decision);  //show the brain of the best snake
       } else {
          for(let i = 0; i < this.snakes.length; i++) {
            this.snakes[i].show(); 
          }
       }
    }
    
    setBestSnake() {  //set the best snake of the generation
        var max = 0;
        var maxIndex = 0;
        for(let i = 0; i < this.snakes.length; i++) {
           if(this.snakes[i].fitness > max) {
              max = this.snakes[i].fitness;
              maxIndex = i;
           }
        }
        if(max > this.bestFitness) {
          this.bestFitness = max;
          this.bestSnake = this.snakes[maxIndex].cloneForReplay();
          this.bestSnakeScore = this.snakes[maxIndex].score;
          //samebest = 0;
          //mutationRate = defaultMutation;
        } else {
            this.bestSnake = this.bestSnake.cloneForReplay(); 
          /*
          samebest++;
          if(samebest > 2) {  //if the best snake has remained the same for more than 3 generations, raise the mutation rate
             mutationRate *= 2;
             samebest = 0;
          }*/
        }
    }
    
    selectParent() {  //selects a random number in range of the fitnesssum and if a snake falls in that range then select it
       var rand = Math.random()*this.fitnessSum;
       var summation = 0;
       for(let i = 0; i < this.snakes.length; i++) {
          summation += this.snakes[i].fitness;
          if(summation > rand) {
            return this.snakes[i];
          }
       }
       return this.snakes[0];
    }
    
    naturalSelection() {
       var newSnakes = new Array(this.snakes.length);
       
       this.setBestSnake();
       this.calculateFitnessSum();
       
       newSnakes[0] = this.bestSnake.clone();  //add the best snake of the prior generation into the new generation
       for(let i = 1; i < this.snakes.length; i++) {
          var child = this.selectParent().crossover(this.selectParent());
          child.mutate();
          newSnakes[i] = child;
       }
       this.snakes = newSnakes.slice(0);
       settings.evolution.push(this.bestSnakeScore);
       this.gen+=1;
    }
    
    mutate() {
        for(let i = 1; i < this.snakes.length; i++) {  //start from 1 as to not override the best snake placed in index 0
            this.snakes[i].mutate(); 
        }
    }
    
    calculateFitness() {  //calculate the fitnesses for each snake
        for(let i = 0; i < this.snakes.length; i++) {
            this.snakes[i].calculateFitness(); 
        }
    }
    
    calculateFitnessSum() {  //calculate the sum of all the snakes fitnesses
        this.fitnessSum = 0;
        for(let i = 0; i < this.snakes.length; i++) {
            this.fitnessSum += this.snakes[i].fitness; 
        }
    }
 }