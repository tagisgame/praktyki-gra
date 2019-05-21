const fs = require('fs');
const readlineSync = require('readline-sync');

// <editor-fold desc="Classes">
/**
 * Main class, containing board. list of any instances
 * and useful methods
 * @class
 *
 * @constructor
 *
 * @param {string} file path to board
 * @property {[]} board array used as board for game
 * @property {[]} mobList list of all mobs on board, first element is a list of IDs
 * @property {[]} itemList list of all items on board, first element is a list of IDs
 **/
function Game (board) {
  this.board = board;
  for (let x = 0; x < this.board.length; x++) {
    for (let y = 0; y < this.board[x].length; y++) {
      this.board[x][y] = this.board[x][y] === "." ? new Cell(x, y) : new Cell(x, y, true);
      //console.log(this.board[x][y]);
    }
  }

  this.mobList = [];
  this.mobList[0] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
  this.itemList = [];
  this.itemList[0] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];

  /**
   * Searches for all properties of mob with specified ID
   * Firts elemnent of returned Array is a mobList index of mob
   *
   * @param {number} targetId ID of mob, which needs to be found
   *
   * @returns {Array} array with properties, 1st element is index in mobList
   **/
  this.findMobAttribs = function (targetId) {
    let targetIndex = null;

    for (let i = 0; i < this.mobList.length; i++) {
      if (this.mobList[i].id !== targetId) continue;

      targetIndex = i;
      break;
    }

    let array = Object.values(this.mobList[targetIndex]);
    array.unshift(targetIndex);

    return array;
  }
  /**
   * Searches for all properties of item with specified ID
   * Firts elemnent of returned Array is a itemList index of item
   *
   * @param {number} targetId ID of item, which needs to be found
   *
   * @returns {Array} array with properties, 1st element is index in itemList
   **/
  this.findItemAttribs = function (targetId) {
    let targetIndex = null;

    for (let i = 0; i < this.itemList.length; i++) {
      if (this.itemList[i].id !== targetId) continue;

      targetIndex = i;
      break;
    }

    let array = Object.values(this.itemList[targetIndex]);
    array.unshift(targetIndex);
    return array;
  }
  /**
   * Fills board with mobs. If mob type not specified, fills with random mobs.
   *
   * @param {number} type number which defines type of mob (look at table of types)
   * @param {number} count number which defines how many mobs do you want
   *
   * @returns {Array} mobList array
   **/
  this.fillWithMobs = function (type = "random", count) {
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
      let id = this.mobList[0].shift();
      let hp = mob === "snake" ? 2 : (mob === "dragon" ? 25 : 10);
      this.mobList.push(new Mob(id, randX, randY, mob, hp));
      this.board[randX][randY].mob = id;

      count--;
    }
    return this.mobList;
  }
  /**
   * Fills board with items. If type or class not specified, fills with random items.
   *
   * @param {string} cls class of item (weapon/potion)
   * @param {string} type defines type of items
   * @param {number} count number which defines how many items you want
   *
   * @returns {Array} itemList array
   **/
  this.fillWithItems = function (cls = "random", type = "random", count) {
    let item = type;
    let cls_ = cls;
    while (count > 0) {
      let randX = Math.floor(Math.random() * (this.board.length - 1));
      let randY = Math.floor(Math.random() * (this.board[randX].length - 1));
      if(this.board[randX][randY].mob !== null || this.board[randX][randY].wall || this.board[randX][randY].item !== null) {
        continue;
      }
      if (item === "random") {
        if (cls_ === "random") {

          cls = Math.random() < 0.3 ? "weapon" : "potion";
        }
        type = Math.random() < 0.5 ? "1" : "2";
      }
      let id = this.itemList[0].shift();
      if (cls === "weapon") {
        this.itemList.push(new Weapon(id,randX,randY,(type === "1" ? "axe" : "dagger")));
      } else {
        this.itemList.push(new Potion(id,randX,randY,(type === "1" ? "heal" : "poison")));

      }
      this.board[randX][randY].item = id;

      count--;
    }
    return this.itemList;
  }
  /**
   * Puts player on board.
   *
   * @returns {Array} mobList array
   **/
  this.putPlayer = function () {
    while (true) {
      let randX = Math.floor(Math.random() * (this.board.length - 1));
      let randY = Math.floor(Math.random() * (this.board[randX].length - 1));
      if(this.board[randX][randY].mob !== null || this.board[randX][randY].wall) {
        continue;
      }
      let id = 0;
      let hp = 10;
      this.mobList.push(new Mob(id, randX, randY, "player", hp));
      this.board[randX][randY].mob = id;

      break;
    }
    return this.mobList;
  }
  /**
   *
   *
   **/
  this.removeDeadMobs = function () {
    for (let i = 1; i < this.mobList.length; i++) {
      if (this.mobList[i].alive) continue;
      this.mobList.splice(i,1);
    }
  }
  /**
   * Draws a board in console
   **/
  this.draw = function () {
    //console.log(this.mobList);
    for (let x = 0; x < this.board.length; x++) {
      let buf = "";
      for (let y = 0; y < this.board[x].length; y++) {
        if(this.board[x][y].wall) {
          buf += "#";
        } else if (this.board[x][y].mob !== null) {
          let type = this.findMobAttribs(this.board[x][y].mob)[4];
          if (type === "snake") {
            buf += "S";
          } else if (type === "dragon") {
            buf += "D";
          } else {
            buf += "@";
          }
        } else if (this.board[x][y].item !== null) {
          let type = this.findItemAttribs(this.board[x][y].item)[4];
          if (type === "axe") {
            buf += "a";
          } else if (type === "dagger") {
            buf += "d";
          } else if (type === "heal") {
            buf += "h";
          } else {
            buf += "p";
          }
        } else {
          buf += ".";
        }
      }
      console.log(buf);
    }
    console.log("Player HP: ", this.findMobAttribs(0)[5]);
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
 * @property {number} [dmg] mob's attack points (damage)
 *
 **/
function Mob (id, x, y, type = "player", hp = 10, dmg = 1) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.type = type;
  this.hp = (this.type === "snake" ? 2 : (this.type === "dragon" ? 25 : hp));
  this.dmg = (this.type === "snake" ? 1 : (this.type === "dragon" ? 4 : dmg));
  this.alive = true;

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
      if (this.x + offsetX < 0 || this.x + offsetX > game.board.length - 1) {
        //console.log(this.id, "(" + this.x + ", " + this.y + ")", dir, "Błąd na X:", this.x + offsetX);
        return false;
      }
      if (this.y + offsetY < 0 || this.y + offsetY > game.board[this.x].length - 1) {
        //console.log(this.id, "(" + this.x + ", " + this.y + ")", dir, "Błąd na Y:", this.y + offsetY);
        return false;
      }
      if (game.board[this.x + offsetX][this.y + offsetY].wall) {
        //console.log(this.id, "(" + this.x + ", " + this.y + ")", dir, "Ściana:", this.x + offsetX, this.y + offsetY);
        return false;
      }
      if (game.board[this.x + offsetX][this.y + offsetY].mob !== null) {
        //console.log(this.id, "(" + this.x + ", " + this.y + ")", dir, "Mob:", this.x + offsetX, this.y + offsetY);
        if (!(this.attack(game, game.board[this.x + offsetX][this.y + offsetY].mob))) {
          return false;
        }
      } else if (this.type === "player" && game.board[this.x + offsetX][this.y + offsetY].item !== null) {
        this.equip(game, game.board[this.x + offsetX][this.y + offsetY].item);
      }
      //console.log(this.id, "(" + this.x + ", " + this.y + ")", dir, "Jest git:", this.x + offsetX, this.y + offsetY);
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
    }
  }

  /**
   * Moves a MONSTER in player's direction
   * (very simple 'AI')
   * @param {Object} game main object, board on which the mob is
   *
   * @return {bool} false if mob cannot be moved (eg. because of wall)
   **/
  this.moveToPlayer = function (game) {
    let playerX = game.findMobAttribs(0)[2];
    let playerY = game.findMobAttribs(0)[3];

    if (this.x > playerX) {
      /** player is on left-up */
      if (this.y > playerY) {
        let randomDir = Math.random() < 0.5 ? "l" : "u";
        return this.move(game, randomDir);
      }
      /** player is on left-down */
      if (this.y < playerY) {
        let randomDir = Math.random() < 0.5 ? "l" : "d";
        return this.move(game, randomDir);
      }
      /** player is on left*/
      return this.move(game, "l");
    }
    if (this.x < playerX) {
      /** player is on right-up */
      if (this.y > playerY) {
        let randomDir = Math.random() < 0.5 ? "r" : "u";
        return this.move(game, randomDir);
      }
      /** player is on right-down */
      if (this.y < playerY) {
        let randomDir = Math.random() < 0.5 ? "r" : "d";
        return this.move(game, randomDir);
      }
      /** player is on right*/
      return this.move(game, "r");
    }
    /** player is on up */
    if (this.y > playerY) return this.move(game, "u");
    /** player is on down */
    if (this.y < playerY) return this.move(game, "d");
  }

  /**
   * Attacks mob with specified ID
   * @param {Object} game main object, board on which the target is
   * @param {number} targetId ID of attacked mob
   *
   * @return {bool} true if target is killed
   **/
  this.attack = function (game, targetId) {
    return game.mobList[game.findMobAttribs(targetId)[0]].getDamage(game, this.dmg);

  }
  this.equip = function (game, targetId) {
    return game.itemList[game.findItemAttribs(targetId)[0]].getEquipped(game, this.id);

  }
  /**
   * Changes hp of mob when is attacked and checking for death
   *
   * @param {number} amount amount of dmg dealt
   *
   * @returns {bool} true if killed
   **/
  this.getDamage = function (game, amount) {
    if (this.hp - amount <= 0) {
      console.log(this.type, "Otrzymane obrażenia: ", amount, "HP: ", this.hp)
      game.board[this.x][this.y].mob = null;
      game.mobList[0].unshift(this.id);
      this.alive = false;
      return true;
    } else {
      this.hp = this.hp - amount;
      console.log(this.type, "Otrzymane obrażenia: ", amount, "HP: ", this.hp)
      return false;
    }
  }
 }
/**
 *
 *
 **/
 function Weapon(id, x, y, type = "axe", dmg = 2){
   this.id = id;
   this.x = x;
   this.y = y;
   this.type = type;
   this.dmg = (this.type === "axe" ? 20 : (this.type === "dagger" ? 2 : dmg));
   this.alive = true;
   this.getEquipped = function (game, playerId) {
     game.mobList[game.findMobAttribs(playerId)[0]].dmg = this.dmg;
     game.board[this.x][this.y].item = null;
     game.itemList[0].unshift(this.id);
     this.alive = false;
   }
 }

 function Potion(id, x, y, type = "heal", effect){
   this.id = id;
   this.x = x;
   this.y = y;
   this.type = type;
   this.effect = (this.type === "poison" ? -5 : (this.type === "heal" ? 5 : effect));
   this.alive = true;
   this.getEquipped = function (game, playerId) {
     game.mobList[game.findMobAttribs(playerId)[0]].hp += this.effect;
     game.board[this.x][this.y].item = null;
     game.itemList[0].unshift(this.id);
     this.alive = false;
   }
 }
// </editor-fold>

// <editor-fold desc="Game loop">
let randBoard = 1;
let game = new Game(fs.readFileSync('zestaw_plansz/board' + randBoard + '.txt', 'utf8').split("\n").map(_ => _.split("")));
game.putPlayer();
game.fillWithMobs("random",5);
game.fillWithItems("random", "random",10);

while(game.mobList[game.findMobAttribs(0)[0]].alive) {
  game.removeDeadMobs();
//for (let j = 0; j < 5; j++) {
  game.draw();
  let getKeyAndMove = function getKeyAndMove(){
  	var code = readlineSync.question("Jak chcesz się poruszyć?: ").toLowerCase();
  	switch(code){
  		case "left": //left arrow key
  			game.mobList[game.findMobAttribs(0)[0]].move(game, "l");
  			break;
  		case "up": //Up arrow key
  			game.mobList[game.findMobAttribs(0)[0]].move(game, "u");
  			break;
			case "right": //right arrow key
				game.mobList[game.findMobAttribs(0)[0]].move(game, "r");
				break;
  		case "down": //down arrow key
  			game.mobList[game.findMobAttribs(0)[0]].move(game, "d");
  			break;
  	}
  }
  getKeyAndMove();

  for (let i = 1; i < game.mobList.length; i++) {
    if (game.mobList[i].type !== "player") game.mobList[i].moveToPlayer(game);
  }
}
console.log("Niestety jesteś gupi i zdechłeś kmiocie!");
// </editor-fold>
