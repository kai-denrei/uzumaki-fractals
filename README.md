# 渦巻 · Uzumaki

A parametric spiral visualizer driven by nested sines — three modes, real-time sliders, installable PWA.

**Live:** https://kai-denrei.github.io/uzumaki-fractals/

## The formula

```
r(t) = t^p / (t + d)
θ(t) = c·t + sin(c·t · sin(κ·t))
```

κ governs the phase beating between the inner and outer sines. Tiny shifts produce dramatic visual change at large `t` — that's where the spiral's "uzumaki" quality lives.

## Modes

- **V1 · 渦 · parametric** — the full curve with live sliders for every knob.
- **V2 · 種 · germination** — the spiral unfurls from a single dot outward, with a luminous tip marking the growing edge.
- **V3 · 夢 · drift** — quiet starting state, then nudges one parameter at a time over 15–40 second intervals. Periodically re-blooms from a single dot. Set it and watch.

## Tech

Single static HTML file. No bundler, no framework. Canvas 2D for rendering, four overlaid strokes for the sumi-e quality (cinnabar bloom → gold haze → bone halo → white core).

Cache-busting via [the cache-busting toolkit](./scripts/) — every build bumps a token across all asset URLs, and a corner badge gives visual confirmation the bust worked.

## Local dev

```bash
python3 -m http.server 8765
open http://127.0.0.1:8765/
```

Bump the cache token after edits:

```bash
./scripts/bust.sh
```

## Credits

Spiral formula adapted from notes in [`UzumakiFractalsNotes.md`](./UzumakiFractalsNotes.md).
