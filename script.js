"use strict"; // single JS file, not dangerous
var terminal = document.getElementById('console');
var word1 = "hello world";
var word2 = 'Software Engineer & Designer';
var letterCount = 0;
var letterDelete = 0;
var visible = true;

// constant blinking cursor
window.setInterval(function() {
    if (visible) {
        terminal.className = 'console-underscore hidden';
        visible = false;
    } else {
        terminal.className = 'console-underscore';
        visible = true;
    }
}, 300);

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

// first executes writing typo after 1.5 seconds
terminalText(word1);

// second executes writing 'progress' after 3 seconds
window.setTimeout(function() {
    terminalText(word2);
}, 3000);

// Adapted from indubitablee on SO
function hover(description) {
    document.getElementById('content').innerHTML = description;
}

// htmlgoodies
function ClipBoard() {
    holdtext.innerText = copytext.innerText;
    Copied = holdtext.createTextRange();
    Copied.execCommand("Copy");
}

const targetElement = document.querySelector("html");
const payload = {
    element: targetElement
}
setTimeout(() => {
    switch (Math.floor(Math.random() * 6)) {
        case 0:
        case 2:
        case 4:
            new fairyDustCursor(payload);
            break;
        case 1:
        case 3:
        case 5:
            new snowflakeCursor(payload);
            break;
        default:
            console.log("unlucky. try refreshing the page :)");
            break;
    }
}, 5000);
