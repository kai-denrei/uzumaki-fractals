---
role: arch
owner: minikai
status: active
last-updated: 2026-05-19
---

# Architecture

## Scope
Module boundaries, data flow, state ownership, and the patterns that keep
the single-file app from collapsing under its own weight.

## Decisions
| Date | Decision | Rationale | Linked roles |
|---|---|---|---|
| 2026-05-17 | Single static `index.html`, no bundler, no framework | Whole app fits on Pages with zero build tooling. Reviewable via view-source. Trades reusability for shipping velocity | [[dev]], [[devops]] |
| 2026-05-18 | Visualization registry: `VIZ.push({ id, ja, short, subtitle, index, formula, params, setup, tick, draw })` | Each viz is self-contained; tab nav and slider panel render from this registry. Adding a viz is one push call with no framework code to touch | [[dev]] |
| 2026-05-18 | Per-viz `stateMap[id]` for persistent state between frames | Framework provides `s` to every tick/draw call. State persists across frames within a viz, resets when activate(id) re-runs | [[dev]] |
| 2026-05-18 | `currentParams` is a plain object keyed by param.key, regenerated on each `activate()` | Slider inputs write directly into it; drift systems (V3, V16) mutate it the same way; sequencer overrides it. One source of truth for "what does the renderer see this frame" | [[dev]] |
| 2026-05-18 | Generic playback-mode multiplier `m` threaded through `tick(s, dt, p, m)` | Bounce / forward / loop / drift modes are a single helper `modeRate(s, dt)`. Each viz applies `m` to its primary animated parameter, leaves internal-cycle timers (V2 growth, V3 cycle phase) on raw `dt` | [[dev]] |
| 2026-05-18 | Preset persistence in `localStorage` under one key `uzumaki-presets-v1` containing all viz presets | One JSON blob, ~14KB worst case for all 16 viz × 10 presets × 10 params. Well under the 5MB localStorage quota | [[dev]] |
| 2026-05-19 | Game modes (V15, V16) reuse the same HUD + cross-keypad DOM; viz-specific labels swapped on activate | One DOM tree, two viz tabs feed it. Avoids duplicating overlay markup. `body.mode-game` and `body.mode-match` enable/disable chrome via CSS | [[dev]] |
| 2026-05-19 | Match-mode target rendering merged with histogram pre-computation into one trajectory walk | One iteration over the Aizawa attractor produces both: gold pixels into the visible preview canvas AND increments to the 32×32 spatial histogram. Halves CPU on round-start | [[dev]] |

## Dead Ends
<!-- APPEND ONLY. Never delete. -->
| Date | What was tried | Why it failed / was rejected |
|---|---|---|
| 2026-05-18 | Hard-coded slider DOM with one element per parameter (`#kappa`, `#power`, etc.) | Worked for 3 viz tabs (V1/V2/V3), broke immediately when 11 more viz with different param shapes were added. Refactored to a dynamic-sliders container populated by `renderSliders(viz)` from the active viz's `params` array |
| 2026-05-18 | `body.mode-v1` / `mode-v2` / `mode-v3` classes for the 3 original uzumaki tabs to drive CSS hide/show rules | Stale by V4. Replaced with per-viz `activate(vizId)` that toggles the class only for the cases that still need special behaviour (V3 drift slider dimming, V15/V16 game-mode chrome) |
| 2026-05-19 | Storing target Aizawa as a full-resolution offscreen canvas (W × H) for compositing on the main canvas | Memory and CPU cost scaled with viewport; resize handling was finicky; player's main canvas got cluttered. Replaced with a fixed-size 200×200 preview pane inside the controls panel |

## Lessons
- Don't lock UI elements to specific IDs when content is dynamic. Use `data-` attributes and let JS look them up at render time. — from dead end on 2026-05-18
- Body-class flags are fine for runtime mode switching, but each one is a coupling point with every CSS rule that reads it. Keep their count and scope small. — from dead end on 2026-05-18
- Coupling a UI element's render resolution to viewport size is an anti-pattern when the element doesn't fill the viewport. Render the picture at the picture's size. — from dead end on 2026-05-19

## Open Questions
- [ ] At what point is the registry pattern hitting its scalability ceiling? 16 viz today; the file is ~3500 lines. 25 viz would probably need extraction to per-viz modules. — owner: minikai — since: 2026-05-19
- [ ] Should V3 drift, V15 chaos, and V16 keys all be unified into one "param-modulator" abstraction? Right now they're three separate code paths writing to `currentParams`. — owner: minikai — since: 2026-05-19

## Assumptions
- Single-file architecture remains viable up to ~20 visualisations. Beyond that, file size hurts read-time-to-comprehension. — status: untested — since: 2026-05-19
- The browser's render loop at 60 fps is sufficient for all 16 viz simultaneously (only one active at a time). Heavy viz like reaction-diffusion or curl-noise can stay under 16ms/frame on a Mac Mini M4. — status: validated — since: 2026-05-18 (measured at install time)

## Dependencies
Blocked by:
Feeds into: [[dev]], [[ux]], [[devops]]

## Session Log
- 2026-05-19 — Game-mode DOM sharing; merged target-render + histogram into single pass
- 2026-05-18 — Registry pattern; per-viz stateMap; playback-mode multiplier; localStorage preset persistence
- 2026-05-17 — Single-file decision
