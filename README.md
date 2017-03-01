# simple-angular-color-picker
A simple component to integrate for color picking (compatible ionic)

This is under MIT liscence so you can copy past it improve it etc

to use it:

`
<color-picker [hexColor]="'#FF0000'" (colorChanged)="setColor($event)"></color-picker>
`

hexColor is the color on which you want to start (the palette will be initialized on that color). If not provided it will be on #0000FF (blue).

colorChanged is the event to get the color back:

`
setColor(ev: any){
	this.color = ev;
}
`

Here is how it looks like:

(https://github.com/speedfl/simple-angular-color-picker/blob/master/render.png)