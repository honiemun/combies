const colorThief = new ColorThief()

fetch("nominees.json")
    .then(Response => Response.json())
    .then(data => {

        // CARDS FOR EACH ELEMENT
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        
        var selectedData = urlParams.get("slide") ? data.find(el => el.code === urlParams.get("slide")) : data[randomIntFromInterval(0, data.length - 1)]
        document.getElementById("content").textContent = selectedData.name;

        var cards = '';
        selectedData.answers.forEach((answer, index) => {
            var video = answer.video ? `<video src='${answer.video}' class="card-video" id="video-${normalizeName(answer.name)}" />` : ``
            cards += `
            <div class="col col-4 base-card" id="base-card-${normalizeName(answer.name)}">
                <div class="card" id="card-${normalizeName(answer.name)}">
                    <div class="card-text">
                        <h5 class="card-owners">${answer.owners || ""}</h5>
                        <h1 class="card-header">${answer.name}</h1>
                    </div>
                    <div class="image-container">
                        <img src="${answer.image}" class="card-image" id="image-${normalizeName(answer.name)}">
                        ${video}
                    </div>
                </div>
            </div>
            `;
        });

        const panel = document.getElementById("cardHolder");
        panel.innerHTML = cards;
        
        // AVERAGE COLOR AS BACKGROUND

        selectedData.answers.forEach((answer, index) => {
            const img = new Image("200px", "200px");
            img.src = answer.image;
            img.crossOrigin = 'anonymous';

            img.addEventListener('load', function() {
                color = colorThief.getColor(img);
                const card = document.getElementById("card-" + normalizeName(answer.name));
                card.style.backgroundColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
            });
        });

        // INFINITE MARQUEE

        let outer = document.querySelector("#outer");
        let content = outer.querySelector('#content');

        repeatContent(content, outer.offsetWidth);

        let el = outer.querySelector('#loop');
        el.innerHTML = el.innerHTML + "" + el.innerHTML;

        function repeatContent(el, till) {
            let html = el.innerHTML;
            let counter = 0; // prevents infinite loop
            
            while (el.offsetWidth < till && counter < 100) {
                el.innerHTML += html;
                counter += 1;
            }
        }

        // ANIMATE SCROLL
        var cardScroll = document.getElementById("cardHolder");
        var timeout = 0

        selectedData.answers.forEach((answer, index) => {
            // TO-DO: Figure out how to play the whole video
            
            setTimeout( () =>{
                const currentCard = document.getElementById("base-card-" + normalizeName(answer.name));
                currentCard.style.filter = "brightness(100%)";
                currentCard.style.transform = "scale(1.05, 1.05)";

                const oldCard = document.getElementById("base-card-" + normalizeName(selectedData.answers[index - 1].name));
                oldCard.style.filter = "brightness(50%)";
                oldCard.style.transform = "scale(1, 1)";
                
                if (answer.video) {
                    const image = document.getElementById("image-" + normalizeName(answer.name));
                    const video = document.getElementById("video-" + normalizeName(answer.name));
                    image.classList.add("vanish");
                    video.classList.add("unvanish");
                    video.play();
                } else {
                    cardScroll.scrollLeft += currentCard.clientWidth;
                }
            }, timeout);
            
            timeout += 5000
        });
    });

    // HELPER FUNCTIONS
    
    function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    function normalizeName (name) {
        return name.replace( / +/g, '-');
    }