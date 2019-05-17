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
 * @property {[]} itemList list of all items on board
 */
function Game (board = []) {
  this.board = board;
  this.mobList = [];
  this.itemList = [];

  /**
   * Fills board with mobs with definied type
   * @param {string} type type of mob (types: snake, dragon, player)
   * @param {number} count how many mobs you want to set
   *
   * If you leave the type empty, this method will fill with
   * random MONSTERS!
   **/
  this.fillWithMobs = function (type, count) {
    //...
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
    console.log(board);
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
 **/
 function Mob (id, x, y, type = "player", hp = 10, ap = 1) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.type = type;
  this.hp = (this.type === "snake" ? 2 : (this.type === "dragon" ? 25 : hp));
  this.ap = (this.type === "snake" ? 1 : (this.type === "dragon" ? 4 : ap));

  /**
   * Moves mob in defined direction
   * @param {Object} game main object, board on which the mob is
   * @param {string} dir direction to move mob (u,r,d,l)
   *
   * @returns {bool} false if mob cannot be moved (eg. because of wall)
   **/
  this.move = function (game, dir) {
    /** Move mob */
    let go = (game, offsetX = 0, offsetY = 0) => {
      if (this.x + offsetX < 0 || this.x + offsetX > game.board[this.x].lenght) {
        return false;
      }
      if (this.y + offsetY < 0 || this.y + offsetY > game.board.lenght) {
        return false;
      }
      if (game.board[this.x + offsetX][this.y + offsetY].wall) {
        return false;
      }
      if (game.board[this.x + offsetX][this.y + offsetY].mob !== null) {
        return this.attack(game.board[this.x + offsetX][this.y + offsetY].mob);
      }
      if (this.type === "player" && game.board[this.x + offsetX][this.y + offsetY].item !== null) {
        return this.equip(game.board[this.x + offsetX][this.y + offsetY].item);
      }
      game.board[this.x][this.y].mob = null;
      game.board[this.x + offsetX][this.y + offsetY].mob = this.id;
      this.x += offsetX;
      this.y += offsetY;
      return true;
    }

    switch (dir) {
      case "u":
        return go(game, 0, -1);
        break;
      case "r":
        return go(game, 1, 0);
        break;
      case "d":
        return go(game, 0, 1);
        break;
      case "l":
        return go(game, -1, 0);
        break;
      default:
        return undefined;
        break;
    }
  }
 }
// </editor-fold>

// <editor-fold desc="Game loop">
let randBoard = 1;
let game = new Game(fs.readFileSync('zestaw_plansz/board' + randBoard + '.txt', 'utf8').split("\n").map(_ => _.split("")));
// </editor-fold>
