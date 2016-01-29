var buttons = document.getElementsByTagName("button");

var details = document.getElementById("detail");
var canvasMain = document.getElementById("canvasMain");
var canvasTitle = document.getElementById("canvasTitle");
var ctx = canvasMain.getContext("2d");
var ctx2 = canvasTitle.getContext("2d");

var offset = 30;
var size = 50;
var line = 3
var fontSize = size / 1.5;
var fontOffset = offset / 3;

var count = line * line; // 9
var boxes = new Array(count);
var currentBox = 0;
var secret = parseInt(Math.random() * count) + 1;

canvasMain.width = offset * (line + 1) + size * line;
canvasMain.height = canvasMain.width;
canvasTitle.width = canvasMain.width;
canvasTitle.height = fontSize * 2 + fontOffset * 4;

var Rectangle = function (obj) {
	obj = obj || {};
	return {
		name: obj.name || "rectangle",
		colorLine: obj.colorLine || "gray",
		colorLineIsCurr: "black",
		colorFillNorm: obj.colorFill || "lightgray",
		colorFillIsCurr: "yellow",
		x0: obj.x || 0,
		y0: obj.y || 0,
		x1: obj.x || 0,
		y2: obj.y || 0,
		size: obj.size || 50,
		lineWidth: 3,
		isShaked: obj.isShaked || false,
		isCurrent: false,
		draw: function () {
			this.shake();
			ctx.strokeStyle = this.colorLine;
			ctx.fillStyle = this.colorFillNorm;
			ctx.lineWidth = this.lineWidth;
			if (this.isCurrent) {
				ctx.strokeStyle = this.colorLineIsCurr;
				ctx.lineWidth = this.lineWidth * 2;
			} 
			ctx.fillRect(this.x1, this.y1, this.size, this.size);
			ctx.strokeRect(this.x1, this.y1, this.size, this.size);
		},
		moveTo: function (x, y) {
			this.x0 = x;
			this.y0 = y;
		},
		shake: function () {
			if(this.isShaked) {
				this.x1 = this.x0 + (Math.random()-0.5) * this.size / 20;
				this.y1 = this.y0 + (Math.random()-0.5) * this.size / 20;
				ctx.shadowOffsetX = size * 0.5 * (Math.random()-0.5);
				ctx.shadowOffsetY = size * 0.5 * (Math.random()-0.5);
				ctx.shadowBlur = size * 0.25;
				ctx.shadowColor = "lightgray";
			} else {
				this.x1 = this.x0;
				this.y1 = this.y0;
				ctx.shadowOffsetX = 0;
				ctx.shadowOffsetY = 0;
			}	
		},
		checkCurr: function(mX, mY) {
			if(this.isShaked) {
				if (mX > this.x0 && mX < this.x0 + this.size && mY > this.y0 && mY < this.y0 + this.size) {
					this.isCurrent = true;
				} else {
					this.isCurrent = false;
				}
			}
		},
		checkSecret: function() {
			if (this.isShaked && this.isCurrent) {
				if (this.name == secret) {
					this.colorFillNorm = "lightgreen";
					stopAll();
				} else {
					this.colorFillNorm = "yellow";
				}
				this.isShaked = false;

			}
		},
	};
}

canvasMain.onmousemove = function(e) {
	e = e || event;
	var x = e.clientX - canvasMain.offsetLeft;
	var y = e.clientY - canvasMain.offsetTop;
	for (var i = 0; i < boxes.length; i++) {
		boxes[i].checkCurr(x, y);
	}
}
canvasMain.onclick = function(e) {
	e = e || event;
	for (var i = 0; i < boxes.length; i++) {
		boxes[i].checkSecret();
	}
}

function init() {
	for (var i = 0; i < count; i++) {
		boxes[i] = new Rectangle({
			name: i + 1,
			x: (i % line) * (offset + size) + offset,
			y: parseInt(i / line) * (offset + size) + offset,
			size: 50,
			isShaked: false,
		});
	}
	drawBoxes();
};

// draw boxes
function drawBoxes() {
	for (var i = 0; i < count; i++) {
		boxes[i].draw();
	}
}

// show time in title canvas
function drawTitle(isShaked) {
	isShaked = isShaked || false;
	ctx2.fillStyle = 'gray';
	ctx2.lineWidth = 3;
	ctx2.font = fontSize + "px" + " " + "sans-serif";
	var x = canvasTitle.width / 10;

	if(isShaked) {
		ctx2.shadowOffsetX = 7 * (Math.random()-0.5);
		ctx2.shadowOffsetY = 7 * (Math.random()-0.5);
		ctx2.shadowBlur = 5 * (Math.random()-0.5);
		ctx2.shadowColor = "lightgray";

		
		text = showTime();
		ctx2.fillText(text, 
			x + (Math.random()-0.5) * fontSize * 0.125 * 0.5, 
			fontOffset * 2 + fontSize * 2 + (Math.random()-0.5) * fontSize * 0.0625 + 2);

		// SHAKING
		var text = "SHAKING";
		ctx2.font = (fontSize * (Math.random() * 0.0625 + 1)) + "px" + " " + "sans-serif";
		ctx2.fillText(text, 
			x + (Math.random()-0.5) * fontSize * 0.125, 
			fontOffset + fontSize + (Math.random()-0.5) * fontSize * 0.0625 + 2);
	} else {
		// TIME
		text = showTime();
		ctx2.fillText(text, x, fontOffset * 2 + fontSize * 2);

		// SHAKING
		var text = "SHAKING";
		ctx2.fillText(text, x, fontOffset + fontSize);
	}
	
}

function update() {
	ctx.clearRect(0, 0, canvasMain.width, canvasMain.height);
	ctx2.clearRect(0, 0, canvasTitle.width, canvasTitle.height);
	for (var i = 0; i < count; i++) {
		if(boxes[i].isCurrent) {
			currentBox = boxes[i].name;
		}
	}
	drawBoxes();
	drawTitle(true);
	details.innerHTML = "Secret seed #" + secret + "<br>";
	details.innerHTML += "Current box #" + currentBox + "<br>";
	details.innerHTML += "Time: " + showTime(); 
}

// Shake all
function startAll() {
	window.clearInterval(intv);
	for (var i = 0; i < count; i++) {
		boxes[i].isShaked = true;
	}
}

// Stop all 
function stopAll() {
	for (var i = 0; i < boxes.length; i++) {
		boxes[i].isShaked = false;
	}
	window.clearInterval(intv);
	update();
}

// START
var intv;
var myDate = new Date();
var tic; 
buttons[0].onclick = function(e) {
	init();
	startAll();
	secret = parseInt(Math.random() * count) + 1;
	intv = self.setInterval(update, 100);
	tic = (new Date()).getTime();
};

function showTime() {
	var ss = "00:00.0";
	if (tic) {
		var s = (((new Date()).getTime() - tic) / 1000);
		var mnt = parseInt(s/60) % 100;
		var snd = (s % 60).toFixed(1);
		ss = mnt;
		if(mnt < 10) {
			ss = "0" + ss;
		}
		ss += ":";
		if(snd < 10) {
			ss += "0";
		}
		ss += snd;
	}
	return ss;	
}

init();




