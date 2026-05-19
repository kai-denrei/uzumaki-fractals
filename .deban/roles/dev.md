---
role: dev
owner: minikai
status: active
last-updated: 2026-05-19
---

# Dev

## Scope
Implementation of the visualisation cabinet: parametric formulas, render loop,
input handling, persistent state, game-mode mechanics, and on-page deployment
artefacts. Everything that runs in the browser tab.

## Decisions
| Date | Decision | Rationale | Linked roles |
|---|---|---|---|
| 2026-05-17 | Single `index.html`, no bundler | One file is trivial to host on Pages, easy to inspect from view-source, and the whole project fits in working memory | [[arch]] |
| 2026-05-18 | Visualization registry pattern (`VIZ.push({...})`) | Each viz declares params, setup, tick, draw — tab nav and slider panel render dynamically from the registry. Adding a new viz = one push call | [[arch]] |
| 2026-05-18 | Auto-fit-to-viewport via bbox max distance | Sparse computation: track `max(|x|,|y|)` during point generation, scale entire array by `safeR / maxDist` if it exceeds 44% of `min(W,H)`. Spirals with extreme params no longer escape the screen | [[ux]] |
| 2026-05-18 | Multiplicative fade for density viz (V9 Clifford, V10 De Jong, V11 Aizawa, V13 Curl) | `globalCompositeOperation = 'multiply'` with a slightly-less-than-white grey vs additive `rgba(5,4,3,α)`. The multiplicative form decays exponentially toward TRUE black, eliminating the visible "envelope" of rarely-visited pixels asymptoting to the bg colour | [[ux]] |
| 2026-05-18 | LaTeX-style formula panel (top-left) with hand-rolled HTML+CSS | No MathJax dependency. STIX Two Text serif, italic gold Greek, stacked fractions via flex column with `border-bottom`. ~80 lines of CSS for the whole math typesetting | [[ux]] |
| 2026-05-18 | Playback-mode multiplier (`m`) passed as 4th tick arg | Each viz's tick receives `m` from a global `modeRate(s, dt)` helper. Bounce = `cos(t·π/6)`, drift = sinusoid noise, forward/loop = 1. One line of integration per viz | [[arch]] |
| 2026-05-18 | Preset keyframe system with Catmull-Rom spline | Linear-with-easing creates visible "rest at each keyframe"; Catmull-Rom passes through every keyframe with continuous velocity. For N=2 fall back to eased linear. Clamp interpolated values to each param's `[min, max]` to handle spline overshoot | [[ux]] |
| 2026-05-18 | CSV export via `navigator.clipboard.writeText` with `execCommand` fallback | One-click copy from the controls panel. Format: `# uzumaki · <viz> · <kanji>\npreset,key1,key2,...\nP1,...\nP2,...\n`. Numbers serialised with `+v.toPrecision(8)` to drop trailing zeros | [[ux]] |
| 2026-05-19 | V15 Game Mode (戯) — exponential pull + chaos drift | Hold WASD pulls each param toward its known calm value at rate 0.5/s exponential; release lets random walk push it away at 0.08·range/s. Calmness = 1/(1+6·CV²) of \|r\| from centroid over 600-frame history. Win = 0.85 sustained for 3s | [[ux]], [[pm]] |
| 2026-05-19 | V16 Match Mode (型) — histogram intersection scoring | 32×32 spatial histogram of attractor positions in `[-1.5, 1.5]²`. Match = Σ min(player, target). Robust to scale/rotation. Pre-bake target hist + visible preview canvas in **one** iteration pass (was two — halved setup CPU) | [[ux]] |
| 2026-05-19 | V16 controls: 4 independent thrusters with gravity | W→a, A→b, S→c, D→d. Hold = up at HOLD_RATE; release = down at DROP_RATE (half hold). Equilibrium at ~33% duty cycle so 4-finger juggling is the game | [[ux]], [[pm]] |
| 2026-05-19 | Target shape in 200×200 preview pane inside controls panel | Earlier 1:1 ghost overlay on the main canvas was cluttering the player's view. Moved to a DPR-aware 200×200 canvas at the top of the controls panel with a gold-accent border. Player gets the full main canvas for their own shape | [[ux]] |

## Dead Ends
<!-- APPEND ONLY. Never delete. -->
| Date | What was tried | Why it failed / was rejected |
|---|---|---|
| 2026-05-18 | Additive fade `rgba(5, 4, 3, α)` over `source-over` for attractor trails | Pixels asymptote to the rgb of the fade colour (the body bg), not to true zero. Rarely-visited pixels settle at a visible grey forming a permanent "envelope" around the bright ribbon. Visible most clearly on V11 Aizawa. Replaced with multiplicative-fade composite that decays to true black |
| 2026-05-18 | V3 drift cycle with explicit "steady" phase (50–150s at full extent) | Felt like the animation paused. User reported it as "too many pauses". Removed steady phase entirely — V3 is now grow ↔ unwind only, never dwells |
| 2026-05-18 | V3 drift with 2–3 random knobs and full-range max-steps | Looked like one knob per cycle moved while the others sat still; the visual fell into repetitive patterns. Bumped to 2–4 knobs per cycle and ~1.4× max-steps |
| 2026-05-19 | V16 paired-key control (W/S share `a`, A/D share `d`) | User wanted each key independent. Refactored to W→a, A→b, S→c, D→d with gravity model. Also let the 4-D parameter space produce richer target variety |
| 2026-05-19 | Full-screen ghost overlay of target attractor in V16 | Two attractors overlaid on the main canvas was visually busy and made it hard to see the player's own shape. Moved the target to a 200×200 preview pane at the top of the controls panel |
| 2026-05-19 | Building target histogram and ghost canvas in two separate passes (60k iterations each, ~140k iter total per setup) | Doubled the CPU cost of "randomize" / round-start. Collapsed into one `renderTargetAndHistogram()` that iterates the Aizawa once and updates both the preview canvas and the spatial histogram per step |

## Lessons
<!-- Distilled principles from Dead Ends. Written to be read cold. -->
- Multiplicative composite fade decays to **true** zero; additive alpha fade asymptotes to the source colour. For density plots where you don't want a grey floor, use `globalCompositeOperation = 'multiply'` with a grey close to white. — from dead end on 2026-05-18
- For "self-modulating" autonomous animations, a steady-state phase between transitions reads as "stopped" even when sub-systems are still updating. Keep visible motion continuous; never rest at full state. — from dead end on 2026-05-18
- When pre-computing both a histogram and a rendered preview from the same trajectory, do them in a single iteration loop. Two loops over 60k iterations is 2× the cost for no gain. — from dead end on 2026-05-19

## Open Questions
- [ ] Should attractors decouple "iter/frame" from "samples for histogram"? Currently V16 uses 1500 iter for both — might be undersampled for accurate match scoring at high d values where the attractor moves quickly. — owner: minikai — since: 2026-05-19
- [ ] Catmull-Rom can produce out-of-range values via overshoot; we clamp to `[min, max]`. Does the clamping introduce visible "stalls" at parameter bounds during a tour, or is it imperceptible? — owner: minikai — since: 2026-05-19

## Assumptions
<!-- Format: - [assumption] — status: untested|validated|invalidated — since: YYYY-MM-DD -->
- The Aizawa attractor stays bounded for all params in the V16 player range. — status: untested — since: 2026-05-19. Counter-evidence would be a visible "blow-up" mid-game; haven't seen one yet but haven't bounded-verified the math.
- Histogram intersection at 32×32 resolution is sensitive enough to distinguish shapes that are obviously different to the human eye. — status: untested — since: 2026-05-19.
- Hold-rate / drop-rate ratio of 2:1 gives a fair but not trivial coordination challenge for V16. — status: untested — since: 2026-05-19. Needs playtest.

## Dependencies
Blocked by:
Feeds into: [[ux]] (every implementation decision has a visible surface), [[devops]] (build artefacts go through cache-bust + push)

## Session Log
<!-- One line per session, newest first -->
- 2026-05-19 — V16 refactor: 4 independent WASD thrusters with gravity; target moved to 200×200 preview pane; V15 entropy gauges → WASD cross on left
- 2026-05-19 — V16 Match Mode born; V15 Game Mode born; histogram intersection scoring; entropy gauges
- 2026-05-18 — 11 new viz tabs added (phyllotaxis, maurer, superformula, lissajous, harmonograph, clifford, dejong, aizawa, chladni, curl-noise, gray-scott); preset keyframe system with Catmull-Rom tour and CSV export; multiplicative fade for density viz; LaTeX-style formula panel
- 2026-05-17 — Initial uzumaki spiral (V1/V2/V3) shipped to GitHub Pages
