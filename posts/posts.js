// Posts index
let idToFilenameIndex = {
    '6':'06_AI_death_and_centrality_of_meaning.json'
}

// Color switcher
let last_palette_i = 0;
let palettes = [
    {main: "#0c0c0d", back:"#f4ddc6", third: "#323237"},
    {main: "#34046b", back: "#a19ae2", third:"#5815a5"},
    {main: "#691111", back: "#c58989", third:"#932020"},
    {main: "#054f13", back: "#a4c499", third:"#09771d"},
    {main: "#043d6b", back: "#7ca3d9", third:"#115D9C"},
    {main: "#f4ddc6", back: "#0c0c0d", third:"#b8a28e"},
];

function changePalette(main, back, third) {
    document.documentElement.style.setProperty('--main-color', main);
    document.documentElement.style.setProperty('--background-color',back);
    document.documentElement.style.setProperty('--third-color', third);
}

function cyclePalettes() {
    if (last_palette_i == palettes.length) {
        last_palette_i = 0;
    }
    let newPalette = palettes[last_palette_i]
    last_palette_i++;
    
    // use a timeout to have graceful debounce handling for a11y
    window.setTimeout(() => {
        changePalette(newPalette.main, newPalette.back, newPalette.third);}, 
    20);
}

async function openPost(path) {
    let json_obj = await fetch(path).then((j) => j.json());
    document.getElementById("title").innerText = json_obj.title;
    document.getElementById("date").innerText = json_obj.date;
    importJsonContent(json_obj.contentPath);
}

// open content seperately for faster First Contentful Paint
async function importJsonContent(path){
    let contentJson = await fetch(path).then((j) => j.json());
    var content = document.getElementById("content");
    let paragraph_arr = contentJson.content.split("\n\n").map(text => `<p>${text}</p>`);

    for(index in paragraph_arr){
      content.innerHTML+=paragraph_arr[index];
    }
}

// a11y feature in the header
function pauseNarration() {
    let narrationAudio = document.getElementById("audio-player");
    narrationAudio.pause();
    document.getElementById("name").innerText = "Play audio recording"
    document.getElementById("audiobutton").setAttribute("onclick", "playNarration()");
}

function playNarration() {
    let narrationAudio = document.getElementById("audio-player");
    narrationAudio.play();
    document.getElementById("name").innerText = "Pause audio recording";
    document.getElementById("audiobutton").onclick="pauseNarration()";
    link.setAttribute("onclick", "pauseNarration()");

}

// Scrollbar
function progressBarScroll() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop,
        height = document.documentElement.scrollHeight - document.documentElement.clientHeight,
        scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";
}

function main() {
    openPost(idToFilenameIndex[6]);
    window.onscroll = function () {
        progressBarScroll();
    };
    
    // make dot spin once
    const dot = document.getElementById('dot');
    dot.classList.add("spin-utility-class");
    window.setTimeout(() => {
        dot.classList.remove("spin-utility-class");
    }, 1000);
    
    document.getElementById('audio-player').volume = 0.5;
}

main();