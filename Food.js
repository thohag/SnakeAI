import {settings} from "./SnakeAI.js";
import Vector from "./Vector.js";
import renderer from "./Renderer.js";

export default class Food {

    constructor() {
      let x = 400 + settings.SIZE + Math.floor(Math.random()*38)*settings.SIZE;
      let y = settings.SIZE + Math.floor(Math.random()*38)*settings.SIZE;
      this.pos = new Vector(x,y);
    }
    
    show() {
       renderer.strokeStyle("rgb(0,0,0)");
       renderer.fillStyle("rgb(255,0,0)");
       renderer.fillRect(this.pos.x,this.pos.y,settings.SIZE,settings.SIZE);
       renderer.rect(this.pos.x,this.pos.y,settings.SIZE,settings.SIZE);
    }
    
    clone() {
       let clone = new Food();
       clone.pos.x = this.pos.x;
       clone.pos.y = this.pos.y;
       
       return clone;
    }
}