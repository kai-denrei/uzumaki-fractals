---
role: devops
owner: minikai
status: active
last-updated: 2026-05-19
---

# DevOps

## Scope
Cache busting, build deployment to GitHub Pages, PWA service-worker
registration, and the path from local edit to live URL.

## Decisions
| Date | Decision | Rationale | Linked roles |
|---|---|---|---|
| 2026-05-17 | Cache-busting toolkit installed at project root | Browsers + CDNs cache aggressively; the toolkit adds `?v=<token>` fingerprints, anti-cache meta tags, and a visual badge that flips shape per build for human confirmation | [[dev]] |
| 2026-05-17 | GitHub Pages from `main` branch root | Public, free, fast. Repo `kai-denrei/uzumaki-fractals` set up via `gh repo create --public --source=.` | [[pm]] |
| 2026-05-17 | Direct push to `main` (no PR workflow) | Solo project; CLAUDE.md rules note "Gerald reviews and merges all PRs" but the rule applies to multi-collaborator repos | [[pm]] |
| 2026-05-17 | PWA service worker with NetworkFirst nav + StaleWhileRevalidate static + CacheFirst fonts | Standard caching strategy from the mobile-pwa skill. `offline.html` fallback for uncached navigations | [[dev]] |

## Dead Ends
<!-- APPEND ONLY. Never delete. -->
| Date | What was tried | Why it failed / was rejected |
|---|---|---|

## Lessons

## Open Questions
- [ ] PWA install prompt UX hasn't been tested on iOS or Android in a real install flow. — owner: minikai — since: 2026-05-19

## Assumptions
- GitHub Pages CDN cache TTL is short enough that `?v=<token>` fingerprints reach end users within minutes. — status: validated — since: 2026-05-17 (visual cache-bust badge consistently flips within ~60s of push)

## Dependencies
Blocked by: [[dev]] (deploy what dev builds)
Feeds into: [[pm]] (deploy is the product surface)

## Session Log
- 2026-05-17 — Cache-busting toolkit; GitHub Pages deploy; PWA setup
