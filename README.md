# simple-angular-color-picker
A simple component to integrate for color picking (compatible ionic)

This is under MIT liscence so you can copy past it improve it etc

to use it:

`
<color-picker [startColor]="'#FF0000'" (colorChanged)="setColor($event)"></color-picker>
`

startColor is the color on which you want to start.

colorChanged is the event to get the color back:

`
setColor(ev: any){
	this.color = ev;
}
`

Here is how it looks like:

(https://github.com/speedfl/simple-angular-color-picker/blob/master/render.png)