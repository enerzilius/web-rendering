console.log(render);
render.width = 1000;
render.height = 1000;

const context = render.getContext("2d");

// Canvas Attributes
const canvasHeight = 1000;
const canvasWidth = 1000;
const backgroundColor = "#EEEEEE";
const borderWidth = 10;

context.fillStyle = backgroundColor;
context.fillRect(0, 0, canvasWidth, canvasHeight);

// Point

const pointLength = 50;
const pointColor = "#FD11FD";

context.fillStyle = pointColor;
context.fillRect(canvasWidth/2 - pointLength/2, canvasHeight/2 - pointLength/2, pointLength, pointLength);

console.log(context);
