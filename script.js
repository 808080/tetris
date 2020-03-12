window.addEventListener('load', startGame);

function startGame() {
  gameArea.start();
}

const tetrominoes = [
  {//I
    'color': '#00fdff',
    'polygon': [
      [0, 0],
      [10, 0],
      [20, 0],
      [30, 0]
    ]
  },
  {//Z
    'color': '#f00',
    'polygon': [
      [0, 0],
      [10, 0],
      [10, 10],
      [20, 10]
    ]
  },
  {//T
    'color': '#f0f',
    'polygon': [
      [0, 0],
      [10, 0],
      [10, 10],
      [20, 0]
    ]
  },
  {//J
    'color': '#00f',
    'polygon': [
      [0, 0],
      [10, 0],
      [20, 0],
      [20, 10]
    ]
  },
  {//O
    'color': '#ffff00',
    'polygon': [
      [0, 0],
      [10, 0],
      [0, 10],
      [10, 10]
    ]
  },
  {//S
    'color': '#00ff00',
    'polygon': [
      [0, 10],
      [10, 0],
      [10, 10],
      [20, 10]
    ]
  },
  {//L
    'color': '#ff8000',
    'polygon': [
      [0, 0],
      [10, 0],
      [20, 0],
      [0, 10]
    ]
  }
];

let gameArea = {
  canvas: document.getElementById('field'),
  start: function () {
    this.canvas.width = 200;
    this.canvas.height = 400;
    this.context = this.canvas.getContext("2d");
    this.interval = setInterval(updateGameArea(tetrominoes), 500);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function Component(tetrominoes, order) {
  this.tetromino = tetrominoes[order];
  this.color = this.tetromino.color;
  this.shape = this.tetromino.polygon;
  this.render = function () {
    ctx = gameArea.context;
    ctx.save();
    ctx.translate(80, 0);
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "#1a1a1a";
    for (let i = 0; i < this.shape.length; i++) {
      ctx.fillRect(...this.shape[i], 10, 10);
      ctx.strokeRect(...this.shape[i], 10, 10);
    }
    ctx.restore();
  };
  this.move = document.addEventListener('keydown', function (e) {
    console.log(e);
    
    switch (e.which) {
      case 'ArrowLeft':
        ctx.translate(-10, 0);
        break;

      case 'ArrowUp':
        ctx.rotate(Math.PI / 2);
        break;

      case 'ArrowRight':
        ctx.translate(10, 0);
        break;

      case 'ArrowDown':
        ctx.translate(0, 10);
        break;

      default: return; // exit this handler for other keys
    }
    e.preventDefault();
  });
}


function updateGameArea(tetrominoes) {
  
  let tetromino = new Component(tetrominoes, 1).render();





}