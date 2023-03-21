const colorThief = new ColorThief()
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var hasStarted = false

var random
fetch("nominees.json")
    .then(Response => Response.json())
    .then(data => {
        // GENERATE RANDOM
        random = randomIntFromInterval(0, data.length - 1)
    }
)

fetch("nominees.json")
    .then(Response => Response.json())
    .then(data => {
        var selectedData = fetchSelected(data)
        // RESIZE IF TOO MANY OPTIONS

        document.getElementById("category").textContent = selectedData.name;

        var sliders = '';
        selectedData.answers.forEach((answer, index) => {
            sliders += `
            <div class="slider" id="slider-${normalizeName(answer.name)}">
                <span class="slider-progress" id="slider-progress-${normalizeName(answer.name)}">.</span>
                <h1 class="slider-header" id="slider-header-${normalizeName(answer.name)}">${answer.name}</h1>
                <h2 class="slider-percentage" id="slider-percentage-${normalizeName(answer.name)}">0</h2><span class="slider-percentage">%</span>
            </div>
            `;
        });

        const panel = document.getElementById("chart");
        panel.innerHTML = sliders;
        
        // GET VOTES TOTAL
        let votesTotal = 0;
        let numberArray = [];
        selectedData.answers.forEach((answer, index) => {
            votesTotal += answer.votes;
            numberArray.push(answer.votes)
        });

        // GET FIRST & SECOND PLACE
        var max = Math.max.apply(null, numberArray); // get the max of the array
        const firstPlace = isWhatPercentOf(Math.max.apply(null, numberArray), votesTotal);
        numberArray.splice(numberArray.indexOf(max), 1); // remove max from the array
        const secondPlace = isWhatPercentOf(Math.max.apply(null, numberArray), votesTotal); // get the 2nd max

        selectedData.answers.forEach((answer, index) => {

            const slider = document.getElementById("slider-" + normalizeName(answer.name));
            const sliderHeader = document.getElementById("slider-header-" + normalizeName(answer.name));
            const sliderProgress = document.getElementById("slider-progress-" + normalizeName(answer.name));
            const sliderPercentage = document.getElementById("slider-percentage-" + normalizeName(answer.name));

            // RESIZE DEPENDING ON AMOUNT OF ITEMS
            
            if (selectedData.answers.length > 8) {
                sliderHeader.style.fontSize = "22px";
                sliderPercentage.style.fontSize = "18px";
            }
            if (selectedData.answers.length > 12) {
                sliderHeader.style.fontSize = "18px";
                sliderPercentage.style.fontSize = "14px";
            }
            if (selectedData.answers.length > 15) {
                sliderHeader.style.fontSize = "14px";
                sliderPercentage.style.fontSize = "12px";
            }

            // AVERAGE COLOR AS BACKGROUND

            const img = new Image("200px", "200px");
            img.src = answer.image;
            img.crossOrigin = 'anonymous';

            img.addEventListener('load', function() {
                color = colorThief.getColor(img);
                sliderProgress.style.backgroundColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
            });

            // ANIMATION TEST
            // TO-DO: MAKE THIS PRETTY

            setTimeout( () =>{
                slideCappedTo(
                    slider,
                    sliderProgress,
                    sliderPercentage,
                    isWhatPercentOf(answer.votes, votesTotal),
                    secondPlace / 3)
                playSoundEffect("sounds/rise-1.mp3")
            }, 1000);
            setTimeout( () =>{
                slideCappedTo(
                    slider,
                    sliderProgress,
                    sliderPercentage,
                    isWhatPercentOf(answer.votes, votesTotal),
                    (secondPlace / 3) * 2)
                playSoundEffect("sounds/rise-2.mp3")
            }, 3000);
            setTimeout( () =>{
                slideTo(
                    slider,
                    sliderProgress,
                    sliderPercentage,
                    isWhatPercentOf(answer.votes, votesTotal),
                    firstPlace)
                playSoundEffect("sounds/rise-3.mp3")
            }, 5000);
        });
    });

// LOAD PAGE
document.addEventListener("DOMContentLoaded", function() {
    fadeIn();
});

function fadeIn () {
    document.getElementById("overlay-black").style.animation = "fadeIn 0.5s ease-in forwards";
}

// HELPER FUNCTIONS

// TO-DO: Don't repeat the same number
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function normalizeName (name) {
    return name.replace( / +/g, '-');
}

function fetchSelected (data) {
    return urlParams.get("slide") ? data.find(el => el.code === urlParams.get("slide")) : data[random]
}

function isWhatPercentOf(x, y) {
    return (x / y) * 100;
}

function slideTo (slider, progress, number, percentage, firstPlace = false) {
    progress.style.width = percentage + "%"
    animateNumber(number, parseInt(number.innerHTML), percentage, 500);

    console.log(firstPlace)
    if (firstPlace && percentage < firstPlace) eliminate(slider)
}

function slideCappedTo (slider, progress, number, percentage, cap) {
    const cappedPercentage = percentage <= cap ? percentage : cap
    if (percentage <= cap) eliminate(slider)
    slideTo(slider, progress, number, cappedPercentage)
}

function animateNumber(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
}

function eliminate(slider) {
    setTimeout( () =>{
        slider.style.opacity = "50%";
        slider.style.transform = "scale(.95, .95)";}
    , 800);
}

function playSoundEffect(soundEffect) {
    var audio = new Audio(soundEffect);
    audio.volume = 0.15;
    audio.play();
}