/**
 * Created by rbs on 29.12.2015.
 */

function startReload(){
    $(".reload .bar").animate({width: 0});
    $(".reload .bar").animate({width: "100%"}, 60 * 5 * 1000, function () {
        $("#cam").attr("src", "cam.jpg?" + Date.now());
        $("#waveform").attr("src", "wav.png?" + Date.now());
        startReload();
    });
}

function secondsToTimeString(allsecs) {
    mins = Math.floor(allsecs / 60);
    secs = allsecs % 60;

    //add leading zeros:
    mins = zeroPad(mins, 2);
    secs = zeroPad(secs, 2);
    return mins + ":" + secs;
}

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

$( document ).ready(function() {
    startReload();

    var audio = new Audio('new.mp3');
    var audio_bar = $(".audio_area .played");

    //calc audio duration:
    console.log(audio.duration);

    $(".time_selector .elem").click(function(){
        $(".time_selector .elem").removeClass("active");
        $(this).addClass("active");
        var time = $(".time_selector .elem.active").eq(0).attr("time");
        if(time != 0) {
            $(".reload .bar").stop();
            $("#cam").attr("src", "old_" + time + ".jpg");
            $("#waveform").attr("src", "old_wav_" + time + ".png");
            audio.pause();
            audio = new Audio("old_" + time + ".mp3");
        } else {
            $("#cam").attr("src", "cam.jpg?" + Date.now());
            $("#waveform").attr("src", "wav.png?" + Date.now());
            audio = new Audio('new.mp3');
            startReload();
        }
    });

    $(".audio_area").click(function(event) {

        var audio_length_string = secondsToTimeString(Math.ceil(audio.duration));

        var counter = 0;
        var timerInterval = setInterval(function () {
            counter = Math.ceil(audio.currentTime);
            $("#play_time").text(secondsToTimeString(counter) + " / " + audio_length_string);
            if(counter >= Math.ceil(audio.duration)) {
                clearInterval(timerInterval);
                $("#play_button").removeClass("paused");
            }
        }, 1000);

        if(event.target == $("#play_button")[0]) {
            if(audio.paused) {
                if(audio.currentTime == audio.duration) {
                    audio_bar.width(0);
                    $("#play_time").text("00:00 / " + audio_length_string);
                }
                audio.play();
                audio_bar.stop().animate({width: "100%"}, (audio.duration - audio.currentTime) * 1000, 'linear');
                $("#play_button").addClass("paused");
            } else {
                audio.pause();
                audio_bar.stop();
                $("#play_button").removeClass("paused");
            }
        } else {
            audio.play();
            $("#play_button").addClass("paused");
            audio.currentTime = audio.duration * (event.pageX / $(".audio_area").width());
            console.log(audio.currentTime);
            $("#play_time").text(secondsToTimeString(audio.currentTime) + " / " + audio_length_string);
            counter = Math.ceil(audio.currentTime);
            audio_bar.width(event.pageX);
            audio_bar.stop().animate({width: "100%"}, (audio.duration - audio.currentTime) * 1000, 'linear');
        }
    });

    //load usage
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var used = xhttp.responseText;
            var total = 5000* 1024 * 1024;
            if(used < total) {
                $(".data_usage .bar").width((used / total) * 100 + "%");
                $(".data_usage .bar").removeClass("overuse");
            } else {
                $(".data_usage .bar").width("100%");
                $(".data_usage .bar").addClass("overuse");
            }
            $(".data_usage .text").text(Math.round(used/1024/1024) + "/" +  Math.round(total/1024/1024) + " MB")

        }
    };
    xhttp.open("GET", "use.html", true);
    xhttp.send();
});
