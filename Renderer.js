class Renderer {
    constructor() {
    }

    setup(width, height) {
        this.width = width;
        this.height = height;

        this.oncanvas = document.getElementById("canvas");
        this.oncontext = this.oncanvas.getContext("2d");
        this.oncanvas.width = this.width;
        this.oncanvas.height = this.height;

        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");

	    this.canvas.width = this.width;
	    this.canvas.height = this.height;

        this.stopAnimation = false;
        this.animating = false;
        this.frames = 0;
        this.fps = 30;
        this.updateInterval = 1000/this.fps;
        this.backgroundColor = "#000000";
    }

    start(drawCallback) {
        this.drawCallback = drawCallback;
        this.stopAnimation = false;
        this.animate();
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.height);
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0,0,this.canvas.width,this.height);
    }

    update() {
    }

    render() {
        this.drawCallback && this.drawCallback();
    }

    present() {
        this.oncontext.drawImage(this.canvas, 0, 0, this.oncanvas.width, this.oncanvas.height);
    }

    endAnimation() {
        this.stopAnimation = true;
        window.cancelAnimationFrame ? window.cancelAnimationFrame(this.animationID) : null;
        this.animating = false;
    }
        
    animate() {
        this.animating = true;
        if (this.stopAnimation) {this.animating = false; return;}
        this.animationID = requestAnimationFrame( ()=> {this.animate()} );
        this.update();
        this.render();
        this.present();
    }

    strokeStyle(style) {
        this.context.strokeStyle = style;
    }

    fillStyle(style) {
        this.context.fillStyle = style;
    }

    line(x1,y1,x2,y2) {
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
    }

    rect(x,y,width,height) {
        this.context.beginPath();
        this.context.rect(x, y, width, height);
        this.context.stroke();
    }

    fillRect(x,y,width,height) {
        this.context.beginPath();
        this.context.rect(x, y, width, height);
        this.context.fill();
    }

    textSize(size) {
        this.context.font = size + "px Arial";
    }

    textAlign(align) {
        this.context.textAlign = align;
    }

    text(text, x, y) {
        this.context.fillText(text, x, y);
    }

    circle(x,y,size) {
        this.context.beginPath();
        this.context.arc(x+size/2, y+size/2, size/2, 0, 2*Math.PI);
        this.context.stroke();
        this.context.fill();
    }
    
}

export default new Renderer();