var mediaSounds = {};
var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        if( window.plugins && window.plugins.NativeAudio ) {
            console.info("Native audio");
            window.plugins.NativeAudio.preloadSimple('ding', 'wav/ding.wav', function(msg){
            }, function(msg){
                console.log( 'error: ' + msg );
            });
            window.plugins.NativeAudio.preloadSimple('wrong', 'wav/wrong.wav', function(msg){
            }, function(msg){
                console.log( 'error: ' + msg );
            });
            window.plugins.NativeAudio.preloadSimple('go', 'wav/go.wav', function(msg){
            }, function(msg){
                console.log( 'error: ' + msg );
            });
            window.plugins.NativeAudio.preloadSimple('end', 'wav/end.wav', function(msg){
            }, function(msg){
                console.log( 'error: ' + msg );
            });
        } else {
            console.info("Media audio");
            mediaSounds['ding'] = new Media("wav/ding.wav");
            mediaSounds['wrong'] = new Media("wav/wrong.wav");
            mediaSounds['go'] = new Media("wav/go.wav");
            mediaSounds['end'] = new Media("wav/end.wav");
        }
    }
};

app.initialize();

function playAudio(name) {
    if( window.plugins && window.plugins.NativeAudio ) {
        window.plugins.NativeAudio.stop(name);
        window.plugins.NativeAudio.play(name);
    } else {
        mediaSounds[name].stop();
        mediaSounds[name].seekTo(0);
        mediaSounds[name].play();
    }
}

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
    playAudio('go');
}
function armTimer() {
    timerHandle = setTimeout(function() {
        updateDisplay();
        if (finished) {
            playAudio('end');
            return;
        }
        armTimer();
    }, 1000 / 60);
}

function counter1Clicked() {
    $(this).addClass("pressed");
    if (finished)
        return;
    if (startedAt === undefined)
        start();
    else {
        counter1 += 1;
        updateDisplay();
        playAudio('wrong');
    }
}
function counter2Clicked() {
    $(this).addClass("pressed");
    if (finished)
        return;
    if (startedAt === undefined)
        start();
    else {
        counter2 += 1;
        updateDisplay();
        playAudio('ding');
    }
}
$("#counter1Button").mouseup(function() { $(this).removeClass("pressed"); });
$("#counter1Button").mousedown(counter1Clicked);
$("#counter2Button").mouseup(function() { $(this).removeClass("pressed"); });
$("#counter2Button").mousedown(counter2Clicked);

$("#resetButton").click(function() {
    clearTimeout(timerHandle);
    reset();
    updateDisplay();
});

$("#menu").addClass("hidden");
$("#menuButton").click(function() {
    $("#app").addClass("hidden");
    $("#menu").removeClass("hidden");
});
$("#closeMenuButton").click(function() {
    $("#app").removeClass("hidden");
    $("#menu").addClass("hidden");
});
$("#seconds35").addClass("selected");
$("#seconds35").click(function() { $(".seconds").removeClass("selected"); $(this).addClass("selected"); timerLength = 35000; });
$("#seconds40").click(function() { $(".seconds").removeClass("selected"); $(this).addClass("selected"); timerLength = 40000; });
$("#seconds45").click(function() { $(".seconds").removeClass("selected"); $(this).addClass("selected"); timerLength = 45000; });
$("#seconds50").click(function() { $(".seconds").removeClass("selected"); $(this).addClass("selected"); timerLength = 50000; });
$("#seconds55").click(function() { $(".seconds").removeClass("selected"); $(this).addClass("selected"); timerLength = 55000; });
