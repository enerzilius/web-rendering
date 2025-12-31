render.width = 1000;
render.height = 1000;

const context = render.getContext("2d");

// Canvas Attributes
const canvasHeight = 1000;
const canvasWidth = 1000;
const backgroundColor = "#EEEEEE";
const borderWidth = 10;

const pointSize = 20;
const pointColor = "#FD11FD";

function normalizedToCanvas(p) {
  // -1 .. 1 -> 0 .. canvasWidth
  return {
    x: ((p.x+1)/2) * canvasWidth,
    y: (1 - ((p.y+1)/2)) * canvasHeight,
  };
}

function clear() {
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawPoint({x, y}) {
  context.fillStyle = pointColor;
  context.fillRect(x-pointSize, y-pointSize, pointSize, pointSize);
}

clear();
drawPoint(normalizedToCanvas({x: 0, y: -0.5}));
