function getKeyAndMove(e){
				var key_code=e.which||e.keyCode;
				switch(key_code){
					case 37: //left arrow key
						moveLeft();
						break;
					case 38: //Up arrow key
						moveUp();
						break;
					case 39: //right arrow key
						moveRight();
						break;
					case 40: //down arrow key
						moveDown();
						break;
				}
}
function moveLeft(){
		;
}
function moveUp(){
		;
}
function moveRight(){
		;
}
function moveDown(){
		;
}

getKeyAndMove(e);

function Weapon(id, type, damage){
  this.id = id;
  this.type = type;
  this.damage = (this.type === "axe" ? +20 : (this.type === "deager" ? +1 : dmg));
}

function Potion(id, type, effect){
  this.id = id;
  this.type = type;
  this.effect = (this.type === "poison" ? -5 : (this.type === "heal" ? +5 : HP));
}
