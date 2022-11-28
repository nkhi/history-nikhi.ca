"use strict"; // single JS file, not dangerous
var terminal = document.getElementById('console');
var word1 = "hello world";
var word2 = 'Nikhi Bhambra';
var word3 = "back";
var word4 = "blog";
var word5 = "about"; 
var letterCount = 0;
var letterDelete = 0;
var visible = true;
var currentMode = "home";
let mainCopy = document.getElementById("main-copy").innerHTML;

// write and delete words
function terminalText(word) {
    let docLoc = document.getElementById('text');

    window.setTimeout(function() {

        // write out
        window.setTimeout(function() {
            if (letterCount === 0) {
                while (letterCount <= word.length) {
                    (function(letterCount) {
                        window.setTimeout(function() {
                            if (letterCount === 1) {
                                terminal.innerHTML = "&#95;";
                            }
                            docLoc.innerHTML = word.substring(0, letterCount);
                        }, 100 * (letterCount));
                    })(letterCount++);
                }
            }
        }, 0);

        // backspace, but only for the first word
        window.setTimeout(function() {
            if (letterCount >= word.length && word != word2) {
                while (letterCount >= 0 && letterDelete != word.length + 1) {
                    (function(letterCount) {
                        window.setTimeout(function() {
                            if (letterCount < 1) {
                                terminal.innerHTML = "&nbsp;&#95;";
                            }
                            docLoc.innerHTML = word.substring(0, letterCount);
                        }, 1000 - (letterCount * 40));
                    })(letterDelete++);
                }
            }
        }, 2000);

        letterCount = 0;
        letterDelete = 0;

    }, 1500);
}

// simulate active insert cursor
function blinkingCursor() {
  if (visible) {
      terminal.className = 'console-underscore hidden';
      visible = false;
  } else {
      terminal.className = 'console-underscore';
      visible = true;
  }
}

// hover a link, change background color
function tintBackgroundTo(hexString) {
  document.documentElement.style.background = "#"+hexString;
}

// switch to about mode
function showAbout() {
    if (currentMode=="blog"){
        document.getElementById("pen").classList.remove("hidden");
    }
    currentMode = "about";
    // replace terminal chevron with back button
    let button = document.getElementById("chevron");
    button.innerText = "<";
    button.setAttribute("title", "Back to Home")
    button.style.cursor = "pointer";
    // TODO blinkingh cursor breaks 

    // remove text
    let text = document.getElementById("text");
    text.innerHTML = ' ';

    // show 'back'
    window.setTimeout(function() {terminalText(word5);}, 2000);
    window.setTimeout(function() {terminalText(word3);}, 8000);

    // show new icons
    if (document.getElementById("options-container") == null) {
        document.getElementById("top-part").innerHTML += "<div id='options-container' class='options'><span id='button' class='first-option' title='Turn on narration' onmouseenter={tintBackgroundTo('251101')}><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-play-circle'><circle cx='12' cy='12' r='10'></circle><polygon points='10 8 16 12 10 16 10 8'></polygon></svg></span><span class='second-option' title='Turn off animation' onmouseenter={tintBackgroundTo('251101')}><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' class='feather feather-power'><path d='M18.36 6.64a9 9 0 1 1-12.73 0'></path><line x1='12' y1='2' x2='12' y2='12'></line></svg></span></div>";
    } else {
        document.getElementById("options-container").classList.remove("hidden")
    }



    document.getElementById("options-container").addEventListener("mouseleave", () => {
      document.documentElement.style.background = "#0c0c0d";
    });
    document.getElementById("button").addEventListener('click', () => {turnOnNarration();})

      
    // new text
    let desc = document.getElementById("desc");
    // TODO write an about section
    desc.innerText = "Oh! Come and see the violence inherent in the system! Help, help, I'm being repressed! I have to push the pram a lot. And this isn't my nose. This is a false one. Where'd you get the coconuts? Ah, now we see the violence inherent in the system! The nose? Shh! Knights, I bid you welcome to your new home. Let us ride to Camelot! Well, I got better. …Are you suggesting that coconuts migrate? Why? Shut up! Will you shut up?! On second thoughts, let's not go there. It is a silly place. Did you dress her up like this? The Knights Who Say Ni demand a sacrifice!\n \n The Lady of the Lake, her arm clad in the purest shimmering samite, held aloft Excalibur from the bosom of the water, signifying by divine providence that I, Arthur, was to carry Excalibur. That is why I am your king. Well, I didn't vote for you. The nose? A newt? We found them. Listen. Strange women lying in ponds distributing swords is no basis for a system of government. Supreme executive power derives from a mandate from the masses, not from some farcical aquatic ceremony. I have to push the pram a lot. Camelot!"
    desc.style.margin="30px 0px 0px 0px";
    document.getElementById("socials").style.padding = "26px 0";
    document.getElementById("about").classList.add("hidden");

    // TODO make background do something bonkerz
}

// TODO method to switch to blog mode
function showBlog() {
    if (currentMode=="about"){
        document.getElementById("about").classList.remove("hidden");
    }
    if (currentMode=="about") {
        let options = document.getElementById("options-container")
        options.classList.add("hidden");
    }
    currentMode = "blog";
    let button = document.getElementById("chevron");
    button.innerText = "<";
    button.setAttribute("title", "Back to Home")
    button.style.cursor = "pointer";
    document.getElementById("pen").classList.add("hidden");

    // TODO blinking cursor breaks
    // remove text
    let desc = document.getElementById("desc");
    desc.innerHTML = ' ';
    desc.style.minWidth = "276px";
    let text = document.getElementById("text");
    text.innerHTML = ' ';
    window.setTimeout(function() {terminalText(word4);}, 2000);
    window.setTimeout(function() {terminalText(word3);}, 8000);
    desc.innerHTML = "<i>*crickets*</i>"

}

// TODO method to switch to home mode
function showHome() {
    window.setTimeout(function() {terminalText(word2);}, 2000);
    let button = document.getElementById("chevron");
    button.innerText = ">";
    if (currentMode=="about") {
        let options = document.getElementById("options-container")
        options.classList.add("hidden");
    }
    document.getElementById("main-copy").innerHTML = mainCopy;
    document.getElementById("socials").style.padding = "0";
    document.getElementById("pen").classList.remove("hidden");
    document.getElementById("about").classList.remove("hidden");
}

// TODO method for narration
function turnOnNarration() {
    if (!document.body.getElementsByClassName('audio').length > 0) {
        document.body.innerHTML += "<audio id='audio-player' preload='auto' src='/media/about_narration.mp3'></audio>";
    }
    let narrationAudio = document.getElementById('audio-player');
    narrationAudio.play()

    let button = document.getElementById("button");
    button.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-stop-circle'><circle cx='12' cy='12' r='10'></circle><rect x='10' y='10' width='4' height='4' fill='currentColor'></rect></svg>"
    // button.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-pause-circle'><circle cx='12' cy='12' r='10'></circle><line x1='10' y1='15' x2='10' y2='9'></line><line x1='14' y1='15' x2='14' y2='9'></line></svg>"
    button.removeEventListener('click', () => {
        turnOnNarration();
    })
    button.addEventListener('click', () => {
        turnOffNarration();
    })
    document.getElementById("options-container").addEventListener("mouseleave", () => {
        document.documentElement.style.background = "#0c0c0d";
      });
}

function turnOffNarration() {
    let button = document.getElementById("button");
    let narrationAudio = document.getElementById('audio-player');
    narrationAudio.pause()
    button.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-play-circle'><circle cx='12' cy='12' r='10'></circle><polygon points='10 8 16 12 10 16 10 8'></polygon></svg>";
    button.removeEventListener('click', () => {
        turnOffNarration();
    })
    button.addEventListener('click', () => {
        turnOnNarration();
    })
    document.getElementById("options-container").addEventListener("mouseleave", () => {
      document.documentElement.style.background = "#0c0c0d";
    });
}

// TODO method for turning off animations
function stopBackgroundAnimation() {
    console.log();
}


// TODO method for animating background
function startBackgroundAnimation() {
    console.log();
}

// [!!!!!!!!!] Below is main()

// init background behavior for links 
document.getElementById("left-container").addEventListener("mouseleave", () => {
  document.documentElement.style.background = "#0c0c0d";
});
document.getElementById("right-container").addEventListener("mouseleave", () => {
  document.documentElement.style.background = "#0c0c0d";
});

// write the first word immediately
terminalText(word1);

// write name after 3 seconds
window.setTimeout(function() {terminalText(word2);}, 3000);

// make cursor blink every half second, after 5.5s
window.setTimeout(function() {window.setInterval(blinkingCursor, 500);}, 5500);

// make links accessible to avoid animation issues oop
window.setTimeout(function() {
    document.getElementById('pen').addEventListener('click', () => {
        showBlog();
    })
    document.getElementById('about').addEventListener('click', () => {
        showAbout();
    })
}, 7000);