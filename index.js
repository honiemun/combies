// GET FROM TWITCH CHAT

const genericMessages = [
    "Watch The Combies '22 LIVE on twitch.tv/honiemun",
    "We're simulcasting on Picarto, too! picarto.tv/honiemun",
    "You can now join Hivecord, too! discord.gg/beehive",
    "If you have BTTV, you can use channel emotes - check them out!",
    "Chat messages will appear on this marquee!",
    "Enjoy the show!"
]

let username, token, channel
fetch("secret.json")
    .then(Response => Response.json())
    .then(data => {
        username = data.username;
        token = data.token;
        channel = data.channel;
    }
)

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true,
    },
    channels: ['honiemun'],
})

client.connect();

client.on('message', (channel, tags, message, self) => {
    console.log(`${tags['display-name']}: ${message}`)
    document.getElementById("marquee").textContent += ` ${tags['display-name']}: ${message}`;
})

// INFINITE MARQUEE

/*
let outer = document.querySelector("#outer");
let marquee = outer.querySelector('#marquee');

repeatContent(marquee, outer.offsetWidth);

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
*/