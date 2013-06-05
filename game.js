/**
 *
 * A simple snake game using the canvas element
 *
 * @author Pavel Timofeev <pav.timofeev@gmail.com>
 *
 */

(function() {
  'use strict';

  var requestAnimationFrame =  window.requestAnimationFrame ||
                               window.webkitRequestAnimationFrame ||
                               window.mozRequestAnimationFrame,
      canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d'),
      info;

  // Game object
  var game = {
    fps : 8,               // Frames per second
    score : 0,             // Player's score
    isOver : false,        // Holds the game status
    cellSize : 32,         // Cell size in pixels
    height: 480,           // Height of the game window
    width: 480,            // Width of the game window

    initialize : function() {
      this.score = 0;
      this.isOver = false;
      info = document.getElementById('score');
      snake.initialize();
      bunny.initialize();
    },

    checkCollisions : function(x, y) {
      if (x < 0 || y < 0 || x >= this.width || y >= this.height || snake.isOccupied(x, y)) {
        this.isOver = true;
      }
    },

    drawBackground : function() {
      var img = new Image();
      img.src = 'images/grass.png';
      img.onload = function() {
        var ptrn = ctx.createPattern(img, 'repeat');
        ctx.fillStyle = ptrn;
        ctx.fillRect(0, 0, game.width, game.height);
      };
    },

    drawObjects : function() {
      this.drawBackground();
      bunny.draw();
      snake.draw();
    },

    render : function() {
      var x = snake.nextCell().x;
      var y = snake.nextCell().y;

      info.innerHTML = game.score;

      this.checkCollisions(x, y);

      if (!this.isOver) {
        if (bunny.isEaten(x, y)) {
          document.getElementById('yumyum').play();
          this.score += 1;
          bunny.initialize();
        } else {
          snake.body.pop();
        }

        snake.body.unshift({'x': x, 'y': y});

        this.drawObjects();
      }
    }
  };

  // Snake object
  var snake = {
    direction : 'left', // Initial direction of the snake
    body : [],

    head : function() {
      return {x: this.body[0].x, y: this.body[0].y};
    },

    add : function(x, y) {
      this.body.push({'x':x, 'y':y});
    },

    nextCell : function() {
      var x = this.head().x,
          y = this.head().y;

      switch (this.direction) {
        case 'right':
          x += game.cellSize;
          break;
        case 'left':
          x -= game.cellSize;
          break;
        case 'up':
          y -= game.cellSize;
          break;
        case 'down':
          y += game.cellSize;
          break;
      }

      return {'x': x, 'y': y};
    },

    isOccupied : function(x, y) {
      for (var i = 0, len = this.body.length; i < len; i++) {
        if (this.body[i].x === x && this.body[i].y === y) {
          return true;
        }
      }
      return false;
    },

    initialize : function() {
      var position = {x : 12, y : 7}; // Cell where the snake will apear

      this.body = [];

      for (var i = 0; i < 5; i++) {
        this.add((position.x+i)*game.cellSize, position.y*game.cellSize);
      }
    },

    draw : function () {
      var src = '';

      for (var i = 0, len = this.body.length; i < len; i++) {
        if (i === 0) {
          switch (this.direction) {
            case 'right':
              src = 'head-right.png';
              break;
            case 'left':
              src = 'head-left.png';
              break;
            case 'up':
              src = 'head-up.png';
              break;
            case 'down':
              src = 'head-down.png';
              break;
          }
        } else {
          src = 'body.png';
        }
        loadImage(src, this.body[i].x, this.body[i].y);
      }
    }
  };

  // Bunny
  var bunny = {
    x : 0,
    y : 0,

    isEaten : function(x, y) {
      return this.x === x && this.y === y;
    },

    // Find an empty cell for the new bunny
    // We can't place the bunny on a cell occupied by the snake
    initialize : function () {
      var x, y, size;

      size = (game.height - game.cellSize) / game.cellSize;

      while (true) {
        x = Math.ceil(Math.random() * size) * game.cellSize;
        y = Math.ceil(Math.random() * size) * game.cellSize;

        if (!snake.isOccupied(x, y)) {
          this.x = x;
          this.y = y;
          return true;
        }
      }
    },

    draw: function () {
      loadImage('bunny.png', this.x, this.y);
    }
  };

  function loadImage(source, x, y) {
    var img = new Image();
    img.onload = function() {
      ctx.drawImage(img, x, y);
    };
    img.src = 'images/' + source;
  }

  function main() {
    if (!game.isOver) {
      setTimeout(function() {
        requestAnimationFrame(main);
      }, 1000 / game.fps);
      game.render();
    }
  }

  window.onkeydown = function(e) {
    var key = e.keyCode,
        direction = snake.direction;

    if (key === 37 && direction !== 'right') {
      direction = 'left';
    }
    else if (key === 38 && direction !== 'down') {
      direction = 'up';
    }
    else if (key === 39 && direction !== 'left') {
      direction = 'right';
    }
    else if (key === 40 && direction !== 'up') {
      direction = 'down';
    }
    snake.direction = direction;
  };

  game.initialize();
  main();

})();

