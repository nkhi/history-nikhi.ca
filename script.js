"use strict";

// How many times the user has clicked the background
var panelCount = 0;

/* Change background of the html element to hexString */
function tintBackgroundTo(hexString) {
  document.documentElement.style.background = "#" + hexString;
}

/* Instantiate a new canvas that fills in the background with a cool fractal */
function startBackgroundAnimation() {
  window.addEventListener("load", function () {
    let sqWidthMin = 5; // length of square side 5..sqWidthMax
    let sqWidthMax = 10; // length of square side sqWidthMin..50
    let DHUE = 1; // integer 1-10 - hue change by step
    let DLUM = 1; // 0.1 - 5 - lightness change by step
    let SPEED = 0.01; // 0 to 100
    let MARGIN = 0.5; // black marging around each square

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
        
        // Modify this loop to use SPEED as a multiplier
        // Lower SPEED = more iterations = faster animation
        let maxTime = 20 * SPEED; // This will make higher values = slower animation
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
          performance.now() - tinit < maxTime
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
      // canv.style.cursor = "url('media/cursor/arrow.svg'), auto";
      document.documentElement.appendChild(canv);
      ctx = canv.getContext("2d");
      canv.setAttribute(
        "title",
        "Psst. Hey! Click me."
      );
      canv.setAttribute('data-umami-event', "Clicked Background Mosaic")
    }
    canv.addEventListener("click", mouseClick); // just for initial position
    events = [{ event: "reset" }];
    requestAnimationFrame(animate);

    // Add control panel
    const controlPanel = document.createElement('div');
    controlPanel.id = 'animation-controls';
    controlPanel.className = 'control-panel';

    // Create minimized indicator
    const minimizedIndicator = document.createElement('div');
    minimizedIndicator.id = 'minimized-controls';
    minimizedIndicator.innerHTML = '!';
    minimizedIndicator.style.cssText = `position:fixed;bottom:20px;right:20px;width:30px;height:30px;display:none;justify-content:center;align-items:center;background:rgba(110,110,110,0.1);color:white;border-radius:4px;cursor:pointer;opacity:0.3;transition:opacity 0.3s ease;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);z-index:1000;`;

    // Append both elements to document
    document.body.appendChild(minimizedIndicator);
    document.documentElement.appendChild(controlPanel);

    // Add the control panel HTML content
    controlPanel.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-size:12px;opacity:0.7">Pattern Controls</span><svg id="minimize-controls" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="cursor:pointer;opacity:0.6;transition:opacity 0.3s ease"><line x1="5" y1="12" x2="19" y2="12"></line></svg></div><div style="width:100%;height:1px;background:rgba(255,255,255,0.1);margin-bottom:12px"></div><div class="control-group"><label>Square Size</label><div class="control-description">Larger = less pixelated</div><input type="range" id="squareSize" min="5" max="20" value="${sqWidthMin}"></div><div class="control-group"><label>Hue Change</label><div class="control-description">Higher = faster color shifts</div><input type="range" id="hueChange" min="1" max="30" value="${DHUE}"></div><div class="control-group"><label>Lightness Change</label><div class="control-description">Higher = more contrast</div><input type="range" id="lumChange" min="0.1" max="10" step="0.1" value="${DLUM}"></div><div class="control-group"><label>Square Margin</label><div class="control-description">Space between tiles</div><input type="range" id="sqMargin" min="0" max="3" step="0.1" value="${MARGIN}"></div><div class="control-group"><label>Animation Speed</label><div class="control-description">Higher = faster animation</div><input type="range" id="animSpeed" min="0.01" max="1" step="0.01" value="${SPEED}"></div><div class="control-group"><label>Canvas Opacity</label><div class="control-description">Overall visibility of the background pattern</div><input type="range" id="canvasOpacity" min="0" max="100" value="25"></div><div class="reset-controls"><button id="reset-default" title="Reset">Reset</button><button id="randomize" title="Randomize">Randomize</button></div>`;

    // Add minimize/maximize event listeners
    document.getElementById('minimize-controls').addEventListener('click', () => {
      controlPanel.style.display = 'none';
      minimizedIndicator.style.display = 'flex';
    });

    minimizedIndicator.addEventListener('mouseenter', () => {
      minimizedIndicator.style.opacity = '1';
    });

    minimizedIndicator.addEventListener('mouseleave', () => {
      minimizedIndicator.style.opacity = '0.1';
    });

    minimizedIndicator.addEventListener('click', () => {
      controlPanel.style.display = 'block';
      minimizedIndicator.style.display = 'none';
    });

    // Add event listeners for controls
    document.getElementById('squareSize').addEventListener('input', (e) => {
      sqWidthMin = parseInt(e.target.value);
      sqWidthMax = sqWidthMin + 5;
      triggerCanvasClick();
    });

    document.getElementById('hueChange').addEventListener('input', (e) => {
      DHUE = parseInt(e.target.value);
      triggerCanvasClick();
    });

    document.getElementById('lumChange').addEventListener('input', (e) => {
      DLUM = parseFloat(e.target.value);
      triggerCanvasClick();
    });

    document.getElementById('animSpeed').addEventListener('input', (e) => {
      SPEED = parseFloat(e.target.value);
    });

    document.getElementById('sqMargin').addEventListener('input', (e) => {
      MARGIN = parseFloat(e.target.value);
      triggerCanvasClick();
    });

    document.getElementById('canvasOpacity').addEventListener('input', (e) => {
      const opacity = parseInt(e.target.value) / 100;
      document.getElementsByTagName('canvas')[0].style.opacity = opacity;
    });

    // Add this event listener with the other control listeners
    document.getElementById('reset-default').addEventListener('click', () => {
        window.location.reload();
    });

    // Add randomize button functionality
    document.getElementById('randomize').addEventListener('click', () => {
        // Randomize square size (5-20)
        sqWidthMin = Math.floor(Math.random() * 15) + 5;
        sqWidthMax = sqWidthMin + 5;
        document.getElementById('squareSize').value = sqWidthMin;
        
        // Randomize hue change (1-30)
        DHUE = Math.floor(Math.random() * 29) + 1;
        document.getElementById('hueChange').value = DHUE;
        
        // Randomize lightness change (0.1-10)
        DLUM = Math.round((Math.random() * 9.9 + 0.1) * 10) / 10;
        document.getElementById('lumChange').value = DLUM;
        
        // Randomize margin (0-3)
        MARGIN = Math.round(Math.random() * 30) / 10;
        document.getElementById('sqMargin').value = MARGIN;
        
        // Randomize animation speed (0.01-1)
        SPEED = Math.round(Math.random() * 99 + 1) / 100;
        document.getElementById('animSpeed').value = SPEED;
        
        // Trigger canvas redraw twice to ensure animation restarts
        triggerCanvasClick();
    });

    // Add event listener for spacebar
    window.addEventListener('keydown', function(event) {
        // Check if the pressed key is spacebar and we're not in an input/textarea/contenteditable element
        if (event.code === 'Space' && 
            !['INPUT', 'TEXTAREA'].includes(event.target.tagName) && 
            !(event.target.getAttribute('contenteditable') === 'true')) {
            event.preventDefault(); // Prevent page scrolling
            mouseClick(event);  // Use the existing mouseClick function
        }
    });

    // Add keyboard xylophone controls
    window.addEventListener('keydown', function(event) {
        if (!['INPUT', 'TEXTAREA'].includes(event.target.tagName) && 
            !(event.target.getAttribute('contenteditable') === 'true')) {
            
            const keyToNote = {
                'q': 'c',
                'w': 'd',
                'e': 'e',
                'r': 'f',
                't': 'g',
                'y': 'a',
                'u': 'b',
                'i': 'c2'
            };

            const key = event.key.toLowerCase();
            if (keyToNote[key]) {
                const audioPlayer = document.getElementById(`audio-player-${keyToNote[key]}`);
                if (audioPlayer) {
                    audioPlayer.volume = 0.15;
                    audioPlayer.currentTime = 0; // Reset the audio to start
                    audioPlayer.play();
                }
            }
        }
    });
  }); // window load listener
}



function triggerCanvasClick() {
    var canvas = document.getElementsByTagName('canvas')[0];
    if (canvas) {
        var clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        canvas.dispatchEvent(clickEvent);
    }
}

/* The first eight times you click the background, it will play a xylophone sound*/
function playPanelDingSoundEffect(panelCount) {
  let notes = ["c", "d", "e", "f", "g", "a", "b", "c2"];
  let audioPlayer = document.getElementById("audio-player");
  audioPlayer.volume = 0.15;

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

/* HTML sliders like whole numbers, so convert the slider value 0-100 to something between 0-0.4*/
// function opacityMap(inputValue) {
//   return (0.4 / 100) * inputValue;
// }

// <-- 1 Used in the /posts/ section, plays an audio file on the about page when clicked
function turnOnNarration() {
  if (!document.body.getElementsByClassName("audio").length > 0) {
  //   document.body.innerHTML +=
  //     "<audio id='audio-player' preload='auto' src='/media/about_narration.mp3'></audio>";
  // }
  let narrationAudio = document.getElementById("audio-player");
  narrationAudio.play();
  }

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

// 1 -->

// <--- 2 Changing the text of the Experience section

let hoverTimeout;

document.querySelectorAll('.company-box').forEach(box => {
    box.addEventListener('mouseenter', (e) => {
        // Clear any existing timeout
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
        }
        
        // Update the text immediately
        document.getElementById('experience-and-job-title').textContent = e.currentTarget.title;
    });

    box.addEventListener('mouseleave', (e) => {
        // Set a timeout to revert the text after 1 second
        hoverTimeout = setTimeout(() => {
            document.getElementById('experience-and-job-title').textContent = 'Experience';
        }, 400);
    });
});

// 2 --->

function main() {
  document.body.style.backgroundColor = "#ffffff00";
  startBackgroundAnimation();

  window.setTimeout(function () {
    document.getElementById("top").classList.remove("hidden");
    document.getElementById("writing").classList.remove("hidden");
    document.getElementById("previously").classList.remove("hidden");
  }, 1800);

  document.getElementById("audio-player").volume = 0.15;
}

main();

// Add this function
function toggleControlPanel() {
    const panel = document.getElementById('animation-controls');
    const indicator = document.getElementById('minimized-controls');
    if (panel.style.display === 'none' || !panel.style.display) {
        panel.style.display = 'block';
        indicator.style.display = 'none';
    } else {
        panel.style.display = 'none';
        indicator.style.display = 'flex';
    }
}
