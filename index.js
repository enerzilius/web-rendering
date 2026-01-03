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
    z: p.z,
  };
}

function project({x, y, z}) {
  return {
    x: x/z,
    y: y/z,
    z: z,
  };
}

const vertices = [
  {x: 0.5, y: 0.5, z: 1},
  {x: 0.5, y: -0.5, z: 1},
  {x: -0.5, y: 0.5, z: 1},
  {x: -0.5, y: -0.5, z: 1},

  {x: 0.5, y: 0.5, z: -1},
  {x: 0.5, y: -0.5, z: -1},
  {x: -0.5, y: 0.5, z: -1},
  {x: -0.5, y: -0.5, z: -1},
]

function translate(v, d) {
  return { x: v.x + d.x, y: v.y + d.y, z: v.z + d.z };
}

function rotation_xz(v, angle) {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return {
    x: v.x*cosine-v.z*sine,
    y: v.y,
    z: v.x*sine+v.z*cosine,
  }
}

let d = { x: 0, y: 0, z: 2};
let angle = 0;
function drawFrame() {
  //let direction = 1;
  //const tolerance = 0.1;
  //if(coordinates.z >= 10 || coordinates.z <= 2-tolerance) direction *= -1;
  //coordinate s.z += (1 * direction)/FPS;
  const dt = 1/FPS;
  //d.z += dt;
  clear();
  angle += dt;
  for(const v of vertices) {
    drawPoint(normalizedToCanvas(project(translate(rotation_xz(v, angle), d))));
  }
  setTimeout(drawFrame, 1000/FPS);
}

setTimeout(drawFrame, 1000/FPS);
