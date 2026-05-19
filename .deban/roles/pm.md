---
role: pm
owner: minikai
status: active
last-updated: 2026-05-19
---

# PM

## Scope
Product positioning, scope boundaries, user-facing surface area, and the
questions about "what is this app trying to be?" that affect what should
ship next.

## Decisions
| Date | Decision | Rationale | Linked roles |
|---|---|---|---|
| 2026-05-17 | Open source on GitHub Pages, public repo `kai-denrei/uzumaki-fractals` | Portfolio + collaboration target; the cache-bust toolkit and viz patterns are reusable building blocks for other people's work | [[devops]] |
| 2026-05-18 | Three-tier viz tab structure: uzumaki variants (V1–V3), curves family (V4–V8), attractors / fields (V9–V14) | Each tier has its own pacing and aesthetic. Mixing them in random order would hide the family relationships | [[ux]] |
| 2026-05-19 | Game modes (V15, V16) ship as siblings of the visualisation tabs, not in a separate "game" section | Keeps the discoverability surface flat; player browsing tabs stumbles into a game naturally | [[ux]] |

## Dead Ends
<!-- APPEND ONLY. Never delete. -->
| Date | What was tried | Why it failed / was rejected |
|---|---|---|
| 2026-05-19 | V16 with two paired-key controls (W/S share `a`, A/D share `d`) — a simplified 2D control scheme | User wanted four independent keys mapping to four params. Two paired keys was easier to learn but flattened the design space — only a × d combinations were reachable. Four independent keys with gravity model creates 4D search space that pairs naturally with the 4-parameter Aizawa family |

## Lessons
- Game design where the user explicitly says "make these independent" wins over "but this is easier to learn" — users will work out the harder control scheme if it offers more agency. — from dead end on 2026-05-19

## Open Questions
- [ ] Does V16's histogram match stay discerning at 4-parameter freedom, or do many distinct shapes collapse onto similar histograms? — owner: minikai — since: 2026-05-19
- [ ] Should V16 expose a difficulty slider (2 params easy / 3 params medium / 4 params hard)? Beginners may bounce off 4D coordination. — owner: minikai — since: 2026-05-19
- [ ] Is there an audience for game modes beyond the maker? Are V15/V16 worth their additional 600+ lines, or are they self-indulgent? — owner: minikai — since: 2026-05-19
- [ ] Should the project ship a separate "fractals.dev" landing page with a curated tour vs the current "all 16 tabs from V11" landing? — owner: minikai — since: 2026-05-19

## Assumptions
- Anyone visiting the URL wants to play with parameters, not just see static spirals. — status: validated — since: 2026-05-19 (every iteration has been driven by "I want to tweak this knob differently")
- 16 viz is enough variety to keep someone engaged for a session; not so many that the tab strip becomes intimidating. — status: untested — since: 2026-05-19

## Dependencies
Blocked by:
Feeds into: [[ux]], [[dev]]

## Session Log
- 2026-05-19 — Game-mode positioning (sibling tabs not separate section); V16 4-param decision
- 2026-05-18 — Three-tier viz structure
- 2026-05-17 — Open-source / GitHub Pages decision
