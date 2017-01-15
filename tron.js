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