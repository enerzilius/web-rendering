const context = render.getContext("2d");

// Canvas Attributes
const canvasHeight = 800;
const canvasWidth = 800;

render.width = canvasWidth;
render.height = canvasHeight;

const pointSize = 10;

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

  if(splitName[splitName.length-1] != "obj") {
    alert('Only .obj files are accepted!');
    return;
  }// validar tipo
  reader.onload = (event) => processFileContent(reader);
  reader.readAsText(file);
}

function processFileContent(reader) {
  const content = reader.result;
  console.log(content);
  const lines = content.split("\n");
  console.log(lines);

  let vertexBuffer = [];
  let facesBuffer = [];
  let max = 0.0;
  for(const line of lines) {
    if(line[1] != ' ') continue;
    
    const splitLine = line.split(' ');

    if(line[0] ==  'v') {
      const vertex = { x: Number(splitLine[1]), y: Number(splitLine[2]), z: Number(splitLine[3]) };
      max = getMaxVertex(max, vertex);
      vertexBuffer.push(vertex);
    }

    if(line[0] == 'f') {
      const face = [splitLine[1].split('/')[0]-1, splitLine[2].split('/')[0]-1, splitLine[3].split('/')[0]-1];
      facesBuffer.push(face);
    }
  }

  vertices = normalizeVertices(vertexBuffer, max);
  faces = facesBuffer;
}

function getMaxVertex(max, vertex) {
  if(Math.abs(vertex.x) > max) max = Math.abs(vertex.x);
  if(Math.abs(vertex.y) > max) max = Math.abs(vertex.y);
  if(Math.abs(vertex.z) > max) max = Math.abs(vertex.z);

  return max;
}

function normalizeVertices(vertexBuffer, max) {
  let normalizedBuffer = [];
  const zoom = 3;
  const centralizingOffset = 1.5;
  for(const vertex of vertexBuffer) {
    const normalized = { x: (vertex.x/max)*zoom, y: (vertex.y/max)*zoom-centralizingOffset, z: (vertex.z/max)*zoom };
    normalizedBuffer.push(normalized);
  }
  return normalizedBuffer;
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
  context.lineWidth = 1; 
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

function rotation_y(v, angle) {  
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);  
  return {                       
    x: v.x,                      
    y: v.y*cosine - v.z*sine,      
    z: v.y*sine + v.z*cosine,     
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
      const point1 = normalizedToCanvas(project(translate(rotation_xz(rotation_y(a, vRotationAngleInput.value), angle), d)));
      const point2 = normalizedToCanvas(project(translate(rotation_xz(rotation_y(b, vRotationAngleInput.value), angle), d)));
      drawLine(point1, point2);
    }
  }
  setTimeout(drawFrame, 1000/FPS);
}

fileInput.addEventListener('change', handleFileInput);
drawFrame();
