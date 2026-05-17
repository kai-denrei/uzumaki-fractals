Yes, Clojure is actually well-suited to this — arguably better than Python for the *iterating* phase. The killer feature is REPL-driven tweaking: you keep the sketch running, re-evaluate `draw` with new constants, and watch the curve morph live without restarting. For mathematical doodles where you're hunting for the right `83.333`, that loop is gold.

The canonical vehicle is **Quil** (Clojure wrapper over Processing). Equivalent to your snippet, plus animation by phase-modulating the inner sine:

```clojure
(ns uzumaki.core
  (:require [quil.core :as q]
            [quil.middleware :as m]))

(defn setup []
  (q/frame-rate 60)
  {:phase 0.0})

(defn update-state [s]
  (update s :phase + 0.002))

(defn draw [{:keys [phase]}]
  (q/background 0)
  (q/translate (/ (q/width) 2) (/ (q/height) 2))
  (q/no-fill)
  (q/stroke 255 255 255 220)
  (q/stroke-weight 0.5)
  (q/begin-shape)
  (doseq [t (range 0 300 0.05)]
    (let [r     (/ (Math/pow t 1.5) (+ t 1000))
          theta (+ (* 0.1 t)
                   (Math/sin (* 0.1 t (Math/sin (* (+ 83.333 phase) t)))))]
      (q/vertex (* 90 r (Math/cos theta))
                (* 90 r (Math/sin theta)))))
  (q/end-shape))

(q/defsketch uzumaki
  :title "uzumaki"
  :size [800 800]
  :setup setup :update update-state :draw draw
  :middleware [m/fun-mode])
```

The interesting parameter to animate is the inner constant (`83.333`) — tiny shifts cause dramatic phase beating between the nested sines, which is where the spiral's "uzumaki" quality lives. Modulating `t`'s starting offset gives a calmer rotation; modulating amplitude gives a breathing pulse.

Honest comparison if you're picking a tool fresh:

- **Quil/Clojure** — best authoring loop, JVM startup tax, decent perf for ~30k points
- **p5.js** — fastest to share, weakest REPL story, ubiquitous
- **GLSL fragment shader** — overkill for a 1D parametric curve; shines for SDF/raymarched fractals, not line plots
- **nannou (Rust)** — best perf and shader integration, slowest iteration
- **Julia + Makie** — closest to your matplotlib instinct, real-time animation is solid, smaller creative-coding community

For *this specific* shape (a parametric 1D curve sampled densely), Quil and p5.js are the two right answers. Shaders only pay off once you move to escape-time fractals, flow fields, or anything where each pixel needs independent computation.

Want me to render an animated version inline so you can see the phase-modulation effect before committing to the Clojure setup?