// Remove from array.
function removeFromArray(arr, elt) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

// calac the heurristic function.
function heurristic(a, b) {
  var d = dist(a.i, a.j, b.i, b.j);
  //var d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}
var cols = 25;
var rows = 25;

var grrid = new Array(cols);

var OpenSet = [];
var ClosedSet = [];
var start;
var end;
var w, h;
var path = [];

function Spot(i, j) {
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.i = i;
  this.j = j;
  this.wall = false;

  // make a random walls.
  if (random(1) < 0.4) {
    this.wall = true;
  }
  this.previous = undefined;
  this.neighbors = [];
  this.show = function(col) {
    fill(col);
    if (this.wall) {
      fill(0);
    }
    noStroke();
    rect(this.i * w, this.j * h, w - 1, h - 1);
  };

  // search for new Neighbor.
  this.addNeighbors = function(grrid) {
    var i = this.i;
    var j = this.j;
    if (i < cols - 1) {
      this.neighbors.push(grrid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grrid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grrid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grrid[i][j - 1]);
    }
    if (i > 0 && j > 0) {
      this.neighbors.push(grrid[i - 1][j - 1]);
    }
    if (i < cols - 1 && j > 0) {
      this.neighbors.push(grrid[i + 1][j - 1]);
    }
    if (i > 0 && j < rows - 1) {
      this.neighbors.push(grrid[i - 1][j + 1]);
    }
    if (i < cols - 1 && j < rows - 1) {
      this.neighbors.push(grrid[i + 1][j + 1]);
    }
  };
}

// setup the environment.
function setup() {
  createCanvas(400, 400);
  for (var i = 0; i < cols; i++) {
    grrid[i] = new Array(rows);
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grrid[i][j] = new Spot(i, j);
    }
  }
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grrid[i][j].addNeighbors(grrid);
    }
  }
  w = width / cols;
  h = height / rows;
  start = grrid[0][0];
  end = grrid[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;

  OpenSet.push(start);
  console.log(grrid);
}

function draw() {
  if (OpenSet.length > 0) {
    var winner = 0;
    for (var i = 0; i < OpenSet.length; i++) {
      if (OpenSet[i].f < OpenSet[winner].f) {
        winner = i;
      }
    }
    var current = OpenSet[winner];
    if (current == end) {
      noLoop();
      console.log("DONE");
    }

    removeFromArray(OpenSet, current);
    ClosedSet.push(current);
    // choose the best.
    var neighbors = current.neighbors;
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];
      if (!ClosedSet.includes(neighbor) && !neighbor.wall) {
        var newPath = false;
        var tempG = current.g + 1;
        if (OpenSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          OpenSet.push(neighbor);
        }
        if (newPath) {
          neighbor.h = heurristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }
  } else {
    noLoop();
    return;
  }
  background(220);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grrid[i][j].show(color(255));
    }
  }

  for (var i = 0; i < ClosedSet.length; i++) {
    ClosedSet[i].show(color(255, 0, 0));
  }

  for (var i = 0; i < OpenSet.length; i++) {
    OpenSet[i].show(color(0, 255, 0));
  }

  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  for (var i = 0; i < path.length; i++) {
    path[i].show(color(0, 0, 255));
  }
}
