document
  .querySelector("#instructions h2")
  .addEventListener("click", function () {
    document.querySelector("#instructions").style.display = "none";
    document.querySelector("#game_container").classList.remove("show_game");
  });

//to initiliaze the game board...
function init() {
  canvas = document.getElementById("my_canvas");
  H = canvas.height = 600;
  W = canvas.width = 960;
  pen = canvas.getContext("2d");
  score = 0;
  level = 0;
  difficulty = 150;

  //cell of the snake body.
  cs = 30; //cell size

  //game over condition
  game_over = true;

  foodImg = new Image();
  foodImg.src = "images/egg.png";

  food = getRandomFood();

  snake = {
    init_size: 2, //initial size of the snake
    snake_color: "white",
    cells: [],
    direction: "right",

    createSnake: function () {
      for (let i = 0; i < this.init_size; i++) this.cells.push({ x: i, y: 0 });
    },

    drawSnake: function () {
      pen.fillStyle = this.snake_color;
      for (let i = 0; i < this.cells.length; i++)
        pen.fillRect(
          this.cells[i].x * cs,
          this.cells[i].y * cs,
          cs - 3,
          cs - 3
        );
    },

    updateSnake: function () {
      let headX = this.cells[this.cells.length - 1].x;
      let headY = this.cells[this.cells.length - 1].y;

      if (food.x == headX && food.y == headY) {
        food = getRandomFood();
        score++;
        document.getElementById("display_score").innerHTML = score;
      } else this.cells.shift();

      let newX = headX + 1;
      let newY = headY;

      if (snake.direction === "ArrowUp") {
        newX = headX;
        newY = headY - 1;
      } else if (snake.direction === "ArrowDown") {
        newX = headX;
        newY = headY + 1;
      } else if (snake.direction === "ArrowLeft") {
        newX = headX - 1;
        newY = headY;
      } else {
        newX = headX + 1;
        newY = headY;
      }
      if (
        newX * cs < 0 ||
        newY * cs < 0 ||
        newX * cs + cs > W ||
        newY * cs + cs > H
      )
        game_over = true;
      else this.cells.push({ x: newX, y: newY });
    },
  };

  snake.createSnake();

  //handle keyBoard events for snake direction
  document.addEventListener("keydown", function (e) {
    snake.direction = e.key;
  });

  document.getElementById("game_start").addEventListener("click", function () {
    game_over = false;
    f = setInterval(gameLoop, difficulty);
    document.getElementById("game_start").style.display = "none";
    document.getElementById("game_level").style.display = "none";
  });

  document.querySelector(".plus").addEventListener("click", function () {
    difficulty -= 10;
    level++;
    document.getElementById("display_level").innerHTML = level;
  });

  document.querySelector(".minus").addEventListener("click", function () {
    difficulty += 10;
    level--;
    document.getElementById("display_level").innerHTML = level;
  });

  window.addEventListener(
    "keydown",
    function (e) {
      // space and arrow keys
      if (
        e.key == "ArrowUp" ||
        e.key == "ArrowDown" ||
        e.key == "ArrowRight" ||
        e.key == "ArrowLeft"
      ) {
        e.preventDefault();
      }
    },
    false
  );
}

function draw() {
  //clear the previous frame.
  pen.clearRect(0, 0, W, H);

  pen.shadowBlur = 20;
  pen.shadowColor = "black";
  snake.drawSnake();

  pen.fillStyle = food.color;
  pen.drawImage(foodImg, food.x * cs, food.y * cs, cs - 3, cs - 3);
  //   pen.fillRect(food.x * cs, food.y * cs, cs - 3, cs - 3);
}

function update() {
  snake.updateSnake();
}

function getRandomFood() {
  let foodX = Math.round((Math.random() * (W - cs)) / cs);
  let foodY = Math.round((Math.random() * (H - cs)) / cs);

  food = {
    x: foodX,
    y: foodY,
    color: "black",
  };

  return food;
}

function gameLoop() {
  if (game_over) {
    clearInterval(f);
    alert("Game Over! Your Final Score is " + score);
  }

  draw();
  update();
}

init();
