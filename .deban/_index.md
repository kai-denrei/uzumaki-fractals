---
project: Uzumaki Fractals
created: 2026-05-17
status: active
mode: solo
stale_threshold_days: 30
---

# Uzumaki Fractals — Index

## Brief
A single-page parametric-spiral visualiser that grew into a 16-tab cabinet of
mathematical visualisations (parametric curves, attractors, fields, plus two
game modes). Single static `index.html`, no bundler, no framework — Canvas 2D
rendering with a Japanese sumi-e aesthetic (cinnabar / gold / bone on void),
installable PWA, deployed to GitHub Pages.

## Active Roles
- [[dev]] — owner: minikai (solo)
- [[ux]] — owner: minikai (solo)
- [[arch]] — owner: minikai (solo)
- [[pm]] — owner: minikai (solo)
- [[qa]] — owner: minikai (solo)
- [[devops]] — owner: minikai (solo)

## Key Decisions
<!-- Cross-role summary, maintained by COMPACT -->
- Visualization registry pattern — each viz declares `{id, ja, short, params, setup, tick, draw}`; tab nav + slider panel render dynamically. See [[arch]].
- Multiplicative fade for density viz (V9–V11, V13) — true-black asymptote vs the additive fade's grey envelope. See [[dev]], [[ux]].
- Histogram intersection (32×32) as shape-similarity metric for V16. See [[dev]].
- Catmull-Rom spline for preset "tour" (≥3 keyframes) — passes through every keyframe with continuous velocity, no rest-at-each. See [[dev]].

## Open Questions (cross-role)
- [ ] Does V16's histogram match stay discerning at 4-parameter freedom, or do many distinct shapes collapse onto similar histograms? — owner: minikai — since: 2026-05-19
- [ ] Should V16 expose a difficulty slider (2 params easy / 3 params medium / 4 params hard)? — owner: minikai — since: 2026-05-19
