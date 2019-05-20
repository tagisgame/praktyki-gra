const fs = require('fs');

// <editor-fold desc="Classes">
/**
 * Main class, containing board. list of any instances
 * and useful methods
 * @class
 *
 * @constructor
 *
 * @property {[]} board array used as board for game
 * @property {[]} mobList list of all mobs on board
 * @property {[]} mobIdLeft list of ID's left for mobs
 * @property {[]} itemList list of all items on board
 */
function Game (board = []) {
  this.board = board;
  for (let x = 0; x < this.board.length; x++) {
    for (let y = 0; y < this.board[x].length; y++) {
      this.board[x][y] = this.board[x][y] === "." ? new Cell(x, y) : new Cell(x, y, true);
    }
  }

  this.player = {}
  this.player.prototype = Mob;

  this.mobList = [];
  this.mobIdLeft = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32];
  this.itemList = [];

  /**
   * Fills board with mobs with definied type
   * @param {string} type type of mob (types: snake, dragon, player, random)
   * @param {number} count how many mobs you want to set
   *
   * If you leave the type empty, this method will fill with
   * random MONSTERS!
   * @returns {[]} this.mobList array
   **/
  this.fillWithMobs = function (type = "random", count = 1) {
    let mob = type;
    while (count > 0) {
      let randX = Math.floor(Math.random() * (this.board.length - 1));
      let randY = Math.floor(Math.random() * (this.board[randX].length - 1));
      if(this.board[randX][randY].mob !== null || this.board[randX][randY].wall) {
        continue;
      }

      if (type === "random") {
        mob = Math.random() < 0.5 ? "snake" : "dragon";
      }
      let id = this.mobIdLeft.shift();
      let hp = mob === "snake" ? 2 : (mob === "dragon" ? 25 : 10);
      this.mobList.push(new Mob(id, randX, randY, mob, hp));
      this.board[randX][randY].mob = id;

      count--;
    }
    return this.mobList;
  }
  /**
   * Fills board with items with definied type and name
   * @param {string} type type of item (types: weapon, potion)
   * @param {string} name name of mob (weapons: dagger, axe)(pots: heal, poison)
   * @param {number} count how many mobs you want to set
   *
   * If you leave the name empty, this method will fill with
   * random ITEMS WITH DEFINIED TYPE!
   **/
  this.fillWithItems = function (type, name, count) {
    //...
  }
  /**
   * Draws board in console
   *
   **/
  this.draw = function () {
    for (let x = 0; x < this.board.length; x++) {
      let buf = "";
      for (let y = 0; y < this.board[x].length; y++) {
        if (this.board[x][y].wall) {
          buf += "#";
        } else if (this.board[x][y].mob !== null) {
          buf += this.board[x][y].mob === "snake" ? "S" : (this.board[x][y].mob === "dragon" ? "D" : "@");
        } else {
          buf += "."
        }
      }
      console.log(buf);
    }
  }
}
/**
 * A single cell on board, stores informations about what is placed
 * on that certain coordinates
 * @class
 *
 * @constructor
 *
 * @property {number} x x position of cell
 * @property {number} y y position of cell
 * @property {bool} wall true when there is a wall on that spot
 * @property {number} mob ID of mob standing on that spot (null if there is not any mob)
 * @property {number} item ID of item placed on that spot (null if there is not any item)
 **/
function Cell (x, y, wall = false, mob = null, item = null) {
  this.x = x;
  this.y = y;
  this.wall = wall;
  this.mob = mob;
  this.item = item;
}
/**
 * A mob, a single creature living in our game :D It could be monter or player.
 * @class
 *
 * @constructor
 *
 * @property {number} id ID of mob, used to finding mob in Game.mobList
 * @property {number} x x position of mob
 * @property {number} y y position of mob
 * @property {string} type type of mob (player/snake/dragon)
 * @property {number} [hp] mob's health points
 * @property {number} [ap] mob's attack points (damage)
 *
 **/
var mob = require("mob.js").Mob();
// </editor-fold>

// <editor-fold desc="Game loop">
let randBoard = 1;
let game = new Game(fs.readFileSync('zestaw_plansz/board' + randBoard + '.txt', 'utf8').split("\n").map(_ => _.split("")));
//console.log(game.board);
console.log(game.fillWithMobs("random",5));
game.draw();
// </editor-fold>
