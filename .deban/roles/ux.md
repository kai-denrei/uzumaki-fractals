---
role: ux
owner: minikai
status: active
last-updated: 2026-05-19
---

# UX

## Scope
Aesthetic direction, layout, typography, control affordances, mobile
adaptation, and the look-and-feel of game-mode HUDs. Anything the user sees
or touches.

## Decisions
| Date | Decision | Rationale | Linked roles |
|---|---|---|---|
| 2026-05-17 | Japanese sumi-e aesthetic — cinnabar / gold / bone on void | Distinctive, matches the "uzumaki" theme, multi-pass stroke gives the curve a brushy quality without needing WebGL or shaders | [[dev]] |
| 2026-05-17 | Four-pass stroke render (cinnabar bloom → gold haze → bone halo → bone core) | Single thin line looked flat. Four overlaid strokes at different widths and alphas give depth that feels painted, not plotted | [[dev]] |
| 2026-05-18 | Top-left LaTeX panel for live formula | The math is the soul of each viz; showing it builds intuition about what each slider does. Anchored top-left below romaji-stack, translucent backdrop with cinnabar accent rule | [[dev]] |
| 2026-05-18 | Horizontally-scrollable tab strip for 14+ viz | Tab nav at the top centre would not fit; vertical sidebar would compete with controls panel. Compact horizontal strip with fade-mask edges scrolls cleanly on mobile too | [[dev]] |
| 2026-05-18 | Mobile drawer for controls panel with horizontal grab handle | On phones the panel becomes a bottom drawer collapsible via tap on the title. Grab handle indicates draggability; 4rem peek tall so the title is always visible. iOS safe-area-inset-bottom respected | [[dev]] |
| 2026-05-18 | Playback-mode buttons (⇄ → ↻ ⇢) as a row above the sliders | Mirrors common animation-software conventions. Active mode highlighted cinnabar with glow. Bounce / forward / loop / drift map cleanly to musical phrasing | [[dev]] |
| 2026-05-19 | V15 entropy gauges as 4-tile cross on the LEFT (W & S vertical, A & D horizontal) | The earlier 4-up row inside the top HUD looked like dashboard noise. Cross layout maps spatial key position → spatial gauge position; smaller (24×56px vertical, 56×24px horizontal); entropy wiggle toned from ±5px to ±2px so the eye doesn't fatigue | [[dev]] |
| 2026-05-19 | V16 target shape rendered into a 200×200 preview pane at the top of the controls panel | Full-screen overlay was visually busy; player needs the main canvas for their own shape. Preview is DPR-aware, gold-bordered with a soft halo, only visible in `body.mode-match` | [[dev]] |
| 2026-05-19 | Win overlay (戯/型) is a centred card with large kanji, time, "new best · 新記録" badge | Celebrates the moment of stabilising/matching. Same card structure for both game modes; only the kanji and metric differ | [[dev]] |

## Dead Ends
<!-- APPEND ONLY. Never delete. -->
| Date | What was tried | Why it failed / was rejected |
|---|---|---|
| 2026-05-18 | Speed slider with `step=0.000005` and range `±0.01` for V3/uzumaki | "Even at the lowest setting the animation feels like a hurricane on steroids." The compounding `phase * t` in the inner sine means a tiny per-frame increment produces big visual change at large t. Range tightened to `±0.00001` with `step=0.00000001` and time-normalised against 60fps |
| 2026-05-18 | V3 random drift hitting all 7 params simultaneously every 3–12s | Too dramatic — the spiral never settled enough to read. User wanted "100× more chill". Reduced to 1 knob/cycle with small bounded delta, longer intervals 15–40s, then evolved back to 2–4 knobs once stability was proven |
| 2026-05-19 | V15 entropy gauges as a 4-up row in the top HUD | The wide row of 4 gauges in the HUD made it look like a dashboard. User wanted them smaller and on the left. Moved to cross layout |
| 2026-05-19 | V11 grey "envelope" around the bright Aizawa ribbon | Read as visual noise — distracting from the bright structure. Fixed with multiplicative-fade composite (see [[dev]]) so envelope decays to true black |

## Lessons
<!-- Distilled principles from Dead Ends. Written to be read cold. -->
- For animations driven by `parameter += rate · dt · t`, slider sensitivity needs to be inversely proportional to the largest `t` the formula sees. A rate that feels "slow" at t=1 is hectic at t=300. Always pick slider bounds from the visual output, not from the parameter's apparent magnitude. — from dead end on 2026-05-18
- Auto-drift modes with too many knobs changing at once read as "scrambling" rather than "evolving". One knob at a time, occasionally two, feels like life. All knobs simultaneously feels like glitching. — from dead end on 2026-05-18
- HUD elements that mirror physical key positions (WASD cross) build muscle memory faster than abstract dashboards. Spatial mapping > legend lookup. — from dead end on 2026-05-19

## Open Questions
- [ ] Is the gold ghost preview at 200×200 large enough to perceive shape differences confidently? Could go 240×240 if the controls panel can accept the height. — owner: minikai — since: 2026-05-19
- [ ] On mobile, V15/V16 game modes hide the romaji stack and formula but keep the kanji-mark and tabs visible. Does the cross-keypad fit on a 375px-wide screen? — owner: minikai — since: 2026-05-19

## Assumptions
- Player can read a 32×32 histogram match score and translate it into "this corner of my shape is wrong" via the visible difference between player render and target preview. — status: untested — since: 2026-05-19
- Cinnabar / gold colour distinction is legible to users with red-green colour vision differences (deuteranopia / protanopia). — status: untested — since: 2026-05-19. Worth a contrast pass with simulation tools.

## Dependencies
Blocked by: [[dev]] (UX decisions reach the screen through implementation)
Feeds into: [[pm]] (UX choices shape product positioning)

## Session Log
- 2026-05-19 — V16 4-thruster gravity model; target preview at 200×200; V15 entropy gauges → WASD cross on left with toned-down wiggle
- 2026-05-19 — V15 Game Mode HUD design; V16 Match Mode design; win overlays
- 2026-05-18 — 14-tab strip; LaTeX formula panel; playback-mode buttons; preset keyframe section; mobile drawer
- 2026-05-17 — Initial sumi-e palette and multi-pass stroke
