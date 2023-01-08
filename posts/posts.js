let idToFilenameIndex = {
    '6':'06_AI_death_and_centrality_of_meaning.json'
}

let meta = document.getElementById("meta")

// open txt file and show
function importJson(json) {
    var postTitle = document.getElementById("title");
    var postHeading = document.getElementById("heading");
    var postDate = document.getElementById("date");
    var content = document.getElementById("content");

    postTitle.innerText = json.title;
    postHeading.innerText = json.heading;
    postDate.innerText = json.date;
    content.innerText = json.content;
}

async function openPost(postId) {
    let postTitle = idToFilenameIndex[postId]
    let jason = await fetch(postTitle).then((j) => j.json());
    importJson(jason);
}

function playNarration() {
    return
}

// 
function progressBarScroll() {
    return
}

function matchContentHeight() {
    return
}

function expandMeta() {
    document.getElementById('heading-container').classList.remove('hidden');
    document.getElementById("content").style.maxHeight="calc(100vh - 3rem - 230px)";
    document.getElementById("play-icon").classList.remove('hidden');
    document.getElementById("title").style.paddingLeft = '10px';
    meta.onclick=shrinkMeta;
    matchMetaElementBeforeHeight();
}

function shrinkMeta() {
    document.getElementById('heading-container').classList.add('hidden');
    document.getElementById("content").style.maxHeight="calc(100vh - 3rem - 142px)";
    document.getElementById("play-icon").classList.add('hidden');
    document.getElementById("title").style.paddingLeft = "42px"
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
  

// make method to break json on br tags with <p> wrappers for a11y

// method to close / open top container like an accordion

openPost(6);

// Shrink title after 10s

window.setTimeout(function () {
    shrinkMeta();
}, 10000);

// lol
window.setTimeout(() => {
    matchMetaElementBeforeHeight();
}, 200);

window.onscroll = function () {
    progressBarScroll();
};

// keep meta:before height the same as the meta tag itself.
// recurring and onPageLoad.
window.addEventListener("resize", matchMetaElementBeforeHeight);
meta.addEventListener("mouseenter", () => {
    meta.style.setProperty('--metaBackground', 'rgb(68, 5, 120)');
});

meta.addEventListener("mouseleave", () => {
    meta.style.setProperty('--metaBackground', 'rgb(91, 8, 158)');
});
