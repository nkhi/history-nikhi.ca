"use strict"; // single JS file, not dangerous

/* This is a simple website. why make it complicated? */

/*
CONSTANTS
*/

// var terminal = document.getElementById("console");
// var letterCount = 0;
// var letterDelete = 0;
// var panelCount = 0;
// var visible = true;
// var expandedText = false;
// var newOpacity = 0;

// var helloWorld = "hello world";
// var nameString = "Nikhi Bhambra";
// var postsString = "posts";
// var aboutString = "about";
// var currentMode = "home";
// var seeBackgroundModeString = "...whoa";

// let compressedText = `I write code at <a id="apollo" target="_blank" href="https://www.confluent.io/product/confluent-platform/" onmouseenter={tintBackgroundTo('2a0957')} onmouseleave={tintBackgroundTo('0c0c0d')}>Confluent</a>`;
// let aboutText =
//   "I've spent two years working remotely at start ups in Toronto, and I like building things on the web that make life easier. In the future, I want to design better AI that can understand like us.";
// let postsListText = `<ul>
// <li id="gqlparty">
//   <div class="emoji-container">🪩</div>
//   <div id="text-story">
//       <a target="_blank" class="posts-link" href="/posts/?gqlparty">A Middling Title
//     </a>
//   </div>
// </li>
// <li id="favs">
// <div class="emoji-container">🤖</div>
// <div id="text-story">
// <a class="posts-link" target="_blank" href="/posts/?ml">An Incredible Title</a>
// </a>
// </div>
// </li>
// <li id="favs">
// <div class="emoji-container">🤩</div>
// <div id="text-story">
// <a class="posts-link" target="_blank" href="/posts/?favs">The Best Title Ever</a>
// </a>
// </div>
// </li>
// </ul>`;
// let detailedHomeText = `At <a id="apollo" target="_blank" href="https://www.confluent.io/product/confluent-platform/" onmouseenter={tintBackgroundTo('2a0957')} onmouseleave={tintBackgroundTo('0c0c0d')}>Confluent</a> I work on the infrastructure platform that enables thousands of clusters to be deployed everyday across the globe. <br /> <br />Otherwise, I enjoy spicy foods, building keyboards, & playing with my cats 😊`;

var desc = document.getElementById("desc");
// let mainCopy = document.getElementById("main-copy").innerHTML;

// TODO audit event listener queue when moving between pages,
// I suspect all of the control listener's on every page will
// need to be reinvoked when switchng.

// TODO break out these sections into different js files so this
// isn't impossible to reason through

// TODO website shouldn't break when you click too quickly

/*
UI ELEMENTS
*/

/* Write and delete words in the heading section */
// function terminalText(word) {
//   let docLoc = document.getElementById("text");

//   window.setTimeout(function () {
//     // write out
//     window.setTimeout(function () {
//       if (letterCount === 0) {
//         while (letterCount <= word.length) {
//           (function (letterCount) {
//             window.setTimeout(function () {
//               if (letterCount === 1) {
//                 terminal.innerHTML = "&#95;";
//               }
//               docLoc.innerHTML = word.substring(0, letterCount);
//             }, 100 * letterCount);
//           })(letterCount++);
//         }
//       }
//     }, 0);

//     // backspace, but only for the first word
//     window.setTimeout(function () {
//       if (letterCount >= word.length && word != nameString) {
//         while (letterCount >= 0 && letterDelete != word.length + 1) {
//           (function (letterCount) {
//             window.setTimeout(function () {
//               if (letterCount < 1) {
//                 terminal.innerHTML = "&nbsp;&#95;";
//               }
//               docLoc.innerHTML = word.substring(0, letterCount);
//             }, 1000 - letterCount * 40);
//           })(letterDelete++);
//         }
//       }
//     }, 2000);

//     letterCount = 0;
//     letterDelete = 0;
//   }, 1500);
// }

/* Visually simulate active insert cursor */
// function blinkingCursor() {
//   if (visible) {
//     terminal.className = "console-underscore hidden";
//     visible = false;
//   } else {
//     terminal.className = "console-underscore";
//     visible = true;
//   }
// }

/* Change background of the html element to hexString */
function tintBackgroundTo(hexString) {
  document.documentElement.style.background = "#" + hexString;
}

/* Instantiate a new canvas that fills in the background with a cool fractal */
function startBackgroundAnimation() {
  window.addEventListener("load", function () {
    const sqWidthMin = 5; // length of square side 5..sqWidthMax
    const sqWidthMax = 10; // length of square side sqWidthMin..50
    const DHUE = 1; // integer 1-10 - hue change by step
    const DLUM = 1; // 0.1 - 5 - lightness change by step
    const SPEED = 0.01; // 0 to 100
    const MARGIN = 0.5; // black marging around each square

    let canv, ctx; // canvas and context

    let maxx, maxy; // canvas dimensions

    let sqWidth, sqRad; // square side length, quarter of circle radius (1/2 sqWidth)
    let grid;
    let nbx, nby;
    let hnbx, hnby; // number of squares in the half of the width, height of the canvas

    // for animation

    let events;
    let colorMode;

    // shortcuts for Math.
    const mrandom = Math.random;
    const mfloor = Math.floor;
    const mabs = Math.abs;

    //------------------------------------------------------------------------

    function alea(mini, maxi) {
      // random number in given range

      if (typeof maxi == "undefined") return mini * mrandom(); // range 0..mini

      return mini + mrandom() * (maxi - mini); // range mini..maxi
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function intAlea(mini, maxi) {
      // random integer in given range (mini..maxi - 1 or 0..mini - 1)
      //
      if (typeof maxi == "undefined") return mfloor(mini * mrandom()); // range 0..mini - 1
      return mini + mfloor(mrandom() * (maxi - mini)); // range mini .. maxi - 1
    }

    function arrayShuffle(array) {
      /* randomly changes the order of items in an array
     only the order is modified, not the elements
  */
      let k1, temp;
      for (let k = array.length - 1; k >= 1; --k) {
        k1 = intAlea(0, k + 1);
        temp = array[k];
        array[k] = array[k1];
        array[k1] = temp;
      } // for k
      return array;
    } // arrayShuffle

    function Square(kx, ky, color) {
      /* constructor */

      this.color = color ? color : `hsl(${intAlea(360)},100%,50%)`;
      this.kx = kx;
      this.ky = ky;
      this.kxc = kx - hnbx;
      this.kyc = ky - hnby;

      this.xc = maxx / 2 + this.kxc * sqWidth; // center of square
      this.yc = maxy / 2 + this.kyc * sqWidth;
    } // Square
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    Square.prototype.fillSquare = function (evolColor) {
      const side = sqWidth - MARGIN;
      const hSide = side / 2;

      this.evolColor = evolColor; // just to mark square as drawn
      ctx.fillStyle = `hsl(${evolColor.hue}, 100%,${evolColor.lum}% )`;
      ctx.fillRect(this.xc - hSide, this.yc - hSide, side, side);
    }; // Square.prototype.fillSquare

    function nextColor(evolColor) {
      let hue = evolColor.hue;
      let dhue = evolColor.dhue;
      let lum = evolColor.lum;
      let dlum = evolColor.dlum;
      let width = evolColor.width;
      let dWidth = evolColor.dWidth;

      let color;
      switch (colorMode) {
        case 0:
          color = `hsl(${hue},100%,50%)`;
          hue = (hue + dhue) % 360;
          break;
        case 1:
          color = `hsl(${hue},100%,${lum}%)`;
          lum += dlum;
          if (lum > 80) dlum = -mabs(dlum);
          if (lum < 40) dlum = mabs(dlum);
          break;
        case 2:
          color = `hsl(${hue},100%,${lum}%)`;
          lum += dlum;
          if (lum > 80) dlum = -mabs(dlum);
          if (lum < 40) dlum = mabs(dlum);
          hue = (hue + dhue) % 360;
          break;
      } // switch
      width += dWidth;
      if (width > 2.5) dWidth = -mabs(dWidth);
      if (width < 0.5) dWidth = mabs(dWidth);

      return {
        hue: hue,
        dhue: dhue,
        lum: lum,
        dlum: dlum,
        width: width,
        dWidth: dWidth,
        color: color,
      };
    } // returnColor

    let animate;

    {
      // scope for animate

      let animState = 0;
      let listReachable;
      let currCell, evolColor;

      animate = function (tStamp) {
        let tinit;
        let event;
        let neighGroups;

        event = events.pop();
        if (event && event.event == "reset") animState = 0;
        if (event && event.event == "click") animState = 0;
        window.requestAnimationFrame(animate);

        tinit = performance.now();
        do {
          switch (animState) {
            case 0:
              if (startOver()) {
                ++animState;
                evolColor = {};
                evolColor.hue = intAlea(360);
                evolColor.dhue = intAlea(2) ? DHUE : 360 - DHUE;
                evolColor.lum = intAlea(40, 80);
                evolColor.dlum = intAlea(2) ? -DLUM : DLUM;
                evolColor.width = alea(0.5, 2.5);
                evolColor.dWidth = 0.1;
                evolColor = nextColor(evolColor);
              }
              break;

            case 1:
              currCell = grid[hnby][hnbx];
              listReachable = [currCell];
              ++animState;

            case 2:
              if (listReachable.length == 0) {
                animState += 10; // finished !
                break;
              }
              currCell = listReachable.shift();
              if (!currCell.evolColor) ++animState;
              else break;

            case 3:
              evolColor = nextColor(evolColor);
              currCell.group.forEach((cell) => cell.fillSquare(evolColor));
              // make list of all neighbour groups
              neighGroups = new Set();
              currCell.group.forEach((cell) => {
                cell.neighbours.forEach((neighCell) => {
                  if (!neighCell.evolColor)
                    // keep only undrawn cells;
                    neighGroups.add(neighCell.group);
                }); // cell.neighbours.forEach
              }); // currCell.group.forEach

              if (neighGroups.size == 0) {
                // no neighbours available
                --animState; // go back and fetch in listReachable
                break;
              }

              // put those groups in a random order
              neighGroups = arrayShuffle([...neighGroups]); // change into Array

              for (let k = 1; k < neighGroups.length; ++k) {
                listReachable.push([...neighGroups[k]][0]); // push 1 cell of every group - but first
              }
              currCell = [...neighGroups[0]][0]; // 1st cell of 1st group is next current cell
              break;
          } // switch
        } while (
          (animState == 2 || animState == 3) &&
          performance.now() - tinit < SPEED
        );
      }; // animate
    } // scope for animate

    function createGrid() {
      let kx1, ky1, cell;

      grid = [];

      for (let ky = 0; ky < nby; ++ky) {
        grid[ky] = [];
        for (let kx = 0; kx < nbx; ++kx) {
          grid[ky][kx] = new Square(kx, ky);
        } // for kx
      } // for ky

      // calculate neighbours
      for (let ky = 0; ky < nby; ++ky) {
        for (let kx = 0; kx < nbx; ++kx) {
          cell = grid[ky][kx];
          cell.neighbours = [];
          ky1 = ky - 1; // neighbour side 0
          if (ky1 >= 0) cell.neighbours[0] = grid[ky1][kx];
          kx1 = kx + 1; // neighbour side 1
          if (kx1 < nbx) cell.neighbours[1] = grid[ky][kx1];
          ky1 = ky + 1; // neighbour side 2
          if (ky1 < nby) cell.neighbours[2] = grid[ky1][kx];
          kx1 = kx - 1; // neighbour side 3
          if (kx1 >= 0) cell.neighbours[3] = grid[ky][kx1];
        } // for kx
      } // for ky

      // create groups

      for (let ky = 0; ky < nby; ++ky) {
        for (let kx = 0; kx < nbx; ++kx) {
          cell = grid[ky][kx];
          if (cell.group) continue;
          cell.group = new Set([cell]); // myself
          addToGroup(cell.group, hnbx - cell.kxc, cell.ky);
          addToGroup(cell.group, cell.kx, hnby - cell.kyc);
          addToGroup(cell.group, hnbx - cell.kxc, hnby - cell.kyc);
          addToGroup(cell.group, hnbx + cell.kyc, hnby + cell.kxc);
          addToGroup(cell.group, hnbx + cell.kyc, hnby - cell.kxc);
          addToGroup(cell.group, hnbx - cell.kyc, hnby + cell.kxc);
          addToGroup(cell.group, hnbx - cell.kyc, hnby - cell.kxc);
        } // for kx
      } // for ky
    } // createGrid

    function addToGroup(group, kx, ky) {
      if (kx < 0 || ky < 0 || kx >= nbx || ky >= nby) return; // out of grid, do not add
      group.add(grid[ky][kx]);
      grid[ky][kx].group = group;
    } // addToGroup

    function nextColor(evolColor) {
      let hue = evolColor.hue;
      let dhue = evolColor.dhue;
      let lum = evolColor.lum;
      let dlum = evolColor.dlum;
      let width = evolColor.width;
      let dWidth = evolColor.dWidth;

      let color;
      switch (colorMode) {
        case 0:
          color = `hsl(${hue},100%,50%)`;
          hue = (hue + dhue) % 360;
          lum = 50;
          break;
        case 1:
          color = `hsl(${hue},100%,${lum}%)`;
          lum += dlum;
          if (lum > 80) dlum = -mabs(dlum);
          if (lum < 40) dlum = mabs(dlum);
          break;
        case 2:
          color = `hsl(${hue},100%,${lum}%)`;
          lum += dlum;
          if (lum > 80) dlum = -mabs(dlum);
          if (lum < 40) dlum = mabs(dlum);
          hue = (hue + dhue) % 360;
          break;
      } // switch
      width += dWidth;
      if (width > 2.5) dWidth = -mabs(dWidth);
      if (width < 0.5) dWidth = mabs(dWidth);

      return {
        hue: hue,
        dhue: dhue,
        lum: lum,
        dlum: dlum,
        width: width,
        dWidth: dWidth,
        color: color,
      };
    } // returnColor

    function startOver() {
      // canvas dimensions

      maxx = window.innerWidth;
      maxy = window.innerHeight;

      canv.width = maxx;
      canv.height = maxy;
      ctx.lineJoin = "bevel";
      ctx.lineCap = "round";

      sqWidth = alea(sqWidthMin, sqWidthMax);
      sqRad = sqWidth / 2;

      hnby = mfloor(maxy / sqWidth / 2); // the full array has 2 * hnbx + 1 rows
      hnbx = mfloor(maxx / sqWidth / 2);
      nbx = 1 + 2 * hnbx;
      nby = 1 + 2 * hnby;

      if (nbx < 3 || nby < 3) return false;
      ctx.clearRect(0, 0, maxx, maxy);

      colorMode = intAlea(3);
      createGrid();

      return true;
    } // startOver

    function mouseClick(event) {
      events.push({ event: "click" });
      document.getElementsByTagName("canvas")[0].removeAttribute("title");
      panelCount += 1;
      if (panelCount <= 9) {
        playPanelDingSoundEffect(panelCount);
      }
    } // mouseMove

    {
      canv = document.createElement("canvas");
      canv.style.position = "absolute";
      canv.style.zIndex = "-1";
      canv.style.opacity = 0.25;
      canv.style.transition = "opacity 1s";
      document.documentElement.appendChild(canv);
      ctx = canv.getContext("2d");
      canv.setAttribute(
        "title",
        "you feel a strange urge to click the background..."
      );
      canv.setAttribute('data-umami-event', "Clicked Background Mosaic")
    }
    canv.addEventListener("click", mouseClick); // just for initial position
    events = [{ event: "reset" }];
    requestAnimationFrame(animate);
  }); // window load listener
}

/* The first eight times you click the background, it will play a xylophone sound*/
function playPanelDingSoundEffect(panelCount) {
  let notes = ["c", "d", "e", "f", "g", "a", "b", "c2"];
  let audioPlayer = document.getElementById("audio-player");

  if (panelCount <= 8) {
    if (panelCount == 1) {
      audioPlayer.play();
    }
    // Need to load a new sound file
    else {
      var newFile = notes[panelCount - 1];
      audioPlayer.setAttribute("src", `media/xylophone/${newFile}.wav`);
      audioPlayer.play();
    }
  }
  //  Last loop iteration removes audio tag
  else {
    document.getElementsByTagName("audio")[0].remove();
  }
}

/* Option to turn off background animation */
function stopBackgroundAnimation() {
  document.getElementsByTagName("canvas")[0].remove();
}

// /* Option to admire the background animation */
// function seeBackground() {
//   if (currentMode == "home" && !expandedText) {
//     document.getElementsByTagName("canvas")[0].style.opacity = 1;
//     document.getElementById("top-part").classList.add("hidden");
//     document.getElementById("main-copy").classList.add("hidden");
//     document.getElementById("socials").classList.add("hidden");
//   }
// }

// /* Reciprocal of hideText(), go back to default */
// function undoSeeBackground() {
//   document.getElementsByTagName("canvas")[0].style.opacity = 0.18;
//   document.getElementById("top-part").classList.remove("hidden");
//   document.getElementById("main-copy").classList.remove("hidden");
//   document.getElementById("socials").classList.remove("hidden");
// }

/* Add a translucent background to make text more ledgible */
// function translucentMode() {
//   document.body.classList.add("transparent-surface");
//   // document.body.classList.add('darken');
//   // newOpacity = opacityMap(document.getElementById('opacity').value);
//   // document.body.style.backgroundColor = `rgba(0 ,0 ,0 , ${newOpacity}) !important`;
// }

// /* Reciprocal of translucentMode(), remove translucent panel */
// function undoTranslucentMode() {
//   document.body.classList.remove("transparent-surface");
//   // document.body.classList.remove('darken');
// }

/* HTML sliders like whole numbers, so convert the slider value 0-100 to something between 0-0.4*/
// function opacityMap(inputValue) {
//   return (0.4 / 100) * inputValue;
// }

/*
function addChevronBackgroundHover() {
  button.classList.add('chevron-background-hover');
}

function removeChevronBackgroundHover() {
  button.classList.remove('chevron-background-hover');
}

function cleanupChevronHoverListeners() {
  let button = document.getElementById("chevron");
  button.removeAttribute(onmouseenter, addChevronBackgroundHover);
  button.removeAttribute(onmouseleave, removeChevronBackgroundHover);
}

TODO method to switch text icon to open eye
function showEyeIcon() {
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
}

TODO method to switch eye icon to hide eye icon
function showHideEyeIcon() {
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
}
/*

// /* Show date of posts post, used onHoverEnter */
// function showDate(list_position) {
//   let theDate =
//     document.getElementsByTagName("ul")[0].childNodes[list_position]
//       .childNodes[1];
//   theDate.style.opacity = 1;
// }

// /* Hide date of posts post, used onHoverLeave */
// function hideDate(list_position) {
//   let theDate =
//     document.getElementsByTagName("ul")[0].childNodes[list_position]
//       .childNodes[1];
//   theDate.style.opacity = 0;
// }

// plays an audio file on the about page when clicked
function turnOnNarration() {
  if (!document.body.getElementsByClassName("audio").length > 0) {
    document.body.innerHTML +=
      "<audio id='audio-player' preload='auto' src='/media/about_narration.mp3'></audio>";
  }
  let narrationAudio = document.getElementById("audio-player");
  narrationAudio.play();

  let button = document.getElementById("button");
  button.innerHTML =
    "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-stop-circle'><circle cx='12' cy='12' r='10'></circle><rect x='10' y='10' width='4' height='4' fill='currentColor'></rect></svg>";
  // button.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-pause-circle'><circle cx='12' cy='12' r='10'></circle><line x1='10' y1='15' x2='10' y2='9'></line><line x1='14' y1='15' x2='14' y2='9'></line></svg>"
  button.removeEventListener("click", () => {
    turnOnNarration();
  });
  button.addEventListener("click", () => {
    turnOffNarration();
  });
  document
    .getElementById("options-container")
    .addEventListener("mouseleave", () => {
      document.documentElement.style.background = "#0c0c0d";
    });
}

// do the opposite of ^^^ and cleanup
function turnOffNarration() {
  let button = document.getElementById("button");
  let narrationAudio = document.getElementById("audio-player");
  narrationAudio.pause();
  button.innerHTML =
    "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-play-circle'><circle cx='12' cy='12' r='10'></circle><polygon points='10 8 16 12 10 16 10 8'></polygon></svg>";
  button.removeEventListener("click", () => {
    turnOffNarration();
  });
  button.addEventListener("click", () => {
    turnOnNarration();
  });
  document
    .getElementById("options-container")
    .addEventListener("mouseleave", () => {
      document.documentElement.style.background = "#0c0c0d";
    });
}

/*
SECTIONS
*/

/* Swich to About mode */
// function showAbout() {
//   if (currentMode == "posts") {
//     document.getElementById("pen").classList.remove("hidden");
//     document.getElementById("pen").style.marginRight = "0px";
//     desc.style.minWidth = "";
//     desc.style.height = null;
//   }
//   if (currentMode == "home") {
//     document.getElementById("pen").style.marginRight = "0px";
//     desc.style.cursor = "default";
//     desc.removeAttribute("title");
//   }

//   if (expandedText) {
//     document.getElementById("content-container").style.marginLeft = null;
//     desc.style.margin = "22px 0 27px";
//   }
//   // document.body.classList.add('darken');
//   // playXylophoneSound("g");
//   currentMode = "about";
//   // replace terminal chevron with back button
//   let button = document.getElementById("chevron");
//   button.innerText = "<";
//   button.setAttribute("title", "Back to Home");
//   button.style.cursor = "pointer";
//   // TODO blinkingh cursor breaks

//   // remove text
//   let text = document.getElementById("text");
//   text.innerHTML = " ";

//   // show 'back'
//   window.setTimeout(function () {
//     terminalText(aboutString);
//   }, 2000);

//   // show new icons
//   // if (document.getElementById("options-container") == null) {
//   //   document.getElementById(
//   //     "top-part"
//   //   ).innerHTML += `<div id='options-container' class='options'>
//   //       <span id='button' class='first-option' title='Turn on narration' onmouseenter={tintBackgroundTo('251101')}>
//   //         <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'></circle><polygon points='10 8 16 12 10 16 10 8'></polygon></svg>
//   //       </span>
//   //     </div>`;
//   //   // document.getElementById("top-part").innerHTML +=
//   //   //   "<div id='options-container' class='options'><span id='button' class='first-option' title='Turn on narration' onmouseenter={tintBackgroundTo('251101')}><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-play-circle'><circle cx='12' cy='12' r='10'></circle><polygon points='10 8 16 12 10 16 10 8'></polygon></svg></span></div>";
//   // } else {
//   //   document.getElementById("options-container").classList.remove("hidden");
//   // }

//   // document
//   //   .getElementById("options-container")
//   //   .addEventListener("mouseleave", () => {
//   //     document.documentElement.style.background = "#0c0c0d";
//   //   });
//   // document.getElementById("button").addEventListener("click", () => {
//   //   turnOnNarration();
//   // });
//   translucentMode();

//   desc.style.minHeight = "204px";
//   desc.style.margin = "20px 0 10px";
//   desc.style.maxWidth = "325px";
//   desc.style.textAlign = "justify";
//   // TODO write an about section
//   desc.innerHTML = aboutText;
//   // desc.style.margin = "30px 0px 0px 0px";
//   document.getElementById("socials").style.padding = "16px 0 0 0";
//   document.getElementById("about").classList.add("hidden");
// }

/* Switch to posts mode*/
// function showPosts() {
//   if (currentMode == "about") {
//     document.getElementById("about").classList.remove("hidden");
//     // document.body.classList.remove('darken');
//     desc.style.minHeight = "";
//     desc.style.maxWidth = "";
//     desc.style.textAlign = null;
//     document.getElementById("pen").style.marginRight = "14px";
//     // desc.style.minHeight="204px";
//     // document.getElementById("socials").style.padding = "26px 0 0 0";
//   }
//   if (currentMode == "home" && expandedText) {
//     desc.style.margin = "23px 0 26px";
//   }
//   if (currentMode == "home") {
//     desc.style.cursor = "default";
//     desc.removeAttribute("title");
//   }
//   if (expandedText) {
//     document.getElementById("content-container").style.marginLeft = null;
//     desc.removeAttribute("title");
//     desc.style.margin = "22px 0 27px";
//   }
//   desc.style.minWidth = "300px";
//   desc.style.height = "204px";
//   desc.innerText = "";
//   // playXylophoneSound("f");
//   // if (currentMode == "about") {
//   //   let options = document.getElementById("options-container");
//   //   options.classList.add("hidden");
//   // }
//   currentMode = "posts";
//   let button = document.getElementById("chevron");
//   button.innerText = "<";
//   button.setAttribute("title", "Back to Home");
//   button.style.cursor = "pointer";
//   // button.setAttribute(onmouseenter, addChevronBackgroundHover);
//   // button.setAttribute(onmouseleave, removeChevronBackgroundHover);
//   // button.style.padding = "0 8px";
//   document.getElementById("pen").classList.add("hidden");
//   // remove text

//   // TODO blinking cursor breaks
//   // remove text
//   desc.innerHTML = " ";
//   desc.style.minWidth = "325px";
//   let text = document.getElementById("text");
//   text.innerHTML = " ";
//   window.setTimeout(function () {
//     terminalText(postsString);
//   }, 2000);
//   // desc.innerHTML=postsListText;
//   desc.innerHTML =
//     "<div style='display: flex; height: 90%; align-items: center; justify-content: center;'>crickets...</div>";
//   translucentMode();
//   // "<ul><li><a onmouseenter={showDate(0)} onmouseleave````````````````````````````````````={hideDate(0)} id='posts-link' href=''>Being a remote developer</a><span class='posts-date'>12/22</span></li><li><a onmouseenter={showDate(1)} onmouseleave={hideDate(1)} id='posts-link' href=''>The Internet isn't fun anymore</a><span class='posts-date'>08/22</span></li>";
// }

/* Switch to Home mode. Default. */
// function showHome() {
//   if (currentMode == "about" || currentMode == "posts") {
//     undoTranslucentMode();
//     // document.body.classList.remove('darken');
//     desc.style.maxWidth = "";
//     document.body.style.height = "328px";
//     document.getElementById("pen").style.marginRight = "14px";
//     desc.style.textAlign = null;
//     // cleanupChevronHoverListeners();
//   }
//   if (expandedText) {
//     compressText();
//   }
//   desc.addEventListener("click", () => {
//     showDetailedHome();
//   });
//   currentMode = "home";
//   // playXylophoneSound("c2");
//   window.setTimeout(function () {
//     terminalText(nameString);
//   }, 2000);
//   let button = document.getElementById("chevron");
//   button.innerText = ">";
//   // if (currentMode == "about") {
//   //   let options = document.getElementById("options-container");
//   //   options.classList.add("hidden");
//   // }
//   document.getElementById("main-copy").innerHTML = mainCopy;
//   document.getElementById("socials").style.padding = "0";
//   // document.getElementById("pen").classList.remove("hidden");
//   // document.getElementById("about").classList.remove("hidden");
// }

/* Switch to home mode with expanded text and bg*/
// function showDetailedHome() {
//   if (currentMode == "home" && !expandedText) {
//     expandedText = true;
//     translucentMode();
//     document.getElementById("right-container").style.paddingRight = "2px";
//     document.getElementById("main-copy").style.maxWidth = "311px";
//     let button = document.getElementById("chevron");
//     button.innerText = "<";
//     desc.title = "Learn Less";
//     desc.style.margin = "22px 0px 26.4px;";
//     desc.innerHTML = detailedHomeText;
//     desc.style.cursor = `url("media/check-cursor.svg"), pointer`;
//     document.getElementById("content-container").classList.add("flexbox-util");
//     desc.addEventListener("click", () => {
//       compressText();
//     });
//   }
// }

// function compressText() {
//   if (currentMode == "home" && expandedText) {
//     expandedText = false;
//     document.getElementById("right-container").style.paddingRight = null;
//     document.getElementById("main-copy").style.maxWidth = "340px";
//     undoTranslucentMode();
//     desc.title = "Learn More Again";
//     desc.style.margin = "22px 0 27px";
//     desc.innerHTML = compressedText;
//     desc.style.cursor = "url('media/question-cursor.svg'), help";
//     document.getElementById("content-container").style.marginLeft = null;
//     document
//       .getElementById("content-container")
//       .classList.remove("flexbox-util");
//     desc.addEventListener("click", () => {
//       showDetailedHome();
//     });
//   }
// }

/*
MAIN!
*/

function main() {
  document.body.style.backgroundColor = "#ffffff00";
  startBackgroundAnimation();

  // init background behavior for links
  // document.getElementById("linkedin").addEventListener("mouseleave", () => {
  //   document.documentElement.style.background = "#0c0c0d";
  // });
  // document
  //   .getElementById("right-container")
  //   .addEventListener("mouseleave", () => {
  //     document.documentElement.style.background = "#0c0c0d";
  // });

  // document.body.addEventListener("animationend", (event) => {
  window.setTimeout(function () {
    document.getElementById("top").classList.remove("hidden");
    // document.getElementById("bottom").classList.remove('hidden');
    document.getElementById("writing").classList.remove("hidden");
    document.getElementById("previously").classList.remove("hidden");
  }, 1800);

  // write the first word immediately
  // terminalText(helloWorld);

  // write name after 3 seconds
  // window.setTimeout(function () {
  //   terminalText(nameString);
  // }, 3000);

  // make cursor blink every half second, after 5.5s
  // window.setTimeout(function () {
  //   window.setInterval(blinkingCursor, 500);
  // }, 5500);

  // make links accessible to avoid animation issues oop
  // window.setTimeout(function () {
  //   document.getElementById("pen").addEventListener("click", () => {
  //     showPosts();
  //   });
  //   document.getElementById("about").addEventListener("click", () => {
  //     showAbout();
  //   });
  // }, 6000);
}

main();
