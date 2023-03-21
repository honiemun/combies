// GET FROM TWITCH CHAT

const genericMessages = [
    "Watch The Combies '22 LIVE on twitch.tv/honiemun",
    "We're simulcasting on Picarto! picarto.tv/honiemun",
    "You can now join Hivecord, too! discord.gg/beehive",
    "Check out the custom channel emotes with BTTV!",
    "Chat messages will appear here!",
    "Enjoy the show!",
    "Are you on Hivecord? Join VC - you'll be able to chat live on Red Carpet segments!",
    "honiemun.com/combies",
    "You just lost The Game."
]
const timeoutThreshold = 60 /* in seconds */

let twitchMessages = [];
parseChat();

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
    twitchMessages.push({
        "user": tags['display-name'],
        "message": message,
        "timestamp": unixTimestamp()
    })
})

// PARSE CHAT
document.getElementById("marquee").addEventListener("animationiteration", function() {
    parseChat();
}, false);

function parseChat() {
    let parsedChat = "";
    let defaultMessages;

    switch (Object.keys(twitchMessages).length) {
        case 2:
            defaultMessages = 1;
            break;
        case 1:
            defaultMessages = 2;
            break;
        case 0:
            defaultMessages = 3;
            break;
        default:
            defaultMessages = 0;
            break;
    }
    
    twitchMessages.forEach((message, index) => {
        // DELETE OLD CHAT MESSAGES
        if (unixTimestamp() >= message.timestamp + timeoutThreshold) {
            twitchMessages.splice(index, 1);
        }

        // ADD CHAT MESSAGES
        parsedChat += message.user + ": " + message.message;
        if (Object.keys(twitchMessages).length != index+1 || defaultMessages > 0) parsedChat += " | ";
    });

    // DEFAULT MESSAGES
    for (let index = 0; index < defaultMessages; index++) {
        parsedChat += genericMessages[randomIntFromInterval(0, Object.keys(genericMessages).length - 1)]
        if (defaultMessages != index+1) parsedChat += " | ";
    }

    //document.getElementById("marquee").textContent += ` ${tags['display-name']}: ${message}`;
    document.getElementById("marquee").textContent = parsedChat
}

// HELPERS

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function unixTimestamp() {
    return Math.round(new Date().getTime() / 1000)
}