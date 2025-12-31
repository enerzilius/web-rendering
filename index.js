render.width = 1000;
render.height = 1000;

const context = render.getContext("2d");

// Canvas Attributes
const canvasHeight = 1000;
const canvasWidth = 1000;
const backgroundColor = "#EEEEEE";
const borderWidth = 10;

const pointSize = 50;
const pointColor = "#FD11FD";

const FPS = 60;

function clear() {
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawPoint({x, y, z}) {
  const size = pointSize * (1/z);
  context.fillStyle = pointColor;
  context.fillRect(x-size, y-size, size, size);
}

function normalizedToCanvas(p) {
  // -1 .. 1 -> 0 .. canvasWidth
  return {
    x: ((p.x+1)/2) * canvasWidth,
    y: (1 - ((p.y+1)/2)) * canvasHeight,
  };
}

function project({x, y, z}) {
  return {
    x: x/z,
    y: y/z,
  };
}

let dz = 0;
function drawFrame(coordinates) {
  //let direction = 1;
  //const tolerance = 0.1;
  //if(coordinates.z >= 10 || coordinates.z <= 2-tolerance) direction *= -1;
  //coordinates.z += (1 * direction)/FPS;
  const dt = 1/FPS;
  dz += dt;
  clear();
  const projected = project({x: coordinates.x, y: coordinates.y, z: 1+dz});
  const normalized = normalizedToCanvas({x: projected.x, y:projected.y});
  drawPoint({x: normalized.x, y: normalized.y, z: 1+dz});  
  setTimeout(() => drawFrame(coordinates), 1000/FPS);
}

var coordinates = {x: 0.0, y: 0.7, z: 10};
clear();

setTimeout(() => drawFrame(coordinates), 1000/FPS);
