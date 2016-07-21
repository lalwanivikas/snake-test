/*
** global variables
*/
var canvas = document.querySelector('#gameBoard');
var ctx = canvas.getContext('2d');
var canvasWidth;
var canvasHeight;
var canvasBorderThickness;
var snake;
var direction;
var food;
var score = 0;
var tileSize = 20;
var gameloop;
var frames = 0;


/***********************************/

var calculateBoardDimensions = function(num) {
  
  var newDimension;
  
  if (num % 20 === 0) {
    newDimension = num - tileSize;
  } else {
    newDimension = num - num%tileSize;
  }

  return newDimension;
}


var setCanvas = (function () {
  
  canvasWidth = calculateBoardDimensions(window.innerWidth);
  canvasHeight = calculateBoardDimensions(window.innerHeight);
  
  canvasBorderThickness = window.innerWidth % 2 === 0 
                          ? (window.innerWidth - canvasWidth) / 2
                          : (window.innerWidth - canvasWidth - 1) / 2
  
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.style.border = canvasBorderThickness + "px solid #222";
  
  console.log(canvas.width);
  console.log(canvas.height);
  console.log(canvasBorderThickness);

})();

var bodySnake = function(x, y) {
  ctx.fillStyle = "#000";
  ctx.fillRect(x * tileSize, y * tileSize, tileSize - 1, tileSize - 1);
  ctx.strokeStyle = "#9CCB95";
  ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
}

var pizza = function(x, y) {
  ctx.fillStyle = "#000";
  ctx.fillRect(x * tileSize, y * tileSize, tileSize - 1, tileSize - 1);
}

var scoreText = function() {
  var scoreText = "Score: " + score;
  ctx.fillStyle = "#111";
  ctx.textAlign = "center";
  ctx.font = "18px Helvetica";
  ctx.fillText(scoreText, canvasWidth / 2, canvasHeight - 5);
}

var displayFinalScore = function () {
  var finalScore = "Final Score: " + score;
  ctx.fillStyle = "#111";
  ctx.textAlign = "center";
  ctx.font = "29px Helvetica";
  ctx.fillText(finalScore, canvasWidth / 2, .8*canvasHeight);
}

var drawSnake = function() {
  
  var length = 4;
  snake = [];  
  
  for (var i = length - 1; i >= 0; i--) {
    snake.push({
      x: i,
      y: 0
    });    
  } 

}


var createFood = function() {
  
  food = {
    x: Math.floor(Math.random() * (canvasWidth / tileSize)),
    y: Math.floor(Math.random() * (canvasHeight / tileSize))
  }
  
  for (var i = 0; i < snake.length; i++) {
    var snakeX = snake[i].x;
    var snakeY = snake[i].y;
    if (food.x === snakeX && food.y === snakeY 
      || food.x < 0 
      || food.x === canvasWidth / tileSize 
      || food.y < 0 
      || food.y === (canvasHeight / tileSize) - 3 ) {
      createFood();
    }
  }

}

var checkCollision = function(x, y, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].x === x && array[i].y === y) {
      return true;
    }
  }
  return false;
}

var pauseGame = function () {
  ctx.save();
}

var resumeGame = function () {
  ctx.restore();
}

var paint = function() {
  
  frames++;
  
  if (frames%8 === 0) {
    
    // clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    var snakeX = snake[0].x;
    var snakeY = snake[0].y;

    if (direction === 'right') {
      snakeX++;
    } else if (direction === 'left') {
      snakeX--;
    } else if (direction === 'up') {
      snakeY--;
    } else if (direction === 'down') {
      snakeY++;
    }
    
    // console.log(snakeX);
    // console.log(snakeY);

    // if ( snakeX < 0
    //   || snakeX === canvasWidth / tileSize 
    //   || snakeY < 0
    //   || snakeY === canvasHeight / tileSize 
    //   || checkCollision(snakeX, snakeY, snake)) {

    //   startButton.style.display = "block";
    //   displayFinalScore();

    //   score = 0;
    //   cancelAnimationFrame(gameloop);
    //   return;

    // }

    /*
    ** no wall collision
    */

    if (snakeX === canvasWidth / tileSize) {
      snakeX = 0;
    } else if (snakeX === -1) {
      snakeX = canvasWidth / tileSize;
    }

    if (snakeY === canvasHeight / tileSize) {
      snakeY = 0;
    } else if (snakeY === -1) {
      snakeY = canvasHeight / tileSize;
    }
    
    if (checkCollision(snakeX, snakeY, snake)){
      startButton.style.display = "block";
      displayFinalScore();
      score = 0;
      cancelAnimationFrame(gameloop);
      return;
    }
    
    /*
    ** end of no wall collision
    */

    if (snakeX === food.x && snakeY === food.y) {
      var tail = {
        x: snakeX,
        y: snakeY
      };
      score++;
      createFood();
    } else {
      var tail = snake.pop();
      tail.x = snakeX;
      tail.y = snakeY;
    }


    snake.unshift(tail);

    for (var i = 0; i < snake.length; i++) {
      bodySnake(snake[i].x, snake[i].y)
    }

    pizza(food.x, food.y);
    scoreText();
  
  }
  
  gameloop = window.requestAnimationFrame(paint);

}


var init = function() {

  startButton.style.display = "none";

  direction = 'right';

  drawSnake();
  createFood();

  gameloop = window.requestAnimationFrame(paint);

}


// initiate game on start button press
var startButton = document.querySelector('#start');
startButton.addEventListener("click", function() {
  init();
});

var gameControls = document.querySelectorAll('.control');

for (var i = 0; i < gameControls.length; i++) {
 
  gameControls[i].addEventListener("click", function(event){

    buttonPressed = event.target.id;

    switch (buttonPressed) {

      case 'left':
        if (direction != 'right') {
          direction = 'left';
        }
        console.log('left');
        break;

      case 'right':
        if (direction != 'left') {
          direction = 'right';
          console.log('right');
        }
        break;

      case 'up':
        if (direction != 'down') {
          direction = 'up';
          console.log('up');
        }
        break;

      case 'down':
        if (direction != 'up') {
          direction = 'down';
          console.log('down');
        }
        break;
    }
  });

}


var gestureControls = new Hammer(canvas);
gestureControls.get('swipe').set({ direction: Hammer.DIRECTION_ALL});

// listen to events...
gestureControls.on("swipeup swipedown swiperight swipeleft", function(ev) {
  
  console.log(ev.type +" gesture detected.");

  buttonPressed = ev.type;

    switch (buttonPressed) {

      case 'swipeleft':
        if (direction != 'right') {
          direction = 'left';
        }
        console.log('left');
        break;

      case 'swiperight':
        if (direction != 'left') {
          direction = 'right';
          console.log('right');
        }
        break;

      case 'swipeup':
        if (direction != 'down') {
          direction = 'up';
          console.log('up');
        }
        break;

      case 'swipedown':
        if (direction != 'up') {
          direction = 'down';
          console.log('down');
        }
        break;
    }
});


/*
** numpad control logic
*/
var hiddenInput = document.querySelector('.hidden-input');
hiddenInput.addEventListener("input", function(event){

  keyPressed = parseInt(hiddenInput.value);
  hiddenInput.value = "";
  
  console.log(typeof keyPressed);
  
  switch (keyPressed) {

    case 4:
      if (direction != 'right') {
        direction = 'left';
      }
      console.log('left');
      break;

    case 6:
      if (direction != 'left') {
        direction = 'right';
        console.log('right');
      }
      break;

    case 8:
      if (direction != 'down') {
        direction = 'up';
        console.log('up');
      }
      break;

    case 2:
      if (direction != 'up') {
        direction = 'down';
        console.log('down');
      }
      break;
  }
});



