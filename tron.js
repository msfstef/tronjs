'use strict'

var canvas = document.getElementById('canvasHB');
var ctx = canvas.getContext('2d');

// Controls are up, down, left, right.
var p1_ctrls = new Array(87,83,65,68);
var p2_ctrls = new Array(38,40,37,39);
var spf = 0.03; // Seconds per frame.


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

Grid.prototype.cover = function(i,j, color) {
	this.grid[i][j] = 1;
	ctx.beginPath();
	ctx.rect(i*this.step,
			j*this.step,
			this.step,
			this.step);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

Grid.prototype.player = function(i,j, color) {
	this.grid[i][j] = 2;
	ctx.beginPath();
	ctx.rect(i*this.step,
			j*this.step,
			this.step,
			this.step);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

Grid.prototype.check_coll = function(i,j) {
	if (i >= this.no_hor ||
		i < 0 ||
		j >= this.no_ver ||
		j < 0 ||
		this.grid[i][j] === 1 ||
		this.grid[i][j] === 2) {
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
		if (!p.lost){
		if (this.check_coll(p.pos[0],p.pos[1])){
			console.log(p.p_no)
			p.lost = true
			loser_no += 1
		} else {
			this.cover(p.last_pos[0],p.last_pos[1],
						p.trail_color)
			this.player(p.pos[0],p.pos[1], 
						p.head_color)
		}
		}
	}
	if (loser_no >= players.length - 1) {
		game = false;
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
	// Direction up, right, down, left: 0,1,2,3.
	this.dir = (p_no*2 + 1)%5 
	this.lost = false
	if (p_no == 0){
		this.head_color = 'red'
		this.trail_color = 'black'
	} else if (p_no == 1){
		this.head_color = 'blue'
		this.trail_color = 'black'
	} else if (p_no == 2){
		this.head_color = 'green'
		this.trail_color = 'black'
	} else if (p_no == 3){
		this.head_color = 'purple'
		this.trail_color = 'black'
	}

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



var drawScore = function () {
	if (loser_no == players.length) {
		var text = 'Draw!'
	} else {
		for (var i=0; i < players.length; i++) {
			var p = players[i]
			if (!p.lost) {
				var text = 'Player ' + (p.p_no + 1) + ' wins!';
			}
		}
	}
	ctx.font = "90px Comic Sans MS";
	ctx.fillStyle = "grey";
	ctx.textAlign = "center";
	ctx.fillText(text, canvas.width/2, canvas.height/4);
}



var keyDown = function(e,p) {
	if(e.keyCode == p.ctrls[0]) {
        p.upPress = true;
        p.downPress = false;
        p.leftPress = false;
        p.rightPress = false;
    }
    else if(e.keyCode == p.ctrls[1]) {
        p.downPress = true;
        p.upPress = false;
        p.leftPress = false;
        p.rightPress = false;
    } 
    else if(e.keyCode == p.ctrls[2]) {
        p.leftPress = true;
        p.downPress = false;
        p.upPress = false;
        p.rightPress = false;
    }
    else if(e.keyCode == p.ctrls[3]) {
        p.rightPress = true;
        p.downPress = false;
        p.upPress = false;
        p.leftPress = false;
    }
    if(e.keyCode == 32 && game == false) {
    	restart_game()
    }
}


var game = true
var loser_no = 0
var step = 10
var game_grid = new Grid(step)
game_grid.draw();
var p1 = new Player(parseInt(canvas.width*0.25/step),
					parseInt(canvas.height*0.5/step),
					p1_ctrls, 0);
var p2 = new Player(parseInt(canvas.width*0.75/step)+1,
					parseInt(canvas.height*0.5/step),
					p2_ctrls, 1);
var players = new Array(p1,p2);


var restart_game = function() {
	game = true
	loser_no = 0
	step = 10
	game_grid = new Grid(step)
	game_grid.draw();
	p1 = new Player(parseInt(canvas.width*0.25/step),
					parseInt(canvas.height*0.5/step),
					p1_ctrls, 0);
	p2 = new Player(parseInt(canvas.width*0.75/step)+1,
					parseInt(canvas.height*0.5/step),
					p2_ctrls, 1);
	players = new Array(p1,p2);

}


document.addEventListener("keydown", function(e){keyDown(e,p1);}, false);

document.addEventListener("keydown", function(e){keyDown(e,p2);}, false);

var update = function(){
	for (var i=0; i<players.length; i++) {
		if (!players[i].lost){
			players[i].update();
		}
	}
	game_grid.update(players);
}

//setInterval(update,spf*1000);
function repeat() {
  	if (game) {
  		update()
	} else {
		drawScore()
	}
	setTimeout(function(){
  	requestAnimationFrame(repeat);
  	}, spf*1000);
}
repeat();