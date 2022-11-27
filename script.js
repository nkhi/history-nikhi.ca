"use strict"; // single JS file, not dangerous
var terminal = document.getElementById('console');
var word1 = "hello world";
var word2 = 'Nikhi Bhambra';
var word3 = "back";
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

// go back to the home page
function goBack() {
    console.log("ok");
}

// switch to about mode
function showMore() {
    // replace terminal chevron with back button
    let button = document.getElementById("chevron");
    button.innerText = "<";     // can you make this cooler
    button.setAttribute("title", "this isnt working yet")
    // add new onclick to button !?
    
    // remove text
    let text = document.getElementById("text");
    text.innerHTML = ' ';

    // show 'back'
    window.setTimeout(function() {terminalText(word3);}, 6000);

    // new text
    let desc = document.getElementById("desc");
    desc.innerText = "Oh! Come and see the violence inherent in the system! Help, help, I'm being repressed! I have to push the pram a lot. And this isn't my nose. This is a false one. Where'd you get the coconuts? Ah, now we see the violence inherent in the system! The nose? Shh! Knights, I bid you welcome to your new home. Let us ride to Camelot! Well, I got better. …Are you suggesting that coconuts migrate? Why? Shut up! Will you shut up?! On second thoughts, let's not go there. It is a silly place. Did you dress her up like this? The Knights Who Say Ni demand a sacrifice! The Knights Who Say Ni demand a sacrifice! What a strange person. We shall say 'Ni' again to you, if you do not appease us. Well, she turned me into a newt. The swallow may fly south with the sun, and the house martin or the plover may seek warmer climes in winter, yet these are not strangers to our land. \n \n The Lady of the Lake, her arm clad in the purest shimmering samite, held aloft Excalibur from the bosom of the water, signifying by divine providence that I, Arthur, was to carry Excalibur. That is why I am your king. Well, I didn't vote for you. The nose? A newt? We found them. Listen. Strange women lying in ponds distributing swords is no basis for a system of government. Supreme executive power derives from a mandate from the masses, not from some farcical aquatic ceremony. Did you dress her up like this? We found them. Well, we did do the nose. Listen. Strange women lying in ponds distributing swords is no basis for a system of government. Supreme executive power derives from a mandate from the masses, not from some farcical aquatic ceremony. What a strange person. Knights of Ni, we are but simple travelers who seek the enchanter who lives beyond these woods. Why do you think that she is a witch? Shut up! Will you shut up?! I have to push the pram a lot. Camelot!"
    desc.style.margin="30px 0px 0px 0px";
    document.getElementById("socials").classList.add("hidden");

    // make background do something bonkerz
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
window.setTimeout(function() {terminalText(word2);}, 3000);

// make cursor blink every half second, after 5.5s
window.setTimeout(function() {window.setInterval(blinkingCursor, 500);}, 5500);