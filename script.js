"use strict";

let terminal = document.getElementById('console');

let word1 = "SWE Intern at MedMe";
let word2 = 'Software Developer & Designer';

let letterCount = 0;
let letterDelete = 0;
let visible = true;

// constant blinking cursor
window.setInterval(function () {
	if (visible) {
		terminal.className = 'console-underscore hidden';
		visible = false;
	} else {
		terminal.className = 'console-underscore';
		visible = true;
	}
}, 300);

// first executes writing typo after 1.5 seconds
terminalText(word1);

// second executes writing 'progress' after 5 seconds
window.setTimeout(function () {
	terminalText(word2);
}, 3000);

// write and delete words
function terminalText(word) {
	let docLoc = document.getElementById('text');

	window.setTimeout(function () {

		// write out
		window.setTimeout(function () {
			if (letterCount === 0) {
				while (letterCount <= word.length) {
					(function (letterCount) {
						window.setTimeout(function () {
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
		window.setTimeout(function () {
			if (letterCount >= word.length && word != word2) {
				while (letterCount >= 0 && letterDelete != word.length + 1) {
					(function (letterCount) {
						window.setTimeout(function () {
							if (letterCount < 1) {
								terminal.innerHTML = "&nbsp;&#95;";
							}
							docLoc.innerHTML = word.substring(0, letterCount);
						}, 1000 - (letterCount*40));
					})(letterDelete++);
				}
			}
		}, 2000);

		letterCount = 0;
		letterDelete = 0;

	}, 1500);
}

// Adapted from indubitablee on SO
function hover(description) {
    document.getElementById('content').innerHTML = description;
}

// htmlgoodies
function ClipBoard()
{
    holdtext.innerText = copytext.innerText;
    Copied = holdtext.createTextRange();
    Copied.execCommand("Copy");
}

pagemap(document.querySelector('#map'), {
    viewport: null,
    styles: {
        'header,footer,section,article': 'rgba(0,0,0,0.08)',
        'h1,a': 'rgba(0,0,0,0.10)',
        'h2,h3,h4': 'rgba(0,0,0,0.08)'
    },
    back: 'rgba(0,0,0,0.02)',
    view: 'rgba(0,0,0,0.05)',
    drag: 'rgba(0,0,0,0.10)',
    interval: null
});
