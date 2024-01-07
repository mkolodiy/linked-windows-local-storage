let windowId;

function prepareCanvas() {
  const canvas = document.getElementById('canvas');
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  const ctx = canvas.getContext('2d');
  return ctx;
}

function drawCircle(ctx, coordinates) {
  ctx.beginPath();
  ctx.arc(coordinates.x, coordinates.y, 100, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
}

function initLocalStorage() {
  const circles = localStorage.getItem('circles');
  if (!circles) {
    localStorage.setItem('circles', JSON.stringify({}));
  }
  const nextId = localStorage.getItem('nextId');
  if (!nextId) {
    localStorage.setItem('nextId', 1);
  }
}

function writeToLocalStorage(coordinates) {
  const nextId = Number(localStorage.getItem('nextId'));
  if (!windowId) {
    windowId = nextId;
    localStorage.setItem('nextId', nextId + 1);
  }

  const circles = localStorage.getItem('circles');
  if (circles && windowId) {
    const parsedCircles = JSON.parse(circles);
    parsedCircles[windowId] = coordinates;
    localStorage.setItem('circles', JSON.stringify(parsedCircles));
  }
}

function getCircles() {
  const circles = localStorage.getItem('circles');
  if (circles) {
    const parsedCircles = JSON.parse(circles);
    return Object.values(parsedCircles);
  }
  return {};
}

function getCoordinates() {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    windowScreenX: window.screenX,
    windowScreenY: window.screenY,
  };
}

function main() {
  const ctx = prepareCanvas();
  const coordinates = getCoordinates();
  writeToLocalStorage(coordinates);
  drawCircle(ctx, coordinates);

  setInterval(() => {
    const coordinates = getCoordinates();
    writeToLocalStorage(coordinates);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    getCircles().forEach((element) => {
      drawCircle(ctx, {
        x: element.x + element.windowScreenX - window.screenX,
        y: element.y + element.windowScreenY - window.screenY,
      });
    });
  }, 100);
}

initLocalStorage();
main();
