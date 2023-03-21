const colorThief = new ColorThief()
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var hasStarted = false

// GENERATE RANDOM
var random
fetch("nominees.json")
    .then(Response => Response.json())
    .then(data => {
        random = randomIntFromInterval(0, data.length - 1)
    }
)

fetch("nominees.json")
    .then(Response => Response.json())
    .then(data => {
        var selectedData = fetchSelected(data)

        //document.getElementById("content").textContent = selectedData.name;

        var sliders = '';
        selectedData.answers.forEach((answer, index) => {
            sliders += `
            <div class="slider" id="slider-${normalizeName(answer.name)}">
                <span class="slider-progress" id="slider-progress-${normalizeName(answer.name)}">.</span>
                <h1 class="slider-header">${answer.name}</h1>
                <h2 class="slider-percentage" id="slider-percentage-${normalizeName(answer.name)}">0.0%</h2>
            </div>
            `;
        });

        const panel = document.getElementById("chart");
        panel.innerHTML = sliders;
        

        selectedData.answers.forEach((answer, index) => {

            const sliderProgress = document.getElementById("slider-progress-" + normalizeName(answer.name));
            const sliderPercentage = document.getElementById("slider-percentage-" + normalizeName(answer.name));

            // AVERAGE COLOR AS BACKGROUND

            const img = new Image("200px", "200px");
            img.src = answer.image;
            img.crossOrigin = 'anonymous';

            img.addEventListener('load', function() {
                color = colorThief.getColor(img);
                sliderProgress.style.backgroundColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
            });

            // ANIMATION TEST

            const validNumber = randomIntFromInterval(0, 100) //delete
            
            sliderProgress.style.width = validNumber + "%"
            sliderPercentage.innerHTML = validNumber + "%"
        });
    });

// LOAD PAGE
document.addEventListener("DOMContentLoaded", function() {
    fadeIn();
});

function fadeIn () {
    console.log("hi!")
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