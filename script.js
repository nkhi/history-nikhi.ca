"use strict"; // single JS file, not dangerous
var terminal = document.getElementById("console");
var word1 = "hello world";
var word2 = "Nikhi Bhambra";
// var word3 = "Back";
var word4 = "blog";
var word5 = "about";
var letterCount = 0;
var letterDelete = 0;
var visible = true;
var currentMode = "home";
let mainCopy = document.getElementById("main-copy").innerHTML;

// TODO audit event listener queue when moving between pages,
// I suspect all of the control listener's on every page will
// need to be reinvoked when switchng.

// write and delete words
function terminalText(word) {
  let docLoc = document.getElementById("text");

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
            }, 100 * letterCount);
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
            }, 1000 - letterCount * 40);
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
    terminal.className = "console-underscore hidden";
    visible = false;
  } else {
    terminal.className = "console-underscore";
    visible = true;
  }
}

// hover a link, change background color
function tintBackgroundTo(hexString) {
  document.documentElement.style.background = "#" + hexString;
}

// instantiate a new canvas that fills in the background 
function makeBackgroundGoSickoMode() {
  window.addEventListener("load",function() {

    const sqWidthMin = 5; // length of square side 5..sqWidthMax
    const sqWidthMax = 10; // length of square side sqWidthMin..50
    const DHUE = 1; // integer 1-10 - hue change by step
    const DLUM = 1; // 0.1 - 5 - lightness change by step
    const SPEED = 0.01; // 0 to 100
    const MARGIN = 0.5; // black marging around each square
  
    let canv, ctx;    // canvas and context
  
    let maxx, maxy;   // canvas dimensions
  
    let sqWidth, sqRad;  // square side length, quarter of circle radius (1/2 sqWidth)
    let grid;
    let nbx, nby;
    let hnbx, hnby; // number of squares in the half of the width, height of the canvas
  
    let groups;
    let listReachable;
  
  // for animation
  
    let events;
    let colorMode;
  
  // shortcuts for Math.
    const mrandom = Math.random;
    const mfloor = Math.floor;
    const mround = Math.round;
    const mceil = Math.ceil;
    const mabs = Math.abs;
    const mmin = Math.min;
    const mmax = Math.max;
  
    const mPI = Math.PI;
    const mPIS2 = Math.PI / 2;
    const mPIS3 = Math.PI / 3;
    const m2PI = Math.PI * 2;
    const m2PIS3 = Math.PI * 2 / 3;
    const msin = Math.sin;
    const mcos = Math.cos;
    const matan2 = Math.atan2;
  
    const mhypot = Math.hypot;
    const msqrt = Math.sqrt;
  
    const rac3   = msqrt(3);
    const rac3s2 = rac3 / 2;
  
  //------------------------------------------------------------------------
  
  function alea (mini, maxi) {
  // random number in given range
  
    if (typeof(maxi) == 'undefined') return mini * mrandom(); // range 0..mini
  
    return mini + mrandom() * (maxi - mini); // range mini..maxi
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function intAlea (mini, maxi) {
  // random integer in given range (mini..maxi - 1 or 0..mini - 1)
  //
    if (typeof(maxi) == 'undefined') return mfloor(mini * mrandom()); // range 0..mini - 1
    return mini + mfloor(mrandom() * (maxi - mini)); // range mini .. maxi - 1
  }
  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function randomElement(array) {
      return array[intAlea(0, array.length)];
    }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    function arrayShuffle (array) {
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
    return array
    } // arrayShuffle
  
  
  //------------------------------------------------------------------------
  
  function Square (kx, ky, color) {
  
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
    ctx.fillRect (this.xc - hSide, this.yc - hSide, side, side);
  
  } // Square.prototype.fillSquare
  
  //------------------------------------------------------------------------
  
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
  
      return {hue: hue, dhue: dhue,
              lum: lum, dlum: dlum,
              width: width, dWidth: dWidth,
              color: color};
    } // returnColor
  
  //------------------------------------------------------------------------
  
  let animate;
  
  { // scope for animate
  
  let animState = 0;
  let listReachable;
  let currCell, evolColor;
  
  animate = function(tStamp) {
  
    let tinit;
    let event;
    let neighGroups;
  
    event = events.pop();
    if (event && event.event == 'reset') animState = 0;
    if (event && event.event == 'click') animState = 0;
    window.requestAnimationFrame(animate)
  
    tinit = performance.now();
    do {
  
      switch (animState) {
  
        case 0 :
          if (startOver()) {
            ++animState;
            evolColor = {};
            evolColor.hue = intAlea(360);
            evolColor.dhue = intAlea(2) ? DHUE : (360 - DHUE);
            evolColor.lum = intAlea(40,80);
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
  
        case 2 :
          if (listReachable.length == 0) {
            animState += 10; // finished !
            break;
          }
          currCell = listReachable.shift();
          if (!currCell.evolColor) ++animState;
         else break;
  
        case 3 :
          evolColor = nextColor(evolColor);
          currCell.group.forEach (cell => cell.fillSquare(evolColor));
  // make list of all neighbour groups
          neighGroups = new Set();
          currCell.group.forEach (cell => {
            cell.neighbours.forEach (neighCell => {
              if (! neighCell.evolColor) // keep only undrawn cells;
                neighGroups.add(neighCell.group);
            }); // cell.neighbours.forEach
          }); // currCell.group.forEach
  
          if (neighGroups.size == 0){ // no neighbours available
            --animState; // go back and fetch in listReachable
            break;
          }
  
  // put those groups in a random order
          neighGroups = arrayShuffle([...neighGroups]); // change into Array
  
          for (let k = 1; k < neighGroups.length; ++k) {
              listReachable.push([...(neighGroups[k])][0]); // push 1 cell of every group - but first
          }
          currCell = [...(neighGroups[0])][0]; // 1st cell of 1st group is next current cell
          break;
  
      } // switch
    } while ((animState == 2 || animState == 3) && (performance.now() - tinit < SPEED));
  
  } // animate
  } // scope for animate
  
  //------------------------------------------------------------------------
  
  function createGrid() {
  
    let kx1, ky1, cell;
  
    grid = [];
  
    for (let ky = 0; ky < nby; ++ky) {
      grid[ky] = [];
      for (let kx = 0; kx < nbx; ++kx) {
        grid[ky][kx] = new Square (kx, ky);
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
        if (kx1 < nbx ) cell.neighbours[1] = grid[ky][kx1];
        ky1 = ky + 1; // neighbour side 2
        if (ky1 < nby) cell.neighbours[2] = grid[ky1][kx];
        kx1 = kx - 1; // neighbour side 3
        if (kx1 >= 0) cell.neighbours[3] = grid[ky][kx1];
      }; // for kx
    }; // for ky
  
  // create groups
  
    for (let ky = 0; ky < nby; ++ky) {
      for (let kx = 0; kx < nbx; ++kx) {
        cell = grid[ky][kx];
        if (cell.group) continue;
        cell.group = new Set([cell]);  // myself
        addToGroup (cell.group, hnbx - cell.kxc, cell.ky);
        addToGroup (cell.group, cell.kx, hnby - cell.kyc);
        addToGroup (cell.group, hnbx - cell.kxc,  hnby - cell.kyc);
        addToGroup (cell.group, hnbx + cell.kyc, hnby + cell.kxc);
        addToGroup (cell.group, hnbx + cell.kyc, hnby - cell.kxc);
        addToGroup (cell.group, hnbx - cell.kyc, hnby + cell.kxc);
        addToGroup (cell.group, hnbx - cell.kyc, hnby - cell.kxc);
      }; // for kx
    }; // for ky
  
  } // createGrid
  
  //------------------------------------------------------------------------
  function addToGroup (group, kx, ky) {
    if (kx < 0 || ky < 0 || kx >= nbx || ky >= nby) return; // out of grid, do not add
    group.add(grid[ky][kx]);
    grid[ky][kx].group = group;
  } // addToGroup
  
  //------------------------------------------------------------------------
  
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
  
      return {hue: hue, dhue: dhue,
              lum: lum, dlum: dlum,
              width: width, dWidth: dWidth,
              color: color};
    } // returnColor
  
  //------------------------------------------------------------------------
  
  function startOver() {
  
  // canvas dimensions
  
    maxx = window.innerWidth;
    maxy = window.innerHeight;
  
    canv.width = maxx;
    canv.height = maxy;
    ctx.lineJoin = 'bevel';
    ctx.lineCap = 'round';
  
    sqWidth = alea(sqWidthMin, sqWidthMax);
    sqRad = sqWidth / 2;
  
    hnby = mfloor (maxy / sqWidth / 2); // the full array has 2 * hnbx + 1 rows
    hnbx = mfloor (maxx / sqWidth / 2);
    nbx = 1 + 2 * hnbx;
    nby = 1 + 2 * hnby;
  
    if (nbx < 3 || nby < 3) return false;
    ctx.clearRect(0,0,maxx,maxy);
  
    colorMode = intAlea(3);
    createGrid();
  
    return true;
  
  } // startOver
  
  //------------------------------------------------------------------------
  
  function mouseClick (event) {
  
    events.push({event:'click'});;
  
  } // mouseMove
  
  //------------------------------------------------------------------------
  //------------------------------------------------------------------------
  // beginning of execution
  
    {
      canv = document.createElement('canvas');
      canv.style.position="absolute";
      document.body.appendChild(canv);
      ctx = canv.getContext('2d');
      canv.setAttribute ('title','click me');
    } // création CANVAS
    canv.addEventListener('click',mouseClick); // just for initial position
    events = [{event:'reset'}];
    requestAnimationFrame (animate);
  
  }); // window load listener
  console.log("method over");
}

// switch to about mode
function showAbout() {
  if (currentMode == "blog") {
    document.getElementById("pen").classList.remove("hidden");
  }
  currentMode = "about";
  // replace terminal chevron with back button
  let button = document.getElementById("chevron");
  button.innerText = "<";
  button.setAttribute("title", "Back to Home");
  button.style.cursor = "pointer";
  // TODO blinkingh cursor breaks

  // remove text
  let text = document.getElementById("text");
  text.innerHTML = " ";

  // show 'back'
  window.setTimeout(function () {
    terminalText(word5);
  }, 2000);

  // show new icons
  if (document.getElementById("options-container") == null) {
    // document.getElementById("top-part").innerHTML += "<div id='options-container' class='options'><span id='button' class='first-option' title='Turn on narration' onmouseenter={tintBackgroundTo('251101')}><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-play-circle'><circle cx='12' cy='12' r='10'></circle><polygon points='10 8 16 12 10 16 10 8'></polygon></svg></span><span class='second-option' title='Turn off animation' onmouseenter={tintBackgroundTo('251101')}><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' class='feather feather-power'><path d='M18.36 6.64a9 9 0 1 1-12.73 0'></path><line x1='12' y1='2' x2='12' y2='12'></line></svg></span></div>";
    document.getElementById("top-part").innerHTML +=
      "<div id='options-container' class='options'><span id='button' class='first-option' title='Turn on narration' onmouseenter={tintBackgroundTo('251101')}><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-play-circle'><circle cx='12' cy='12' r='10'></circle><polygon points='10 8 16 12 10 16 10 8'></polygon></svg></span></div>";
  } else {
    document.getElementById("options-container").classList.remove("hidden");
  }

  document
    .getElementById("options-container")
    .addEventListener("mouseleave", () => {
      document.documentElement.style.background = "#0c0c0d";
    });
  document.getElementById("button").addEventListener("click", () => {
    turnOnNarration();
  });

  let desc = document.getElementById("desc");
  // TODO write an about section
  desc.innerText =
    "One day, Nikhi will capture the true essence of his being and inscribe it here for all to bear witness. \n\nUntil then, it's empty.";
  desc.style.margin = "30px 0px 0px 0px";
  document.getElementById("socials").style.padding = "26px 0";
  document.getElementById("about").classList.add("hidden");

  // TODO make background do something bonkerz
}

// TODO method to switch to blog mode
function showBlog() {
  if (currentMode == "about") {
    document.getElementById("about").classList.remove("hidden");
  }
  if (currentMode == "about") {
    let options = document.getElementById("options-container");
    options.classList.add("hidden");
  }
  currentMode = "blog";
  let button = document.getElementById("chevron");
  button.innerText = "<";
  button.setAttribute("title", "Back to Home");
  button.style.cursor = "pointer";
  document.getElementById("pen").classList.add("hidden");
  // remove text

  // TODO blinking cursor breaks
  // remove text
  let desc = document.getElementById("desc");
  desc.innerHTML = " ";
  desc.style.minWidth = "276px";
  let text = document.getElementById("text");
  text.innerHTML = " ";
  window.setTimeout(function () {
    terminalText(word4);
  }, 2000);
  desc.innerHTML =
    "<ul><li><a onmouseenter={showDate(0)} onmouseleave={hideDate(0)} id='blog-link' href=''><i>*crickets*</i></a><span class='blog-date'>12/22</span></li><li><a onmouseenter={showDate(1)} onmouseleave={hideDate(1)} id='blog-link' href=''><i>*more crickets*</i></a><span class='blog-date'>08/22</span></li></ul>";
}

// TODO method to switch to home mode
function showHome() {
  window.setTimeout(function () {
    terminalText(word2);
  }, 2000);
  let button = document.getElementById("chevron");
  button.innerText = ">";
  if (currentMode == "about") {
    let options = document.getElementById("options-container");
    options.classList.add("hidden");
  }
  document.getElementById("main-copy").innerHTML = mainCopy;
  document.getElementById("socials").style.padding = "0";
  document.getElementById("pen").classList.remove("hidden");
  document.getElementById("about").classList.remove("hidden");
}

function showDate(list_position) {
    let theDate = document.getElementsByTagName('ul')[0].childNodes[list_position].childNodes[1];
    theDate.style.opacity = 1;
}

function hideDate(list_position) {
    let theDate = document.getElementsByTagName('ul')[0].childNodes[list_position].childNodes[1];
    theDate.style.opacity = 0;
}

// TODO method for narration
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
document
  .getElementById("right-container")
  .addEventListener("mouseleave", () => {
    document.documentElement.style.background = "#0c0c0d";
  });

// write the first word immediately
terminalText(word1);

// write name after 3 seconds
window.setTimeout(function () {
  terminalText(word2);
}, 3000);

// make cursor blink every half second, after 5.5s
window.setTimeout(function () {
  window.setInterval(blinkingCursor, 500);
}, 5500);

// make links accessible to avoid animation issues oop
window.setTimeout(function () {
  document.getElementById("pen").addEventListener("click", () => {
    showBlog();
  });
  document.getElementById("about").addEventListener("click", () => {
    showAbout();
  });
}, 7000);

makeBackgroundGoSickoMode();