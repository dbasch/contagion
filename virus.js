document.addEventListener("DOMContentLoaded", function(){
    init();
});

var people = [];
var tick = 0;
var rows = 50
var numPeople = 40;
var canvas;
var context;
var sickCount = 1;
var slider;
var contagionRate;
var duration = 200;
var started = false;
var paused = false;

let board = Array(rows).fill().map(() => Array(rows).fill(0));


function rand(n) {
    return Math.floor(Math.random() * n);
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}


function init(){
    var bw = 10 * rows;
    var bh = 10 * rows;
    canvas = document.getElementById("grid");
    context = canvas.getContext("2d");
    slider = document.getElementById("rate");
    sliderOutput = document.getElementById("sliderOutput");
    slider.oninput = function() {
        contagionRate = this.value;
        document.getElementById("chances").innerHTML = "1 in " + this.value;
    }
    contagionRate = slider.value;
    for (var x = 0; x <= bw; x += 10) {
        context.moveTo(x, 0);
        context.lineTo(x, bh);
    }

    for (var x = 0; x <= bh; x += 10) {
        context.moveTo(0, x);
        context.lineTo(bw, x);
    }
    context.strokeStyle = "black";
    context.stroke();
}

function renderPerson(p) {
    context.fillStyle = p.sick ? "#FF0000" : "#00FF00";
    context.fillRect(p.x * 10 + 1, p.y * 10 + 1, 8, 8);

}

function clear(x, y) {
    context.fillStyle = "#FFFFFF";
    context.fillRect(p.x * 10 + 1, p.y * 10 + 1, 8, 8);
    board[x][y] = 0;
}

function possibleContagion(x, y) {
    s = board[x][y];
    if (s == 1) {
        console.log("possible contagion!");
        contagion = rand(contagionRate) == 0 ? 1 : 0; 
        return(contagion);
    }
}

function start() {
    if (!started) {
        started = true;
        sicknessRate = 2;
        for (i = 0; i < numPeople; i++) {
            isSick = 0;
            if (i == 0) isSick = 1;
            people.push({x:rand(rows), y:rand(rows), xvel: 1 - rand(3), yvel: 1 - rand(3), sick: isSick, sickDate: 0});
            p = people[i];
            board[p.x][p.y] = p;
        } 
        loop();
    }
    else paused = !paused;
}

function loop() {
    if (!paused) {
        for(i = 0; i < numPeople; i++) {
            p = people[i];
            //move person
            newx = (p.x + p.xvel) % rows;
            newy = (p.y + p.yvel) % rows;
            if (newx < 0) newx = rows - 1;
            if (newy < 0) newy = rows - 1;
            dose = possibleContagion(newx, newy);
            if (dose) {
                if (!p.sick) sickCount++;
                p.sick = 1;
                p.sickDate = tick;
            } else {
                if (tick - p.sickDate > duration) {
                    if (p.sick == 1) sickCount--;
                    p.sick = 0;
                }
            }
            clear(p.x, p.y);
            p.x = newx;
            p.y = newy;
            renderPerson(p);
            board[p.x][p.y] = p.sick;
            if (rand(20) == 0) {
                p.xvel = 1 - rand(3);
                p.yvel = 1 - rand(3);
            }
        }
        tick++;
        document.getElementById("ticks").innerHTML = tick;
        document.getElementById("sick").innerHTML = sickCount;
    }
    sleep(60).then(() => {
        loop();
    });
}

