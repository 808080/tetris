const tetrominoes = [
  [//I
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ]
  ],
  
  [//J
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0]
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1]
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0]
    ]
  ],
  
  [//L
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1]
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0]
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    ]
  ],

  [//O
    [
      [1, 1],
      [1, 1]
    ]
  ],

  [//S
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1]
    ],
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0]
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0]
    ]
  ],

  [//T
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0]
    ]
  ],

  [//Z
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1]
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0]
    ]
  ]
];

const colors = [
  '#00fdff',
  '#f00',
  '#f0f',
  '#00f',
  '#ffff00',
  '#00ff00',
  '#ff8000'
];
const empty = '#fff';
const blockBorder = '#ccc';

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

const nextCanvas = document.getElementById('next');
const ctxNext = nextCanvas.getContext('2d');

const curScore = document.getElementById('score');
const bestScore = document.getElementById('best');
const level = document.getElementById('level');
const velocityBar = document.getElementById('velocity');

const KOROBEINIKI = new Audio('Tetris.mp3');
KOROBEINIKI.loop = true;


let score = 0;
let best = localStorage.getItem('highScore');
let reset;
let velocity;
let gameOver = false;
let firstTry = true;
let frame;

let currentPiece;
let nextPiece;

let levelTimer;

const COLS = 10;
const ROWS = 20;
const BLOCK = 30;

bestScore.innerHTML = best;


canvas.width = COLS * BLOCK;
canvas.height = ROWS * BLOCK;

nextCanvas.width = 4 * BLOCK;
nextCanvas.height = 4 * BLOCK;

velocity = level.innerHTML = velocityBar.value = 1;
velocityBar.addEventListener('input', () => {
  velocity = level.innerHTML = velocityBar.value;
});


function randomize() {
  return Math.floor(Math.random() * tetrominoes.length);
}


function drowBlock(ctx, x, y, color, border){
  ctx.fillStyle = color;
  ctx.fillRect(x*BLOCK, y*BLOCK, BLOCK, BLOCK);
  ctx.strokeStyle = border;
  ctx.strokeRect(x*BLOCK, y*BLOCK, BLOCK, BLOCK);
}

let board = [];
for(r = 0; r < ROWS; r++){
  board[r] = [];
  for(c = 0; c < COLS; c++){
      board[r][c] = empty;
  }
}

function drawBoard(){
  for(r = 0; r < ROWS; r++){
    for(c = 0; c < COLS; c++){
      drowBlock(ctx, c,r,board[r][c], blockBorder);
    }
  }
}
drawBoard();


function resetBoard() {
  for(r = 0; r < ROWS; r++){
    for(c = 0; c < COLS; c++){
      board[r][c] = empty;
      drowBlock(ctx, c,r,board[r][c], blockBorder);
    }
  }
  getTetromino();
}

function overMessage() {
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(2*BLOCK, 2*BLOCK, 6*BLOCK, 5*BLOCK);
  ctx.font = "34px Arial";
  ctx.fillStyle = empty;
  ctx.textAlign = "center";
  ctx.fillText("Game", 5*BLOCK, 4*BLOCK);
  ctx.fillText("Over", 5*BLOCK, 6*BLOCK);
}


class Piece {

  constructor(shape, color) {
    this.shape = shape;
    this.color = color;

    this.state = 0;
    this.curState = this.shape[this.state];

    // this.x = 3;
    this.y = -2;
    //check for square initial x
    this.shape.length == 1 ? this.x = 4 : this.x = 3;
  }

  draw(color, blockBorder){
    for(r = 0; r < this.curState.length; r++){
      for(c = 0; c < this.curState.length; c++){
        if(this.curState[r][c]){
            drowBlock(ctx, this.x + c, this.y + r, color, blockBorder);
        }
      }
    }
  }

  add(){
    drawBoard();

    this.draw(this.color, blockBorder);
  }

  remove(){
    this.draw(empty, 'transparent');
  }

  down(){
    if(!this.collision(0,1,this.curState)){
      this.remove();
      this.y += 0.1;
      this.add();
    }else{
      this.lock();
      getTetromino();
    }
  }

  left(){
    if(!this.collision(-1,0,this.curState)){
      this.remove();
      this.x--;
      this.add();
    }
  }

  right(){
    if(!this.collision(1,0,this.curState)){
      this.remove();
      this.x++;
      this.add();
    }
  }

  drop(){
    while(!this.collision(0,1,this.curState)){
      this.remove();
      this.y += 0.1;
    }
    this.lock();
    getTetromino();
  }

  rotate(){
    if(this.shape.length > 1){ //checks for square shape
      let checkRotation = this.shape[(this.state + 1)%this.shape.length];
      let kick = 0;

      if(this.collision(0,0,checkRotation)){
        if(this.x > COLS/2){ //sets kick = 2/-2 for I shape
          (this.x == COLS-2 && this.curState.length > 3) ? kick = -2 : kick = -1;
        }else{
          (this.x == -2 && this.curState.length > 3) ? kick = 2 : kick = 1;
        }
        // console.log(this.curState.length);
        // console.log(this.x);
      }

      if(!this.collision(kick,0,checkRotation)){
        this.remove();
        this.x += kick;
        this.state = (this.state + 1) % this.shape.length;

        // console.log(this.state);
        
        this.curState = this.shape[this.state];
        this.add();
      }
    }
  }

  collision(x,y,shape){
    for(r = 0; r < shape.length; r++){
      for(c = 0; c < shape.length; c++){
        let Ox = Math.floor(this.x) + c + x;
        let Oy = Math.floor(this.y) + r + y;

        if(!shape[r][c]){
          continue;
        }

        if(Ox < 0 || Ox >= COLS || Oy >= ROWS){
          return true;
        }

        if(Oy < 0){
          continue;
        }

        if(board[Oy][Ox] != empty){
          return true;
        }
      }
    }
    return false;
  }

  lock(){
    for(r = 0; r < this.curState.length; r++){
      for(c = 0; c < this.curState.length; c++){
        if(gameOver){
          best = Math.max(best, score);
          bestScore.innerHTML = best;
          localStorage.setItem('highScore', best);
          clearInterval(levelTimer);
          KOROBEINIKI.pause();
          velocityBar.disabled = false;
          velocity = level.innerHTML = velocityBar.value;
          window.cancelAnimationFrame(frame);
          window.requestAnimationFrame(overMessage);
          break;
        }
       
        if(!this.curState[r][c]){
          continue;
        }

        if(this.y <= 0){
          gameOver = true;
          // console.log('Game Over');
          break;
        }

        board[Math.floor(this.y) + r][Math.floor(this.x)+ c] = this.color;
        
      }
    }

    let mult = 0;

    for (let r = 0; r < ROWS; r++) {
      let fullRow = true;
      for (let c = 0; c < COLS; c++) {
          fullRow = fullRow && (board[r][c] != empty);
      }

      if (fullRow) {
        for (let y = r; y > 1; y--) {
          for (let c = 0; c < COLS; c++) {
              board[y][c] = board[y-1][c];
          }
        }

        for (let c = 0; c < COLS; c++) {
          board[0][c] = empty;
        }
        mult++;

      }
    }
    // console.log(mult);
    if(mult){
      score += 100 * 2**(mult-1);
      // console.log(score);
      curScore.innerHTML = score;
      best = Math.max(best, score);
      bestScore.innerHTML = best;
      localStorage.setItem('highScore', best);
    }
    
    drawBoard();
  }
}


document.addEventListener('keydown', (e) => {
  if(!gameOver) move(e);
});

function move(e) {
  // console.log(gameOver);
  
    switch (e.key) {
        case 'ArrowLeft':
            currentPiece.left();
            break;
        
        case 'ArrowRight':
            currentPiece.right();
            break;

        case 'ArrowUp':
            currentPiece.rotate();
            break;

        case 'ArrowDown':
            currentPiece.drop();
            break;

        default:
            break;
    }
    e.preventDefault();
}


function nextTetromino() {
  let rndShape = tetrominoes[randomize()];
  let rndColor = colors[randomize()];
  return new Piece(rndShape, rndColor);
}

nextPiece = nextTetromino();

function drawNext() {
  ctxNext.fillStyle = empty;
  ctxNext.fillRect(0,0,4 * BLOCK,4 * BLOCK);
  for(r = 0; r < nextPiece.curState.length; r++){
    for(c = 0; c < nextPiece.curState.length; c++){
      if(nextPiece.curState[r][c]){
        drowBlock(ctxNext, c, r, nextPiece.color, blockBorder);
      }
    }
  }
}

function getTetromino(){
  currentPiece = nextPiece;
  nextPiece = nextTetromino();
  drawNext();
  // console.log(currentPiece);
  // console.log(nextPiece);
}


let start = Date.now();

function init() {
  let now = Date.now();
  let interval = now - start;
  if(interval > (110 - (velocity * 10))){
    currentPiece.down();
    start = Date.now();
  }
  if(!gameOver) frame = window.requestAnimationFrame(init);
}

function speedUp() {
  if(velocity <= 10){
    velocity++;
    level.innerHTML = velocity;
  }
}

function play() {
  if(!firstTry && !gameOver){
    reset = confirm('Reset?');
  }
  if(gameOver || firstTry || reset){
    getTetromino();

    velocityBar.disabled = true;
    KOROBEINIKI.currentTime = 0;
    KOROBEINIKI.play();
    levelTimer = setInterval(speedUp, 30000);
    
    firstTry = false;
    gameOver = false;

    score = 0;
    curScore.innerHTML = score;
    resetBoard();
    init();
  }
}