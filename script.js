"use strict";

var a = 0;

function A(z) {
  document.documentElement.style.background = "#" + z;
}

function B() {
  window.addEventListener("load", function () {
    let b = 5;
    let c = 10;
    let d = 1;
    let e = 1;
    let f = 0.01;
    let g = 0.5;

    let h, i;

    let j, k;

    let l, m;
    let n;
    let o, p;
    let q, r;

    let s;
    let t;

    const u = Math.random;
    const v = Math.floor;
    const w = Math.abs;

    function C(aa, bb) {
      if (typeof bb == "undefined") return aa * u();
      return aa + u() * (bb - aa);
    }

    function D(aa, bb) {
      if (typeof bb == "undefined") return v(aa * u());
      return aa + v(u() * (bb - aa));
    }

    function E(cc) {
      let dd1, ee;
      for (let dd = cc.length - 1; dd >= 1; --dd) {
        dd1 = D(0, dd + 1);
        ee = cc[dd];
        cc[dd] = cc[dd1];
        cc[dd1] = ee;
      }
      return cc;
    }

    function F(dd, ee, ff) {
      this.color = ff ? ff : `hsl(${D(360)},100%,50%)`;
      this.kx = dd;
      this.ky = ee;
      this.kxc = dd - q;
      this.kyc = ee - r;

      this.xc = j / 2 + this.kxc * l;
      this.yc = k / 2 + this.kyc * l;
    }

    F.prototype.fillSquare = function (gg) {
      const side = l - g;
      const hSide = side / 2;

      this.evolColor = gg;
      i.fillStyle = `hsl(${gg.hue}, 100%,${gg.lum}% )`;
      i.fillRect(this.xc - hSide, this.yc - hSide, side, side);
    };

    function G(gg) {
      let hue = gg.hue;
      let dhue = gg.dhue;
      let lum = gg.lum;
      let dlum = gg.dlum;
      let width = gg.width;
      let dWidth = gg.dWidth;

      let ff;
      switch (t) {
        case 0:
          ff = `hsl(${hue},100%,50%)`;
          hue = (hue + dhue) % 360;
          break;
        case 1:
          ff = `hsl(${hue},100%,${lum}%)`;
          lum += dlum;
          if (lum > 80) dlum = -w(dlum);
          if (lum < 40) dlum = w(dlum);
          break;
        case 2:
          ff = `hsl(${hue},100%,${lum}%)`;
          lum += dlum;
          if (lum > 80) dlum = -w(dlum);
          if (lum < 40) dlum = w(dlum);
          hue = (hue + dhue) % 360;
          break;
      }
      width += dWidth;
      if (width > 2.5) dWidth = -w(dWidth);
      if (width < 0.5) dWidth = w(dWidth);

      return {
        hue: hue,
        dhue: dhue,
        lum: lum,
        dlum: dlum,
        width: width,
        dWidth: dWidth,
        color: ff,
      };
    }

    let x;

    {
      let hh = 0;
      let ii;
      let jj, gg;

      x = function (kk) {
        let ll;
        let ii;
        let mm;

        ii = s.pop();
        if (ii && ii.event == "reset") hh = 0;
        if (ii && ii.event == "click") hh = 0;
        window.requestAnimationFrame(x);

        ll = performance.now();
        
        let nn = 20 * f;
        do {
          switch (hh) {
            case 0:
              if (J()) {
                ++hh;
                gg = {};
                gg.hue = D(360);
                gg.dhue = D(2) ? d : 360 - d;
                gg.lum = D(40, 80);
                gg.dlum = D(2) ? -e : e;
                gg.width = C(0.5, 2.5);
                gg.dWidth = 0.1;
                gg = G(gg);
              }
              break;

            case 1:
              jj = n[r][q];
              ii = [jj];
              ++hh;

            case 2:
              if (ii.length == 0) {
                hh += 10;
                break;
              }
              jj = ii.shift();
              if (!jj.evolColor) ++hh;
              else break;

            case 3:
              gg = G(gg);
              jj.group.forEach((oo) => oo.fillSquare(gg));
              mm = new Set();
              jj.group.forEach((oo) => {
                oo.neighbours.forEach((pp) => {
                  if (!pp.evolColor)
                    mm.add(pp.group);
                });
              });

              if (mm.size == 0) {
                --hh;
                break;
              }

              mm = E([...mm]);

              for (let dd = 1; dd < mm.length; ++dd) {
                ii.push([...mm[dd]][0]);
              }
              jj = [...mm[0]][0];
              break;
          }
        } while (
          (hh == 2 || hh == 3) &&
          performance.now() - ll < nn
        );
      };
    }

    function H() {
      let qq, rr, oo;

      n = [];

      for (let ee = 0; ee < p; ++ee) {
        n[ee] = [];
        for (let dd = 0; dd < o; ++dd) {
          n[ee][dd] = new F(dd, ee);
        }
      }

      for (let ee = 0; ee < p; ++ee) {
        for (let dd = 0; dd < o; ++dd) {
          oo = n[ee][dd];
          oo.neighbours = [];
          rr = ee - 1;
          if (rr >= 0) oo.neighbours[0] = n[rr][dd];
          qq = dd + 1;
          if (qq < o) oo.neighbours[1] = n[ee][qq];
          rr = ee + 1;
          if (rr < p) oo.neighbours[2] = n[rr][dd];
          qq = dd - 1;
          if (qq >= 0) oo.neighbours[3] = n[ee][qq];
        }
      }

      for (let ee = 0; ee < p; ++ee) {
        for (let dd = 0; dd < o; ++dd) {
          oo = n[ee][dd];
          if (oo.group) continue;
          oo.group = new Set([oo]);
          I(oo.group, q - oo.kxc, oo.ky);
          I(oo.group, oo.kx, r - oo.kyc);
          I(oo.group, q - oo.kxc, r - oo.kyc);
          I(oo.group, q + oo.kyc, r + oo.kxc);
          I(oo.group, q + oo.kyc, r - oo.kxc);
          I(oo.group, q - oo.kyc, r + oo.kxc);
          I(oo.group, q - oo.kyc, r - oo.kxc);
        }
      }
    }

    function I(hh, dd, ee) {
      if (dd < 0 || ee < 0 || dd >= o || ee >= p) return;
      hh.add(n[ee][dd]);
      n[ee][dd].group = hh;
    }

    function G(gg) {
      let hue = gg.hue;
      let dhue = gg.dhue;
      let lum = gg.lum;
      let dlum = gg.dlum;
      let width = gg.width;
      let dWidth = gg.dWidth;

      let ff;
      switch (t) {
        case 0:
          ff = `hsl(${hue},100%,50%)`;
          hue = (hue + dhue) % 360;
          lum = 50;
          break;
        case 1:
          ff = `hsl(${hue},100%,${lum}%)`;
          lum += dlum;
          if (lum > 80) dlum = -w(dlum);
          if (lum < 40) dlum = w(dlum);
          break;
        case 2:
          ff = `hsl(${hue},100%,${lum}%)`;
          lum += dlum;
          if (lum > 80) dlum = -w(dlum);
          if (lum < 40) dlum = w(dlum);
          hue = (hue + dhue) % 360;
          break;
      }
      width += dWidth;
      if (width > 2.5) dWidth = -w(dWidth);
      if (width < 0.5) dWidth = w(dWidth);

      return {
        hue: hue,
        dhue: dhue,
        lum: lum,
        dlum: dlum,
        width: width,
        dWidth: dWidth,
        color: ff,
      };
    }

    function J() {
      j = window.innerWidth;
      k = window.innerHeight;

      h.width = j;
      h.height = k;
      i.lineJoin = "bevel";
      i.lineCap = "round";

      l = C(b, c);
      m = l / 2;

      r = v(k / l / 2);
      q = v(j / l / 2);
      o = 1 + 2 * q;
      p = 1 + 2 * r;

      if (o < 3 || p < 3) return false;
      i.clearRect(0, 0, j, k);

      t = D(3);
      H();

      return true;
    }

    function K(ii) {
      s.push({ event: "click" });
      document.getElementsByTagName("canvas")[0].removeAttribute("title");
      a += 1;
      if (a <= 9) {
        M(a);
      }
    }

    {
      h = document.createElement("canvas");
      h.style.position = "absolute";
      h.style.zIndex = "-1";
      h.style.opacity = 0.25;
      h.style.transition = "opacity 1s";
      document.documentElement.appendChild(h);
      i = h.getContext("2d");
      h.setAttribute(
        "title",
        "Psst. Hey! Click me."
      );
    }
    h.addEventListener("click", K);
    s = [{ event: "reset" }];
    requestAnimationFrame(x);

    const ss = document.createElement('div');
    ss.id = 'animation-controls';
    ss.className = 'control-panel';

    const tt = document.createElement('div');
    tt.id = 'minimized-controls';
    tt.innerHTML = '!';
    tt.style.cssText = `position:fixed;bottom:20px;right:20px;width:30px;height:30px;display:none;justify-content:center;align-items:center;background:rgba(110,110,110,0.1);color:white;border-radius:4px;cursor:pointer;opacity:0.3;transition:opacity 0.3s ease;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);z-index:1000;`;

    document.body.appendChild(tt);
    document.documentElement.appendChild(ss);

    ss.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-size:12px;opacity:0.7">Pattern Controls</span><svg id="minimize-controls" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="cursor:pointer;opacity:0.6;transition:opacity 0.3s ease"><line x1="5" y1="12" x2="19" y2="12"></line></svg></div><div style="width:100%;height:1px;background:rgba(255,255,255,0.1);margin-bottom:12px"></div><div class="control-group"><label>Square Size</label><div class="control-description">Larger = less pixelated</div><input type="range" id="squareSize" min="5" max="20" value="${b}"></div><div class="control-group"><label>Hue Change</label><div class="control-description">Higher = faster color shifts</div><input type="range" id="hueChange" min="1" max="30" value="${d}"></div><div class="control-group"><label>Lightness Change</label><div class="control-description">Higher = more contrast</div><input type="range" id="lumChange" min="0.1" max="10" step="0.1" value="${e}"></div><div class="control-group"><label>Square Margin</label><div class="control-description">Space between tiles</div><input type="range" id="sqMargin" min="0" max="3" step="0.1" value="${g}"></div><div class="control-group"><label>Animation Speed</label><div class="control-description">Higher = faster animation</div><input type="range" id="animSpeed" min="0.01" max="1" step="0.01" value="${f}"></div><div class="control-group"><label>Brightness</label><div class="control-description">Higher = Brighter</div><input type="range" id="canvasOpacity" min="0" max="100" value="25"></div><div class="reset-controls"><button id="reset-default" title="Reset">Reset</button><button id="randomize" title="Randomize">Randomize</button></div>`;

    document.getElementById('minimize-controls').addEventListener('click', () => {
      ss.style.display = 'none';
      tt.style.display = 'flex';
    });

    tt.addEventListener('mouseenter', () => {
      tt.style.opacity = '1';
    });

    tt.addEventListener('mouseleave', () => {
      tt.style.opacity = '0.1';
    });

    tt.addEventListener('click', () => {
      ss.style.display = 'block';
      tt.style.display = 'none';
    });

    document.getElementById('squareSize').addEventListener('input', (uu) => {
      b = parseInt(uu.target.value);
      c = b + 5;
      L();
    });

    document.getElementById('hueChange').addEventListener('input', (uu) => {
      d = parseInt(uu.target.value);
      L();
    });

    document.getElementById('lumChange').addEventListener('input', (uu) => {
      e = parseFloat(uu.target.value);
      L();
    });

    document.getElementById('animSpeed').addEventListener('input', (uu) => {
      f = parseFloat(uu.target.value);
    });

    document.getElementById('sqMargin').addEventListener('input', (uu) => {
      g = parseFloat(uu.target.value);
      L();
    });

    document.getElementById('canvasOpacity').addEventListener('input', (uu) => {
      const vv = parseInt(uu.target.value) / 100;
      document.getElementsByTagName('canvas')[0].style.opacity = vv;
    });

    document.getElementById('reset-default').addEventListener('click', () => {
        window.location.reload();
    });

    document.getElementById('randomize').addEventListener('click', () => {
        b = Math.floor(Math.random() * 15) + 5;
        c = b + 5;
        document.getElementById('squareSize').value = b;
        
        d = Math.floor(Math.random() * 29) + 1;
        document.getElementById('hueChange').value = d;
        
        e = Math.round((Math.random() * 9.9 + 0.1) * 10) / 10;
        document.getElementById('lumChange').value = e;
        
        g = Math.round(Math.random() * 30) / 10;
        document.getElementById('sqMargin').value = g;
        
        f = Math.round(Math.random() * 99 + 1) / 100;
        document.getElementById('animSpeed').value = f;
        
        L();
    });

    window.addEventListener('keydown', function(ii) {
        if (ii.code === 'Space' && 
            !['INPUT', 'TEXTAREA'].includes(ii.target.tagName) && 
            !(ii.target.getAttribute('contenteditable') === 'true')) {
            ii.preventDefault();
            K(ii);
        }
    });

    window.addEventListener('keydown', function(ii) {
        if (!['INPUT', 'TEXTAREA'].includes(ii.target.tagName) && 
            !(ii.target.getAttribute('contenteditable') === 'true')) {
            
            const ww = {
                'q': 'c',
                'w': 'd',
                'e': 'e',
                'r': 'f',
                't': 'g',
                'y': 'a',
                'u': 'b',
                'i': 'c2'
            };

            const xx = ii.key.toLowerCase();
            if (ww[xx]) {
                const yy = document.getElementById(`audio-player-${ww[xx]}`);
                if (yy) {
                    yy.volume = 0.15;
                    yy.currentTime = 0;
                    yy.play();
                }
            }
        }
    });
  });
}



function L() {
    var zz = document.getElementsByTagName('canvas')[0];
    if (zz) {
        var aaa = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        zz.dispatchEvent(aaa);
    }
}

function M(a) {
  let bbb = ["c", "d", "e", "f", "g", "a", "b", "c2"];
  let ccc = document.getElementById("audio-player");
  ccc.volume = 0.15;

  if (a <= 8) {
    if (a == 1) {
      ccc.play();
    }
    else {
      var ddd = bbb[a - 1];
      ccc.setAttribute("src", `media/xylophone/${ddd}.wav`);
      ccc.play();
    }
  }
  else {
    document.getElementsByTagName("audio")[0].remove();
  }
}

function N() {
  document.getElementsByTagName("canvas")[0].remove();
}

function O() {
  if (!document.body.getElementsByClassName("audio").length > 0) {
  let eee = document.getElementById("audio-player");
  eee.play();
  }

  let fff = document.getElementById("button");
  fff.innerHTML =
    "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-stop-circle'><circle cx='12' cy='12' r='10'></circle><rect x='10' y='10' width='4' height='4' fill='currentColor'></rect></svg>";
  fff.removeEventListener("click", () => {
    O();
  });
  fff.addEventListener("click", () => {
    P();
  });
  document
    .getElementById("options-container")
    .addEventListener("mouseleave", () => {
      document.documentElement.style.background = "#0c0c0d";
    });
}

function P() {
  let fff = document.getElementById("button");
  let eee = document.getElementById("audio-player");
  eee.pause();
  fff.innerHTML =
    "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-play-circle'><circle cx='12' cy='12' r='10'></circle><polygon points='10 8 16 12 10 16 10 8'></polygon></svg>";
  fff.removeEventListener("click", () => {
    P();
  });
  fff.addEventListener("click", () => {
    O();
  });
  document
    .getElementById("options-container")
    .addEventListener("mouseleave", () => {
      document.documentElement.style.background = "#0c0c0d";
    });
}

let y;

document.querySelectorAll('.company-box').forEach(ggg => {
    ggg.addEventListener('mouseenter', (iii) => {
        if (y) {
            clearTimeout(y);
        }
        
        document.getElementById('experience-and-job-title').textContent = iii.currentTarget.title;
    });

    ggg.addEventListener('mouseleave', (iii) => {
        y = setTimeout(() => {
            document.getElementById('experience-and-job-title').textContent = 'Experience';
        }, 400);
    });
});

function Q() {
  document.body.style.backgroundColor = "#ffffff00";
  B();

  window.setTimeout(function () {
    document.getElementById("top").classList.remove("hidden");
    document.getElementById("writing").classList.remove("hidden");
    document.getElementById("previously").classList.remove("hidden");
  }, 1800);

  document.getElementById("audio-player").volume = 0.15;
}

Q();

function R() {
    const hhh = document.getElementById('animation-controls');
    const iii = document.getElementById('minimized-controls');
    if (hhh.style.display === 'none' || !hhh.style.display) {
        hhh.style.display = 'block';
        iii.style.display = 'none';
    } else {
        hhh.style.display = 'none';
        iii.style.display = 'flex';
    }
}
