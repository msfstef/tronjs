'use strict'

var canvas = document.getElementById('canvasHB');
var ctx = canvas.getContext('2d');

// Controls are up, down, left, right.
var p1_ctrls = new Array(87,83,65,68);
var p2_ctrls = new Array(38,40,37,39);
var spf = 0.3; // Seconds per frame.


// Credits to: http://tinyurl.com/zptaaed
function createArray(length) {
    var arr = Array.apply(null, Array(length)).map(Number.prototype.valueOf,0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}


var Grid = function(step_size){
	this.step = step_size
	this.height = canvas.height;
	this.width = canvas.width;
	this.no_ver = parseInt(this.height/step_size);
	this.no_hor = parseInt(this.width/step_size);
	this.grid = createArray(this.no_hor, this.no_ver);
}

Grid.prototype.cover = function(i,j) {
	this.grid[i][j] = 1;
	ctx.beginPath();
	ctx.rect(i*this.step,
			j*this.step,
			this.step,
			this.step);
	ctx.fillStyle = '#000000';
	ctx.fill();
	ctx.closePath();
}

Grid.prototype.player = function(i,j) {
	this.grid[i][j] = 2;
	ctx.beginPath();
	ctx.rect(i*this.step,
			j*this.step,
			this.step,
			this.step);
	ctx.fillStyle = '#ff0000';
	ctx.fill();
	ctx.closePath();
}

Grid.prototype.check_coll = function(i,j) {
	if (this.grid[i][j] === 1 ||
		this.grid[i][j] === 2 ||
		i >= this.no_hor ||
		i < 0 ||
		j >= this.no_ver ||
		j < 0) {
		return true
	} else {
		return false
	}
}

Grid.prototype.clean = function(i,j) {
	this.grid = createArray(this.no_hor, this.no_ver);
}


Grid.prototype.update = function(players) {
	for (var i=0; i < players.length; i++) {
		var p = players[i]
		if (this.check_coll(p.pos[0],p.pos[1])){
			game = false;
			loser = i;
			loser_no += 1
		} else {
			this.cover(p.last_pos[0],p.last_pos[1])
			this.player(p.pos[0],p.pos[1])
		}
	}
}

Grid.prototype.draw = function(players) {
	for (var i=0; i < this.no_hor; i++) {
		for (var j=0; j < this.no_ver; j++) {
			ctx.beginPath();
			ctx.fillStyle = '#ffffff';
			ctx.rect(i*this.step,
					j*this.step,
					this.step,
					this.step);
			ctx.fill();
			ctx.closePath();
		}
	}
	
}



var Player = function(i,j,ctrls,p_no) {
	this.pos = [i,j]
	this.last_pos = [i,j]
	this.p_no = p_no
	this.ctrls = ctrls
	this.dir = p_no*2 + 1 // Direction up, right, down, left: 0,1,2,3.
	this.upPress = false;
	this.downPress = false;
	this.leftPress = false;
	this.rightPress = false;
}

Player.prototype.update = function() {
	var dir_list = [this.upPress,this.rightPress,
					this.downPress,this.leftPress]
	for (var i=0; i < dir_list.length; i++) {
		if (this.dir != i &&
			this.dir != (i+2)%4) {
			if (dir_list[i]) {
				this.dir = i;
			}
		}
	}
	this.last_pos = JSON.parse(JSON.stringify(this.pos))
	this.pos[1] += (this.dir - 1)%2
	this.pos[0] += (2 - this.dir)%2
}


var keyDown = function(e,p) {
	if(e.keyCode == p.ctrls[0]) {
        p.upPress = true;
    }
    else if(e.keyCode == p.ctrls[1]) {
        p.downPress = true;
    } 
    else if(e.keyCode == p.ctrls[2]) {
        p.leftPress = true;
    }
    else if(e.keyCode == p.ctrls[3]) {
        p.rightPress = true;
    }
}

var keyUp = function(e,p) {
	if(e.keyCode == p.ctrls[0]) {
        p.upPress = false;
    }
    else if(e.keyCode == p.ctrls[1]) {
        p.downPress = false;
    } 
    else if(e.keyCode == p.ctrls[2]) {
        p.leftPress = false;
    }
    else if(e.keyCode == p.ctrls[3]) {
        p.rightPress = false;
    }
}

var game = true
var loser = ''
var loser_no = 0
var step = 10
var game_grid = new Grid(step)
game_grid.draw();
var p1 = new Player(parseInt(canvas.width*0.25/step),
					parseInt(canvas.height*0.5/step),
					p1_ctrls, 0);
var p2 = new Player(parseInt(canvas.width*0.75/step),
					parseInt(canvas.height*0.5/step),
					p2_ctrls, 1);
var players = new Array(p1,p2);


document.addEventListener("keydown", function(e){keyDown(e,p1);}, false);
document.addEventListener("keyup", function(e){keyUp(e,p1);}, false);

document.addEventListener("keydown", function(e){keyDown(e,p2);}, false);
document.addEventListener("keyup", function(e){keyUp(e,p2);}, false);

var update = function(){
	for (var i=0; i<players.length; i++) {
		players[i].update();
		console.log(players[i].pos[0])
	}
	game_grid.update(players);
}

//setInterval(update,spf*1000);
function repeat() {
  	if (game) {
  		update()
	}
  	requestAnimationFrame(repeat);
}
repeat();