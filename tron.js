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


var Grid = function(step_size, players){
	this.step = step_size
	this.height = canvas.height;
	this.width = canvas.width;
	this.no_ver = parseInt(this.height/step_size);
	this.no_hor = parseInt(this.width/step_size);
	this.grid = createArray(this.no_hor, this.no_ver);

	this.players = players;
}

Grid.prototype.cover = function(i,j) {
	this.grid[i][j] = 1;
}

Grid.prototype.player = function(i,j) {
	this.grid[i][j] = 2;
}

Grid.prototype.check_coll = function(i,j) {
	if (this.grid[i][j] === 1 ||
		this.grid[i][j] === 2) {
		return true
	} else {
		return false
	}
}

Grid.prototype.clean = function(i,j) {
	this.grid = createArray(this.no_hor, this.no_ver);
}



var Player = function(i,j,ctrls,p_no) {
	this.pos = [i,j]
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
		if (this.dir != i) {
			if dir_list[i] {
				this.dir = i;
			}
		}
	}

	this.pos[0] += (this.dir - 1)%2
	this.pos[1] += (2 - this.dir)%2
}
