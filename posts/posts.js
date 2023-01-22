let idToFilenameIndex = {
    '6':'06_AI_death_and_centrality_of_meaning.json'
}

//     {main: "#0c0c0d", back: "#f4ddc6", third:"#323237"},

// {main: "105, 17, 17", back: "197, 137, 137", third:"147, 32, 32"},

let last_palette_i = 0;
let palettes = [

    {main: "#691111", back: "#c58989", third:"#932020"},
    {main: "#054f13", back: "#a4c499", third:"#09771d"},
    {main: "#043d6b", back: "#7ca3d9", third:"#115D9C"},
    {main: "#34046b", back: "#a19ae2", third:"#5815a5"},
    {main: "#f4ddc6", back: "#0c0c0d", third:"#b8a28e"},
];

let meta = document.getElementById("meta")

// open txt file and show
function importJson(json) {
    var postTitle = document.getElementById("title");
    var postDate = document.getElementById("date");
    var content = document.getElementById("content");
    let paragraph_arr = json.content.split("\n\n").map(text => `<p>${text}</p>`);

    postTitle.innerText = json.title;
    postDate.innerText = json.date;
    for(index in paragraph_arr){
        content.innerHTML+=paragraph_arr[index];
    }
}

async function openPost(postId) {
    let postTitle = idToFilenameIndex[postId]
    let jason = await fetch(postTitle).then((j) => j.json());
    importJson(jason);
}

function pauseNarration() {
    let narrationAudio = document.getElementById("audio-player");
    narrationAudio.pause();
    document.getElementById("name").innerText = "Play audio recording"
    document.getElementById("audiobutton").setAttribute("onclick", "playNarration()");
    // document.getElementById("play-icon").outerHTML = "<svg id='play-icon' onClick={playNarration()} title='Play audio narration' xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-play-circle'><circle cx='12' cy='12' r='10'></circle><polygon points='10 8 16 12 10 16 10 8'></polygon></svg>";
    // document.getElementById("play-icon").setAttribute("onclick", "playNarration()");
}

// make this accept a param to dynamically handle path routing
// make this change icons
function playNarration() {
    let narrationAudio = document.getElementById("audio-player");
    narrationAudio.play();
    document.getElementById("name").innerText = "Pause audio recording";
    document.getElementById("audiobutton").onclick="pauseNarration()";
    // let link = document.getElementById("play-text")
    link.setAttribute("onclick", "pauseNarration()");
    // document.getElementById("play-icon").outerHTML = "<svg id='play-icon' onClick={playNarration()} title='Play audio narration'  xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-pause-circle'><circle cx='12' cy='12' r='10'></circle><line x1='10' y1='15' x2='10' y2='9'></line><line x1='14' y1='15' x2='14' y2='9'></line></svg>";

}

function expandMeta() {
    document.getElementById('heading-container').classList.remove('hidden');
    // document.getElementById("content").style.maxHeight="calc(100vh - 3rem - 230px)";
    document.getElementById("play-icon").title="Play audio narration";
    meta.onclick=shrinkMeta;
    matchMetaElementBeforeHeight();
}

// Give this a gradient or something randomly chosen on page enter
// use css vars
function shrinkMeta() {
    document.getElementById('heading-container').classList.add('hidden');
    // document.getElementById("content").style.maxHeight="calc(100vh - 3rem - 142px)";
    document.getElementById("play-icon").title="Pause audio narration";
    meta.onclick=expandMeta;
    matchMetaElementBeforeHeight();
}

// use this to fix the meta:before elements height
function matchMetaElementBeforeHeight() {
    let meta = document.getElementById("meta");
    let meta_height = meta.offsetHeight + "px";
    meta.style.setProperty('--metaBeforeElementHeight',meta_height);
    matchContentHeight();
}
  
function progressBarScroll() {
    // let content = document.getElementById("")
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop,
        height = document.documentElement.scrollHeight - document.documentElement.clientHeight,
        scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";
  }

function matchContentHeight() {
    return
}

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
    
    changePalette(newPalette.main, newPalette.back, newPalette.third);
}

// make method to break json on br tags with <p> wrappers for a11y

// method to close / open top container like an accordion

openPost(6);

// Shrink title after 10s

// window.setTimeout(function () {
//     shrinkMeta();
// }, 6000);

// // lol
// window.setTimeout(() => {
//     matchMetaElementBeforeHeight();
// }, 200);

window.onscroll = function () {
    progressBarScroll();
};

// const dot = document.getElementById('dot');
// dot.addEventListener('mouseover', () => {cyclePalettes();});


// keep meta:before height the same as the meta tag itself.
// recurring and onPageLoad.
// window.addEventListener("resize", matchMetaElementBeforeHeight);
// meta.addEventListener("mouseenter", () => {
//     meta.style.setProperty('--metaBackground', 'rgb(50, 50, 50)');
// });

// meta.addEventListener("mouseleave", () => {
//     meta.style.setProperty('--metaBackground', 'rgb(39, 39, 39)');
// });

document.getElementById('audio-player').volume = 0.5;