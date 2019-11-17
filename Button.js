import renderer from "./Renderer.js";

export default class Button { 

    constructor(x, y, w, h, t) {
      this.X = x;
      this.Y = y;
      this.W = w;
      this.H = h;
      this.text = t;
    }
    
    collide(x, y) {
      if(x >= this.X-this.W/2 && x <= this.X+this.W/2 && y >= this.Y-this.H/2 && y <= this.Y+this.H/2) {
         return true; 
      }
      return false;
    }
    
    show() {
      renderer.fillStyle("rgb(255,255,255)");
      renderer.strokeStyle("rgb(0,0,0)");
      //renderer.rectMode(CENTER);
      renderer.fillRect(this.X-this.W/2, this.Y-this.H/2, this.W, this.H);
      renderer.rect(this.X-this.W/2, this.Y-this.H/2, this.W, this.H);
      renderer.textSize(25);
      renderer.textAlign("center");
      renderer.fillStyle("rgb(0,0,0)");
      //renderer.noStroke();
      renderer.text(this.text,this.X,this.Y+(this.H/2)-2);
    }
  }