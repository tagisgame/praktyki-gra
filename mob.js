module.exports.Mob = function (id, x, y, type = "player", hp = 10, ap = 1) {
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
       this.attack(game.board[this.x + offsetX][this.y + offsetY].mob);
     } else if (this.type === "player" && game.board[this.x + offsetX][this.y + offsetY].item !== null) {
       this.equip(game.board[this.x + offsetX][this.y + offsetY].item);
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
   // Szukaj gracza na liście

   let playerX = 0;
   let playerY = 0;

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
   if (this.y > playerY) return this.move(game, "d");
 }

 /**
  * Attacks mob with specified ID
  * @param {Object} game main object, board on which the target is
  * @param {number} targetId ID of attacked mob
  *
  * @return {bool} true if target is killed
  **/
 this.attack = function (game, targetId) {
   let target = {};
   /** Searching for target in game.mobList */
   for (let i = 0; i < game.mobList.length; i++) {
     if (game.mobList[i].id === targetId) {
       game.mobList[i].hp -= this.ap;
       if (game.mobList[i].hp <= 0) {
         game.mobList[i].getKilled(game);
         return true;
       } else {
         return false;
       }
     }
   }
 }

 /**
  * Removes mob from game.mobList
  * @param {Object} game main object, board on which the target is
  **/
 this.getKilled = function (game) {
   /** Removing 'this' from cell */
   game.board[this.x][this.y].mob = null;
   /** Searching for 'this' in game.mobList */
   for (let i = 0; i < game.mobList.length; i++) {
     if (game.mobList[i].id === this.id) {
       game.mobList.splice(i,1);
     }
   }
 }
}
