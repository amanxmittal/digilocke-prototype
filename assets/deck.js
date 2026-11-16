/* ============================================================
   DECK MODE — Presentation / Slideshow for Review Board
   Displays screens one-by-one in a full-screen overlay with
   navigation controls. Loaded by index.html as a standalone
   script (no modules, no bundler).
   Requirements: 6.1, 6.2, 6.4
   ============================================================ */

/* ---- Deck State ---- */
var deckState = {
  active: false,
  screens: [],           // current screen set [{file, title, subtitle}, ...]
  currentIndex: 0,
  flowName: null,        // display in progress indicator
  lastScrollPosition: 0  // Review Board scroll Y to restore on exit
};

/* ---- Inject Deck CSS (self-contained) ---- */
(function injectDeckStyles() {
  var style = document.createElement('style');
  style.id = 'deck-mode-css';
  style.textContent = ''
    + '.deck-overlay{'
    +   'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;'
    +   'display:flex;align-items:center;justify-content:center;'
    +   'background:rgba(0,0,0,.92);opacity:0;transition:opacity .28s ease;'
    +   'flex-direction:column;'
    + '}'
    + '.deck-overlay.deck-visible{opacity:1;}'
    + '.deck-body{'
    +   'display:flex;align-items:center;justify-content:center;'
    +   'flex:1;width:100%;position:relative;'
    + '}'
    + '.deck-frame-container{'
    +   'position:relative;width:420px;height:880px;'
    +   'border-radius:8px;overflow:hidden;box-shadow:0 8px 60px rgba(0,0,0,.5);'
    +   'background:transparent;'
    +   'transform:scale(var(--deck-scale,0.65));transform-origin:center center;'
    + '}'
    + '.deck-frame-container iframe{'
    +   'width:420px;height:880px;border:0;display:block;'
    + '}'
    + '.deck-nav{'
    +   'position:absolute;top:50%;transform:translateY(-50%);'
    +   'width:48px;height:48px;border-radius:50%;border:none;'
    +   'background:rgba(255,255,255,.15);color:#fff;font-size:22px;'
    +   'cursor:pointer;display:flex;align-items:center;justify-content:center;'
    +   'transition:background .2s,opacity .2s;'
    + '}'
    + '.deck-nav:hover{background:rgba(255,255,255,.28);}'
    + '.deck-nav:focus-visible{outline:2px solid #fff;outline-offset:2px;}'
    + '.deck-nav--prev{left:24px;}'
    + '.deck-nav--next{right:24px;}'
    + '.deck-nav[disabled]{opacity:.25;cursor:default;pointer-events:none;}'
    + '.deck-footer{'
    +   'display:flex;align-items:center;justify-content:center;gap:16px;'
    +   'padding:14px 24px;width:100%;color:rgba(255,255,255,.85);'
    +   'font-size:14px;font-family:"Noto Sans",sans-serif;font-weight:500;'
    + '}'
    + '.deck-progress{flex:1;text-align:center;}'
    + '.deck-exit{'
    +   'background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);'
    +   'color:#fff;border-radius:999px;padding:8px 16px;font-size:13px;'
    +   'font-weight:700;cursor:pointer;white-space:nowrap;'
    +   'transition:background .2s;'
    + '}'
    + '.deck-exit:hover{background:rgba(255,255,255,.22);}'
    + '.deck-exit:focus-visible{outline:2px solid #fff;outline-offset:2px;}'
    /* Responsive scaling for the device frame */
    + '@media(min-height:901px){'
    +   '.deck-frame-container{--deck-scale:0.75;}'
    + '}'
    + '@media(max-height:900px){'
    +   '.deck-frame-container{--deck-scale:0.65;}'
    + '}'
    + '@media(max-height:700px){'
    +   '.deck-frame-container{--deck-scale:0.55;}'
    + '}'
    + '@media(max-width:600px){'
    +   '.deck-frame-container{--deck-scale:0.48;}'
    +   '.deck-nav--prev{left:8px;}'
    +   '.deck-nav--next{right:8px;}'
    + '}';
  document.head.appendChild(style);
})();

/* ---- Helpers ---- */
function _deckGetOverlay() {
  return document.getElementById('deck-overlay');
}

function _deckBuildOverlay() {
  var overlay = document.createElement('div');
  overlay.id = 'deck-overlay';
  overlay.className = 'deck-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Presentation mode');
  overlay.setAttribute('aria-modal', 'true');

  overlay.innerHTML = ''
    + '<div class="deck-body">'
    +   '<button class="deck-nav deck-nav--prev" aria-label="Previous screen" id="deck-prev">&#8592;</button>'
    +   '<div class="deck-frame-container" id="deck-frame-container">'
    +     '<iframe id="deck-iframe" title="Screen preview" loading="eager"></iframe>'
    +   '</div>'
    +   '<button class="deck-nav deck-nav--next" aria-label="Next screen" id="deck-next">&#8594;</button>'
    + '</div>'
    + '<div class="deck-footer">'
    +   '<div class="deck-progress" id="deck-progress"></div>'
    +   '<button class="deck-exit" id="deck-exit" aria-label="Exit Deck Mode">✕ Exit</button>'
    + '</div>';

  document.body.appendChild(overlay);
  return overlay;
}

function _deckUpdateView() {
  if (!deckState.active) return;

  var screen = deckState.screens[deckState.currentIndex];
  if (!screen) return;

  // Update iframe
  var iframe = document.getElementById('deck-iframe');
  if (iframe) {
    iframe.src = 'screens/' + screen.file;
  }

  // Update progress indicator
  var progress = document.getElementById('deck-progress');
  if (progress) {
    var text = (deckState.currentIndex + 1) + ' / ' + deckState.screens.length;
    if (deckState.flowName) {
      text += ' \u00b7 ' + deckState.flowName;
    }
    if (screen.title) {
      text += ' \u00b7 ' + screen.title;
    }
    progress.textContent = text;
  }

  // Update navigation button states (boundary checks)
  var prevBtn = document.getElementById('deck-prev');
  var nextBtn = document.getElementById('deck-next');

  if (prevBtn) {
    if (deckState.currentIndex === 0) {
      prevBtn.setAttribute('disabled', '');
    } else {
      prevBtn.removeAttribute('disabled');
    }
  }

  if (nextBtn) {
    if (deckState.currentIndex === deckState.screens.length - 1) {
      nextBtn.setAttribute('disabled', '');
    } else {
      nextBtn.removeAttribute('disabled');
    }
  }

  // Scale iframe to fit container
  _deckScaleFrame();
}

function _deckScaleFrame() {
  // Scaling is now handled by CSS variable --deck-scale on .deck-frame-container
  // No JS calculation needed — CSS media queries handle responsive sizing
}

/* ---- Public API ---- */

/**
 * Activate Deck Mode.
 * @param {Array} screens - Array of {file, title, subtitle} objects
 * @param {string} [flowName] - Optional flow name for progress indicator
 */
function deckStart(screens, flowName) {
  if (!screens || !screens.length) return;

  // Save scroll position to restore on exit
  deckState.lastScrollPosition = window.scrollY || window.pageYOffset || 0;

  // Set state
  deckState.active = true;
  deckState.screens = screens;
  deckState.currentIndex = 0;
  deckState.flowName = flowName || null;

  // Build or get overlay
  var overlay = _deckGetOverlay();
  if (!overlay) {
    overlay = _deckBuildOverlay();
  }

  // Prevent body scroll
  document.body.style.overflow = 'hidden';

  // Wire up controls
  var prevBtn = document.getElementById('deck-prev');
  var nextBtn = document.getElementById('deck-next');
  var exitBtn = document.getElementById('deck-exit');

  if (prevBtn) {
    prevBtn.onclick = function() { deckPrev(); };
  }
  if (nextBtn) {
    nextBtn.onclick = function() { deckNext(); };
  }
  if (exitBtn) {
    exitBtn.onclick = function() { deckExit(); };
  }

  // Show overlay with transition
  requestAnimationFrame(function() {
    overlay.classList.add('deck-visible');
  });

  // Render first screen
  _deckUpdateView();
}

/**
 * Navigate to the next screen.
 * Boundary check: does nothing if already on the last screen.
 */
function deckNext() {
  if (!deckState.active) return;
  if (deckState.currentIndex >= deckState.screens.length - 1) return;
  deckState.currentIndex++;
  _deckUpdateView();
}

/**
 * Navigate to the previous screen.
 * Boundary check: does nothing if already on the first screen.
 */
function deckPrev() {
  if (!deckState.active) return;
  if (deckState.currentIndex <= 0) return;
  deckState.currentIndex--;
  _deckUpdateView();
}

/**
 * Exit Deck Mode.
 * Removes the overlay and restores the Review Board scroll position.
 */
function deckExit() {
  if (!deckState.active) return;

  var overlay = _deckGetOverlay();
  if (overlay) {
    overlay.classList.remove('deck-visible');
    // Remove after transition
    setTimeout(function() {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 300);
  }

  // Restore body scroll
  document.body.style.overflow = '';

  // Restore scroll position
  window.scrollTo(0, deckState.lastScrollPosition);

  // Reset state
  deckState.active = false;
  deckState.screens = [];
  deckState.currentIndex = 0;
  deckState.flowName = null;
}

/* ---- Viewport resize handler (re-scale frame) ---- */
var _deckResizeTimer;
window.addEventListener('resize', function() {
  if (!deckState.active) return;
  clearTimeout(_deckResizeTimer);
  _deckResizeTimer = setTimeout(_deckScaleFrame, 100);
});

/* ============================================================
   DECK MODE — Keyboard, Touch & Scroll Navigation
   Requirements: 6.3, 6.7
   ============================================================ */

/* ---- ARIA attributes ---- */
/* The overlay built by _deckBuildOverlay() already carries:
   role="dialog", aria-label="Presentation mode", aria-modal="true"
   (set in the _deckBuildOverlay function above). */

/* ---- Keyboard Navigation ---- */
/* Right arrow / Spacebar = next, Left arrow = previous, Escape = exit.
   preventDefault stops page scroll while Deck Mode is active. */
document.addEventListener('keydown', function _deckKeyDown(e) {
  if (!deckState.active) return;

  switch (e.key) {
    case 'ArrowRight':
    case ' ':
      e.preventDefault();
      deckNext();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      deckPrev();
      break;
    case 'Escape':
      e.preventDefault();
      deckExit();
      break;
    default:
      break;
  }
});

/* ---- Touch / Swipe Navigation ---- */
/* Horizontal swipe left (delta < -50px) = next,
   swipe right (delta > 50px) = previous. */
var _deckTouchStartX = 0;

document.addEventListener('touchstart', function _deckTouchStart(e) {
  if (!deckState.active) return;
  _deckTouchStartX = e.changedTouches[0].clientX;
}, { passive: true });

document.addEventListener('touchend', function _deckTouchEnd(e) {
  if (!deckState.active) return;
  var deltaX = e.changedTouches[0].clientX - _deckTouchStartX;
  if (deltaX > 50) {
    deckPrev();
  } else if (deltaX < -50) {
    deckNext();
  }
}, { passive: true });

/* ---- Scroll Prevention (wheel events on overlay) ---- */
/* Prevents the Review Board behind the overlay from scrolling while
   Deck Mode is active. Uses non-passive listener so preventDefault works. */
document.addEventListener('wheel', function _deckWheelBlock(e) {
  if (!deckState.active) return;
  e.preventDefault();
}, { passive: false });

/* ============================================================
   DECK MODE — Launch Modes & Exit Behavior
   Requirements: 6.5, 6.6, 6.8
   ============================================================ */

/**
 * Launch Deck Mode with all screens from the SCREENS array (global launch).
 * Filters out section headers (1-element arrays) and maps to {file, title, subtitle}.
 */
function deckLaunchGlobal() {
  var screens = [];
  for (var i = 0; i < SCREENS.length; i++) {
    if (SCREENS[i].length === 3) {
      screens.push({
        file: SCREENS[i][0],
        title: SCREENS[i][1],
        subtitle: SCREENS[i][2]
      });
    }
  }
  deckStart(screens, null);
}

/**
 * Launch Deck Mode for a specific flow section.
 * @param {number} sectionIndex - Index of the section header in SCREENS
 */
function deckLaunchFlow(sectionIndex) {
  if (sectionIndex < 0 || sectionIndex >= SCREENS.length) return;
  if (SCREENS[sectionIndex].length !== 1) return;

  var flowName = SCREENS[sectionIndex][0];
  var screens = [];

  for (var i = sectionIndex + 1; i < SCREENS.length; i++) {
    // Stop at the next section header
    if (SCREENS[i].length === 1) break;
    screens.push({
      file: SCREENS[i][0],
      title: SCREENS[i][1],
      subtitle: SCREENS[i][2]
    });
  }

  if (screens.length) {
    deckStart(screens, flowName);
  }
}

/**
 * Find the nearest flow section above the current scroll position
 * and launch deck for that section. Used by toolbar button.
 */
function deckLaunchFromToolbar() {
  var secElements = document.querySelectorAll('#grid .sec');
  if (!secElements.length) {
    // Fallback: launch global if no sections found
    deckLaunchGlobal();
    return;
  }

  var scrollY = window.scrollY || window.pageYOffset || 0;
  var nearest = null;

  for (var i = 0; i < secElements.length; i++) {
    var rect = secElements[i].getBoundingClientRect();
    var elTop = rect.top + scrollY;
    if (elTop <= scrollY + 100) {
      nearest = secElements[i];
    }
  }

  // If no section is above current scroll, use the first one
  if (!nearest) {
    nearest = secElements[0];
  }

  // Find the section's text and match it to a SCREENS entry
  var secText = nearest.textContent.replace(/\s*▶$/, '').trim();
  for (var j = 0; j < SCREENS.length; j++) {
    if (SCREENS[j].length === 1 && SCREENS[j][0] === secText) {
      deckLaunchFlow(j);
      return;
    }
  }

  // Fallback: launch global if no match
  deckLaunchGlobal();
}
