var dingSound;
var wrongSound;
var goSound;
var endSound;
var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        dingSound = new Media("wav/ding.wav");
        wrongSound = new Media("wav/wrong.wav");
        goSound = new Media("wav/go.wav");
        endSound = new Media("wav/end.wav");
    }
};

app.initialize();

var counter1;
var counter2;
var startedAt;
var finished;
var timerLength = 35000;
var timerHandle;
function reset() {
    counter1 = 0;
    counter2 = 0;
    startedAt = undefined;
    finished = false;
}
reset();

var counter1ValueElement = $("#counter1Value");
var counter2ValueElement = $("#counter2Value");
var timeElement = $("#time");
function updateDisplay() {
    counter1ValueElement.html("" + counter1);
    counter2ValueElement.html("" + counter2);
    if (startedAt === undefined)
        timeElement.html("00:000");
    else {
        var now = new Date();
        var delta = now.getTime() - startedAt.getTime();
        if (delta > timerLength) {
            delta = timerLength;
            finished = true;
        }
        var seconds = Math.floor(delta / 1000)
        var millis = ("00" + (delta % 1000));
        millis = millis.substr(millis.length - 3);
        timeElement.html("" + seconds + ":" + millis);
    }
}

function start() {
    startedAt = new Date();
    updateDisplay();
    armTimer();
    goSound.stop();
    goSound.seekTo(0);
    goSound.play();
}
function armTimer() {
    timerHandle = setTimeout(function() {
        updateDisplay();
        if (finished) {
            endSound.stop();
            endSound.seekTo(0);
            endSound.play();
            return;
        }
        armTimer();
    }, 1000 / 60);
}

$("#counter1Button").click(function() {
    if (finished)
        return;
    if (startedAt === undefined)
        start();
    else {
        counter1 += 1;
        updateDisplay();
        wrongSound.stop();
        wrongSound.seekTo(0);
        wrongSound.play();
    }
});
$("#counter2Button").click(function() {
    if (finished)
        return;
    if (startedAt === undefined)
        start();
    else {
        counter2 += 1;
        updateDisplay();
        dingSound.stop();
        dingSound.seekTo(0);
        dingSound.play();
    }
});
$("#counter1Button").mousedown(function() { $(this).addClass("pressed"); });
$("#counter1Button").mouseup(function() { $(this).removeClass("pressed"); });
$("#counter2Button").mousedown(function() { $(this).addClass("pressed"); });
$("#counter2Button").mouseup(function() { $(this).removeClass("pressed"); });

$("#resetButton").click(function() {
    clearTimeout(timerHandle);
    reset();
    updateDisplay();
});
