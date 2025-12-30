console.log(render);
render.width = 1000;
render.height = 1000;

const context = render.getContext("2d");

// Canvas Attributes
const HEIGHT = 1000;
const WIDTH = 1000;
const COLOR = "#EEEEEE";
const borderWidth = 10;

context.fillStyle = COLOR;
context.fillRect(0, 0, WIDTH, HEIGHT);

// Point

const pointLength = 50;
const pointColor = "#FD11FD";

context.fillStyle = pointColor;
context.fillRect(WIDTH/2 - pointLength/2, HEIGHT/2 - pointLength/2, pointLength, pointLength);

console.log(context);
