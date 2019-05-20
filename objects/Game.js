/**
 * Main class, containing board. list of any instances
 * and useful methods
 * @class
 *
 * @constructor
 *
 * @property board array used as board for game
 * @property mobList list of all mobs on board
 * @property itemList list of all items on board
 */
function Game (board = []) {
  this.board = board;

  /**
   * Fills board with mobs with definied type
   * @param {string} type type of mob (types: snake, dragon, player)
   * @param {number} count how many mobs you want to set
   *
   * If you leave the type empty, this method will fill with
   * random MONSTERS!
   * @returns {boolean} false on error
   **/
  this.fillWithMobs = function (type, count) {

  }
}
