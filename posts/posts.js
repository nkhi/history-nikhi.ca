let idToFilenameIndex = {
    '6':'06_AI_death_and_centrality_of_meaning.json'
}

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

// make method to break json on br tags with <p> wrappers for a11y

// method to close / open top container like an accordion

openPost(6);

// Shrink title after 10s

// window.setTimeout(function () {
//     document.getElementById('heading-container').classList.add('hidden');
//     document.getElementById('meta::before');
//   }, 10000);
