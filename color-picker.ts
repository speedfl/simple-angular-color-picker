import {Component, Output, Input, ViewChild,EventEmitter} from '@angular/core';

@Component({
  selector: 'color-picker',
  template: ` <canvas #palette style="background:white;" class='center'></canvas>
              <canvas #chooser style="background:white; margin-top: 20px; margin-bottom: 20px; " class='center'></canvas>`
})
export class ColorPicker {

  @Input() hexColor : string;

  @Output() colorChanged = new EventEmitter<String>();

  // this is the main palette
  @ViewChild("palette") palette;

  // this is the color chooser
  @ViewChild("chooser") chooser;

  ctxPalette : CanvasRenderingContext2D;

  requestAnimationFrameID : number;

  previousColor : string;

  color : string;

  colorFromChooser : string;

  paletteX : number;

  paletteY : number;

  chooserX : number;

  public ngOnInit() {
    if(this.hexColor){
      this.colorFromChooser = this.hexColor;
    } else{
      this.colorFromChooser = "#0000FF";
    }
    this.previousColor = "#FFFFFF";
    this.init();
  }

  init(){
    this.initChooser();
    this.initPalette();
    this.tick();
  }

  drawSelector(ctx : CanvasRenderingContext2D, x : number, y : number ){
    this.drawPalette(this.colorFromChooser);
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
  }

  drawChooserSelector(ctx : CanvasRenderingContext2D, x : number ){
    this.drawPalette(this.colorFromChooser);
    ctx.beginPath();
    ctx.arc(x, ctx.canvas.height / 2, ctx.canvas.height / 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.colorFromChooser;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
  }

  tick() {
    this.requestAnimationFrameID = requestAnimationFrame(()=> {
      this.tick()
    });
    if(this.previousColor != this.color){
      this.previousColor = this.color;
      this.colorChanged.emit(this.color);
    }
  }

  initPalette(){
    let canvasPalette = this.palette.nativeElement;
    this.ctxPalette = canvasPalette.getContext("2d");

    var currentWidth = window.innerWidth;

    var pixelRatio = this.getPixelRatio(this.ctxPalette);

    console.log(pixelRatio);

    var width = currentWidth * 90/100;
    var height = width * 0.5;

    this.ctxPalette.canvas.width  = width * pixelRatio;
    this.ctxPalette.canvas.height = height * pixelRatio;

    this.ctxPalette.canvas.style.width = width + "px";
    this.ctxPalette.canvas.style.height = height + "px";

    this.drawPalette(this.colorFromChooser);

    var eventChangeColor = (event) => {
      this.updateColor(event, canvasPalette, this.ctxPalette);
    };

    canvasPalette.addEventListener('mousedown', (event) => {
      this.drawPalette(this.colorFromChooser);
      canvasPalette.addEventListener('mousemove', eventChangeColor);
      this.updateColor(event, canvasPalette, this.ctxPalette);
    });

    canvasPalette.addEventListener('mouseup', (event) => {
      canvasPalette.removeEventListener('mousemove', eventChangeColor);
      this.updateColor(event, canvasPalette, this.ctxPalette);
      this.drawSelector(this.ctxPalette, this.paletteX, this.paletteY);
    });
  }

  drawPalette(endColor : string){

    this.ctxPalette.clearRect(0, 0, this.ctxPalette.canvas.width, this.ctxPalette.canvas.height);

    var gradient = this.ctxPalette.createLinearGradient(0, 0, this.ctxPalette.canvas.width, 0);

    gradient.addColorStop(0,    "#FFFFFF");
    gradient.addColorStop(1,    endColor);

    this.ctxPalette.fillStyle = gradient;
    this.ctxPalette.fillRect(0, 0, this.ctxPalette.canvas.width, this.ctxPalette.canvas.height);

    gradient = this.ctxPalette.createLinearGradient(0, 0, 0, this.ctxPalette.canvas.height);
    gradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
    gradient.addColorStop(1,   "rgba(0,     0,   0, 1)");

    // Apply gradient to canvas
    this.ctxPalette.fillStyle = gradient;
    this.ctxPalette.fillRect(0, 0, this.ctxPalette.canvas.width, this.ctxPalette.canvas.height);
  }

 initChooser(){
   let canvasChooser = this.chooser.nativeElement;
   var ctx = canvasChooser.getContext("2d");

   var currentWidth = window.innerWidth;

   var pixelRatio = this.getPixelRatio(ctx);

   var width = currentWidth * 90/100;
   var height = width * 0.05;

   ctx.canvas.width  = width * pixelRatio;
   ctx.canvas.height = height * pixelRatio;

   ctx.canvas.style.width = width + "px";
   ctx.canvas.style.height = height + "px";

   this.drawChooser(ctx);

   var eventChangeColorChooser = (event) => {
     this.updateColorChooser(event, canvasChooser, ctx);
   };

   canvasChooser.addEventListener('mousedown', (event) => {
     canvasChooser.addEventListener('mousemove', eventChangeColorChooser);
     this.updateColorChooser(event, canvasChooser, ctx);
   });

   canvasChooser.addEventListener('mouseup', (event) => {
     canvasChooser.removeEventListener('mousemove', eventChangeColorChooser);
     this.updateColorChooser(event, canvasChooser, ctx);
     this.drawChooser(ctx);
     this.drawChooserSelector(ctx, this.chooserX);
   });

 }

 drawChooser(ctx : CanvasRenderingContext2D){

   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

   var gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);

   // Create color gradient
   gradient.addColorStop(0,    "rgb(255,   0,   0)");
   gradient.addColorStop(0.15, "rgb(255,   0, 255)");
   gradient.addColorStop(0.33, "rgb(0,     0, 255)");
   gradient.addColorStop(0.49, "rgb(0,   255, 255)");
   gradient.addColorStop(0.67, "rgb(0,   255,   0)");
   gradient.addColorStop(0.84, "rgb(255, 255,   0)");
   gradient.addColorStop(1,    "rgb(255,   0,   0)");

     // Apply gradient to canvas
   ctx.fillStyle = gradient;
   ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
 }

 getPixelRatio(ctx){
   var dpr = window.devicePixelRatio || 1;

   var bsr = ctx.webkitBackingStorePixelRatio ||
   ctx.mozBackingStorePixelRatio ||
   ctx.msBackingStorePixelRatio ||
   ctx.oBackingStorePixelRatio ||
   ctx.backingStorePixelRatio || 1;

   return dpr / bsr;
 }

 updateColorChooser(event, canvas, context){
   this.color = this.colorFromChooser = this.getColor(event, canvas, context, true);
   this.colorChanged.emit(this.color);
   this.drawPalette(this.color);
   this.drawSelector(this.ctxPalette, this.ctxPalette.canvas.width, this.ctxPalette.canvas.height / 2);
 }

 updateColor(event, canvas, context){
   if(this.color){
    this.previousColor = this.color.repeat(1);
   }
   this.color = this.getColor(event, canvas, context, false);
 }

 getColor(event, canvas, context, fromChooser : boolean) : string {

   var bounding = canvas.getBoundingClientRect();

   var x = (event.pageX - bounding.left) * this.getPixelRatio(context);
   var y = (event.pageY - bounding.top) * this.getPixelRatio(context);

   if(fromChooser){
     this.chooserX = x;
   } else{
     this.paletteX = x;
     this.paletteY = y;
   }

   var imageData = context.getImageData(x,  y, 1, 1);
   var red = imageData.data[0];
   var green = imageData.data[1];
   var blue = imageData.data[2];
   return "#" + this.toHex(red) + this.toHex(green) + this.toHex(blue);
 }

 toHex(n) {
   n = parseInt(n,10);
   if (isNaN(n)) return "00";
   n = Math.max(0,Math.min(n,255));
   return "0123456789ABCDEF".charAt((n-n%16)/16)  + "0123456789ABCDEF".charAt(n%16);
}
}
