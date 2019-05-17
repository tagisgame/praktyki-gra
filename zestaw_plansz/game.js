const fs = require('fs');

// <editor-fold desc="Objects">
var board = [];
board.readFromFile = function (file) {
  this = fs.readFileSync('zestaw_plansz/board' + '01' + '.txt', 'utf8').split("\n").map(_ => _.split("").map(_ => _ === '#' ? 1 : 0));
};
// </editor-fold>

console.log(board);
