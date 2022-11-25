"use strict"; // single JS file, not dangerous
var terminal = document.getElementById('console');
var word1 = "hello world";
var word2 = 'Nikhi Bhambra';
var letterCount = 0;
var letterDelete = 0;
var visible = true;

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

// Below is main()

// init listener for socials hovering
let socials = document.getElementById("links");
socials.addEventListener("mouseleave", () => {
  document.documentElement.style.background = "#0c0c0d";
}, false);

// write the first word immediately
terminalText(word1);

// write name after 3 seconds
window.setTimeout(function() {
    terminalText(word2);
}, 3000);

// make cursor blink after 5.5s
window.setTimeout(function() {
  window.setInterval(blinkingCursor, 500);
}, 5500);