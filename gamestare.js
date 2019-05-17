const fs = require('fs');

// <editor-fold desc="Objects">
var Cell = function (x, y, wall = false, ocuppiedBy = null) {
  this.x = x;
  this.y = y;
  this.wall = wall;
  this.ocuppiedBy = ocuppiedBy;
}
var Creature = function (id, startX, startY, type = "player", healthPoints = 10, attackPoints = 1) {
  this.id = id;
  this.x = startX;
  this.y = startY;
  this.type = type;

  this.hp = (this.type === "snake" ? 2 : (this.type === "dragon" ? 25 : healthPoints));
  this.ap = attackPoints;

  this.move = function (direction) {
    switch (direction) {
      case "u":
        if (board.board[this.x][this.y - 1].ocuppiedBy !== null) {
          this.attack(board.board[this.x][this.y - 1].ocuppiedBy)
        } else if (!(board.board[this.x][this.y - 1].wall)) {
          board.board[this.x][this.y].ocuppiedBy = null;
          board.board[this.x][this.y - 1].ocuppiedBy = this.id;
          this.y--;
        }
        break;
      case "r":
        if (board.board[this.x + 1][this.y].ocuppiedBy !== null) {
          this.attack(board.board[this.x + 1][this.y].ocuppiedBy)
        } else if (!(board.board[this.x + 1][this.y].wall)) {
          board.board[this.x][this.y].ocuppiedBy = null;
          board.board[this.x + 1][this.y].ocuppiedBy = this.id;
          this.x++;
        }
        break;
      case "d":
        if (board.board[this.x][this.y + 1].ocuppiedBy !== null) {
          this.attack(board.board[this.x][this.y + 1].ocuppiedBy)
        } else if (!(board.board[this.x][this.y + 1].wall)) {
          board.board[this.x][this.y].ocuppiedBy = null;
          board.board[this.x][this.y + 1].ocuppiedBy = this.id;
          this.y++;
        }
        break;
      case "r":
        if (board.board[this.x - 1][this.y].ocuppiedBy !== null) {
          this.attack(board.board[this.x - 1][this.y].ocuppiedBy)
        } else if (!(board.board[this.x - 1][this.y].wall)) {
          board.board[this.x][this.y].ocuppiedBy = null;
          board.board[this.x - 1][this.y].ocuppiedBy = this.id;
          this.x--;
        }
        break;
    }
  }

  this.attack = function (targetId) {

  }

  this.moveToPlayer = function () {
    if(this.type !== "player") {
      //...
    }
  }
}
var Board = function (array) {
  // Actual board
  this.board = array;
  // Filling actual board
  for (let x = 0; x < this.board.length; x++) {
    for (let y = 0; y < this.board[x].length; y++) {
      this.board[x][y] = this.board[x][y] === "#" ? new Cell(x,y,true) : new Cell(x,y,false);
    }
  }

  // Filling with creatures
  this.creatureList = [];
  this.fillWithMonsters = function (howMany = 1, player = false) {
    while(howMany > 0) {
      let type = (player ? "player" : (Math.random() < 0.5 ? "snake" : "dragon"));
      let randX = Math.floor(Math.random() * this.board.length);
      let randY = Math.floor(Math.random() * this.board[randX].length);

      if(!(this.board[randX][randY].wall) && !(this.board[randX][randY].ocuppiedBy !== null)) {
        this.creatureList.push(new Creature(this.creatureList.length,randX,randY,type))
        this.board[randX][randY].ocuppiedBy = this.creatureList.length - 1;
        howMany--;
      }
    }
  }
}
// </editor-fold>

// <editor-fold desc="Board preparing">
let randBoard = 1;
var board = new Board(fs.readFileSync('zestaw_plansz/board' + randBoard + '.txt', 'utf8').split("\n").map(_ => _.split("")));
for (let x = 0; x < board.board.length; x++) {
  for (let y = 0; y < board.board[x].length; y++) {
    board.board[x][y] = board.board[x][y] === "#" ? new Cell(x,y,true) : new Cell(x,y,false);
  }
}
// </editor-fold>

// <editor-fold desc="Board filling">
board.fillWithMonsters(5);
// </editor-fold>

// <editor-fold desc="Game loop">
while()
// </editor-fold>

console.log(board.creatureList);
