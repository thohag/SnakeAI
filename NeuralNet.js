import Matrix from "./Matrix.js";
import renderer from "./Renderer.js";

export default class NeuralNet {
    
    constructor(input, hidden, output, hiddenLayers) {
      this.iNodes = input;
      this.hNodes = hidden;
      this.oNodes = output;
      this.hLayers = hiddenLayers;
      
      this.weights = new Array(this.hLayers+1);
      this.weights[0] = new Matrix(this.hNodes, this.iNodes+1);
      for(let i=1; i<this.hLayers; i++) {
        this.weights[i] = new Matrix(this.hNodes,this.hNodes+1); 
      }
      this.weights[this.weights.length-1] = new Matrix(this.oNodes,this.hNodes+1);
      
      for(let w of this.weights) {
         w.randomize(); 
      }
    }
    
    mutate(mr) {
       for(let w of this.weights) {
          w.mutate(mr); 
       }
    }
    
    output(inputsArr) {
       var inputs = this.weights[0].singleColumnMatrixFromArray(inputsArr);
       
       var curr_bias = inputs.addBias();
       
       for(let i=0; i<this.hLayers; i++) {
          var hidden_ip = this.weights[i].dot(curr_bias); 
          var hidden_op = hidden_ip.activate();
          curr_bias = hidden_op.addBias();
       }
       
       var output_ip = this.weights[this.weights.length-1].dot(curr_bias);
       var output = output_ip.activate();
       
       return output.toArray();
    }
    
    crossover(partner) {
       var child = new NeuralNet(this.iNodes,this.hNodes,this.oNodes,this.hLayers);
       for(let i=0; i<this.weights.length; i++) {
          child.weights[i] = this.weights[i].crossover(partner.weights[i]);
       }
       return child;
    }
    
    clone() {
       var clone = new NeuralNet(this.iNodes,this.hNodes,this.oNodes,this.hLayers);
       for(let i=0; i<this.weights.length; i++) {
          clone.weights[i] = this.weights[i].clone(); 
       }
       
       return clone;
    }
    
    load(weight) {
        for(let i=0; i<this.weights.length; i++) {
            this.weights[i] = weight[i]; 
        }
    }
    
    pull() {
       var model = this.weights.clone();
       return model;
    }
    
    show(x, y, w, h, vision, decision) {
       var space = 5;
       var nSize = (h - (space*(this.iNodes-2))) / this.iNodes;
       var nSpace = (w - (this.weights.length*nSize)) / this.weights.length;
       var hBuff = (h - (space*(this.hNodes-1)) - (nSize*this.hNodes))/2;
       var oBuff = (h - (space*(this.oNodes-1)) - (nSize*this.oNodes))/2;
       
       var maxIndex = 0;
       for(let i = 1; i < decision.length; i++) {
          if(decision[i] > decision[maxIndex]) {
             maxIndex = i; 
          }
       }
       
       var lc = 0;  //Layer Count
       
       //DRAW NODES
        for(let i = 0; i < this.iNodes; i++) {  //DRAW INPUTS
            if(vision[i] != 0) {
                renderer.fillStyle("rgb(0,255,0)");
            } else {
                renderer.fillStyle("rgb(255,255,255)");
            }
            renderer.strokeStyle("rgb(0,0,0)");
            //ellipseMode(CORNER);
            renderer.circle(x,y+(i*(nSize+space)),nSize,nSize);
            renderer.textSize(nSize/2);
            renderer.textAlign("center");
            renderer.fillStyle("rgb(0,0,0)");
            renderer.text(i,x+(nSize/2),space+y+(nSize/2)+(i*(nSize+space)));
        }
       
       lc++;
       
       for(let a = 0; a < this.hLayers; a++) {
         for(let i = 0; i < this.hNodes; i++) {  //DRAW HIDDEN
             renderer.fillStyle("rgb(255,255,255)");
             renderer.strokeStyle("rgb(0,0,0)");
             //ellipseMode(CORNER);
             renderer.circle(x+(lc*nSize)+(lc*nSpace),y+hBuff+(i*(nSize+space)),nSize,nSize);
         }
         lc++;
       }
       
       for(let i = 0; i < this.oNodes; i++) {  //DRAW OUTPUTS
           if(i == maxIndex) {
             renderer.fillStyle("rgb(0,255,0)");
           } else {
             renderer.fillStyle("rgb(255,255,255)"); 
           }
           renderer.strokeStyle("rgb(0,0,0)");
           //ellipseMode(CORNER);
           renderer.circle(x+(lc*nSpace)+(lc*nSize),y+oBuff+(i*(nSize+space)),nSize,nSize);
       }
       
       lc = 1;
       
       //DRAW WEIGHTS
       for(let i = 0; i < this.weights[0].rows; i++) {  //INPUT TO HIDDEN
          for(let j = 0; j < this.weights[0].cols-1; j++) {
              if(this.weights[0].matrix[i][j] < 0) {
                renderer.strokeStyle("rgb(255,0,0)"); 
              } else {
                renderer.strokeStyle("rgb(0,0,255)"); 
              }
              renderer.line(x+nSize,y+(nSize/2)+(j*(space+nSize)),x+nSize+nSpace,y+hBuff+(nSize/2)+(i*(space+nSize)));
          }
       }
       
       lc++;
       
       for(let a = 1; a < this.hLayers; a++) {
         for(let i = 0; i < this.weights[a].rows; i++) {  //HIDDEN TO HIDDEN
            for(let j = 0; j < this.weights[a].cols-1; j++) {
                if(this.weights[a].matrix[i][j] < 0) {
                    renderer.strokeStyle("rgb(255,0,0)"); 
                } else {
                    renderer.strokeStyle("rgb(0,0,255)"); 
                }
                renderer.line(x+(lc*nSize)+((lc-1)*nSpace),y+hBuff+(nSize/2)+(j*(space+nSize)),x+(lc*nSize)+(lc*nSpace),y+hBuff+(nSize/2)+(i*(space+nSize)));
            }
         }
         lc++;
       }
       
       for(let i = 0; i < this.weights[this.weights.length-1].rows; i++) {  //HIDDEN TO OUTPUT
          for(let j = 0; j < this.weights[this.weights.length-1].cols-1; j++) {
              if(this.weights[this.weights.length-1].matrix[i][j] < 0) {
                renderer.strokeStyle("rgb(255,0,0)"); 
              } else {
                renderer.strokeStyle("rgb(0,0,255)"); 
              }
              renderer.line(x+(lc*nSize)+((lc-1)*nSpace),y+hBuff+(nSize/2)+(j*(space+nSize)),x+(lc*nSize)+(lc*nSpace),y+oBuff+(nSize/2)+(i*(space+nSize)));
          }
       }
       
       renderer.fillStyle("rgb(0,0,0)");
       renderer.textSize(15);
       renderer.textAlign("center");
       renderer.text("U",x+(lc*nSize)+(lc*nSpace)+nSize/2,space+y+oBuff+(nSize/2));
       renderer.text("D",x+(lc*nSize)+(lc*nSpace)+nSize/2,space+y+oBuff+space+nSize+(nSize/2));
       renderer.text("L",x+(lc*nSize)+(lc*nSpace)+nSize/2,space+y+oBuff+(2*space)+(2*nSize)+(nSize/2));
       renderer.text("R",x+(lc*nSize)+(lc*nSpace)+nSize/2,space+y+oBuff+(3*space)+(3*nSize)+(nSize/2));
    }
  }