 export default class Matrix {

   constructor(r, c) {
      if (arguments.length == 2) {
         this.rows = r;
         this.cols = c;
         this.matrix = [];
         for(let i=0; i<this.rows; i++) {
            this.matrix[i] = new Array(this.cols).fill(0);
         }
      } else {
         this.matrix = r;
         this.rows = this.matrix.length;
         this.cols = this.matrix[0].length;
      }
   }


   output() {
      for(let i = 0; i < this.rows; i++) {
         let out = "";
         for(let j = 0; j < this.cols; j++) {
            out += matrix[i][j] + " "; 
         }
         console.log(out);
      }
   }

   dot(n) {
      var result = new Matrix(this.rows, n.cols);
      
      if(this.cols == n.rows) {
         for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < n.cols; j++) {
               let sum = 0;
               for(let k = 0; k < this.cols; k++) {
                  sum += this.matrix[i][k]*n.matrix[k][j];
               }  
               result.matrix[i][j] = sum;
            }
         }
      }
      return result;
   }

   randomGaussian()  {
      do {
        var x1 = Math.random()*2 - 1;
        var x2 = Math.random()*2 - 1;
        var w = x1 * x1 + x2 * x2;
      } while (w >= 1);
      w = Math.sqrt((-2 * Math.log(w))/w);
      return x1 * w;
   }

   randomize() {
      for(let i = 0; i < this.rows; i++) {
         for(let j = 0; j < this.cols; j++) {
            this.matrix[i][j] = Math.random() * (1 - -1) + -1; 
         }
      }
   }

   singleColumnMatrixFromArray(arr) {
      var n = new Matrix(arr.length, 1);
      for(let i = 0; i < arr.length; i++) {
         n.matrix[i][0] = arr[i]; 
      }
      return n;
   }

   toArray() {
      var arr = new Array(this.rows*this.cols);
      for(let i = 0; i < this.rows; i++) {
         for(let j = 0; j < this.cols; j++) {
            arr[j+i*this.cols] = this.matrix[i][j]; 
         }
      }
      return arr;
   }

   addBias() {
      var n = new Matrix(this.rows+1, 1);
      for(let i = 0; i < this.rows; i++) {
         n.matrix[i][0] = this.matrix[i][0]; 
      }
      n.matrix[this.rows][0] = 1;
      return n;
   }

   activate() {
      var n = new Matrix(this.rows, this.cols);
      for(let i = 0; i < this.rows; i++) {
         for(let j = 0; j < this.cols; j++) {
            n.matrix[i][j] = this.relu(this.matrix[i][j]); 
         }
      }
      return n;
   }

   relu(x) {
      return Math.max(0,x);
   }

   mutate(mutationRate) {
      for(let i = 0; i < this.rows; i++) {
         for(let j = 0; j < this.cols; j++) {
            var rand = Math.random()*1;
            if(rand<mutationRate) {
               this.matrix[i][j] += this.randomGaussian()/5;
               
               if(this.matrix[i][j] > 1) {
                  this.matrix[i][j] = 1;
               }
               if(this.matrix[i][j] <-1) {
                  this.matrix[i][j] = -1;
               }
            }
         }
      }
   }

   crossover(partner) {
      var child = new Matrix(this.rows, this.cols);
      
      var randC = Math.floor(Math.random()*this.cols);
      var randR = Math.floor(Math.random()*this.rows);
      
      for(let i = 0; i < this.rows; i++) {
         for(let j = 0;  j < this.cols; j++) {
            if((i  < randR) || (i == randR && j <= randC)) {
               child.matrix[i][j] = this.matrix[i][j]; 
            } else {
               child.matrix[i][j] = partner.matrix[i][j];
            }
         }
      }
      return child;
   }

   clone() {
      var clone = new Matrix(this.rows, this.cols);
      for(let i = 0; i < this.rows; i++) {
         for(let j = 0; j < this.cols; j++) {
            clone.matrix[i][j] = this.matrix[i][j]; 
         }
      }
      return clone;
   }
}