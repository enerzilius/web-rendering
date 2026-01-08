const context = render.getContext("2d");

// Canvas Attributes
const canvasHeight = 800;
const canvasWidth = 800;

render.width = canvasWidth;
render.height = canvasHeight;

const pointSize = 20;

const FPS = 60;

let vertices = [
  {x: 0.5, y: 0.5, z: 0.5},
  {x: -0.5, y: 0.5, z: 0.5},
  {x: -0.5, y: -0.5, z: 0.5},
  {x: 0.5, y: -0.5, z: 0.5},

  {x: 0.5, y: 0.5, z: -0.5},
  {x: -0.5, y: 0.5, z: -0.5},
  {x: -0.5, y: -0.5, z: -0.5},
  {x: 0.5, y: -0.5, z: -0.5},
];

let faces = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 4, 7, 3],
  [1, 5, 6, 2],
];

const reader = new FileReader();

function updateStyle(color) {
  document.documentElement.style.setProperty('--foregroundColor', `${color}`);
}

function handleFileInput() {
  const file = fileInput.files[0];
  const splitName = file.name.split('.');
  console.log(splitName);
  if(splitName[splitName.length-1] != "obj") {
    alert('Only .obj files are accepted!');
    return;
  }// validar tipo
  reader.onload = (event) => processFileContent(reader);
  reader.readAsText(file);
}

function processFileContent(reader) {
  let content = reader.result;
  content = content.split('#')[1];
  content = content.split('\r\n\r\n')[2];
  content = content.split('v');
  
  for(const entry of content) {
    if(entry == '') continue;

    const vertices = entry.split(' ');
    for(let vertex of vertices) {
      if(vertex == '') continue;
      console.log(vertex);
    }
  }

}

function normalizeVertices() {
  return;
}

function clear() {
  const backgroundColor = backgroundColorInput.value;
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawPoint({x, y, z}) {
  const size = pointSize * (1/z);
  context.fillStyle = pointColor;
  context.fillRect(x-(size/2), y-(size/2), size, size);
}

function drawLine(point1, point2) {
  const pointColor = foregroundColorInput.value;
  updateStyle(pointColor);
  context.lineWidth = 3; 
  context.strokeStyle = pointColor;
  context.beginPath();
  context.moveTo(point1.x, point1.y);
  context.lineTo(point2.x, point2.y);
  context.stroke();
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
  const dt = 1/FPS;
  //d.z += dt;
  clear();
  angle += dt;

  for(const f of faces) {
    for(let i = 0; i < f.length; i++) {
      const a = vertices[f[i]];
      const b = vertices[f[(i+1)%f.length]];
      const point1 = normalizedToCanvas(project(translate(rotation_xz(a, angle), d)));
      const point2 = normalizedToCanvas(project(translate(rotation_xz(b, angle), d)));
      drawLine(point1, point2);
    }
  }
  setTimeout(drawFrame, 1000/FPS);
}

fileInput.addEventListener('change', handleFileInput);
drawFrame();
