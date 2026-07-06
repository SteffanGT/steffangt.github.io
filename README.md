# Portfolio site

A file-explorer-style portfolio: project names on the left, a 3D model
viewer + description + file list on the right. Plain HTML/CSS/JS, no
build step required.

## What's in here

```
index.html          the whole page (header, intro, explorer, about, contact)
css/style.css        all styling
js/script.js          project data + interaction logic
assets/models/        empty — for your own .glb files later (see below)
```

## About the 3D model

The car in `rl-racecar` is embedded via a **Sketchfab iframe**, not a
self-hosted file — this is a McLaren model by [vecarz on
Sketchfab](https://sketchfab.com/heynic), embedded under Sketchfab's
standard embed terms (attribution link included, as required).

I didn't bundle the raw `.glb` for it, for two reasons:
- redistributing someone else's 3D model file isn't something to do
  without checking their license terms directly
- the Sketchfab embed already works great on GitHub Pages with zero
  extra hosting, so there's no need to

The embed is genuinely a fine long-term option if you're happy with a
fixed viewer (drag to orbit, Sketchfab's own UI chrome). If you want the
part-by-part assembly / drive-off animations we talked about, you'll
need to self-host a `.glb` you have rights to and drive it with
Three.js — see "Going further" below.

## Deploying to GitHub Pages

1. Create a new GitHub repo (or use an existing one).
2. Copy all the files in this folder into the repo root (keep the folder
   structure — `css/`, `js/`, `assets/` should sit next to `index.html`).
3. Commit and push.
4. In the repo: **Settings → Pages → Source**, select the branch (usually
   `main`) and `/ (root)`, save.
5. Your site will be live at `https://yourusername.github.io/repo-name/`
   within a minute or two.

No build step, no `npm install` — it's just static files.

## Editing content

Everything project-related lives in the `projects` array at the top of
`js/script.js`. To add a new project:

```js
{
  slug: "my-project",
  name: "my-project",
  active: true,
  title: "My project",
  tags: ["tag-one", "tag-two"],
  desc: "A sentence or two about it.",
  links: [{ label: "view repo", href: "https://github.com/you/repo" }],
  viewer: `<iframe ...></iframe>`,  // or a <canvas> if self-hosting, see below
  credit: `optional attribution HTML`,
  files: [
    { name: "main.py", size: "3 kb", icon: "ti-file-code", preview: "some code..." }
  ]
}
```

Set `active: false` (or omit `title`/`files`/etc.) on any project you
haven't written up yet — it'll show as a locked folder with an empty
state instead of breaking.

## A note on GitHub Pages + large files

If you do start adding your own `.glb` files:

- Keep individual files well under GitHub's 100MB hard limit — ideally a
  few MB. Compress with [gltf-transform](https://gltf-transform.dev/) or
  Blender's Draco export option.
- **Don't use Git LFS** for files that need to load in the browser —
  GitHub Pages serves the LFS pointer text file instead of the real
  binary, which silently breaks the model. Just commit compressed
  `.glb` files normally.

## Going further: self-hosting a model with Three.js

To replace the Sketchfab embed with a model you control (needed for the
assembly/drive-off animation idea):

1. Put your compressed `.glb` in `assets/models/`.
2. Add Three.js via CDN in `index.html`, e.g.:
   ```html
   <script type="importmap">
   { "imports": { "three": "https://cdn.jsdelivr.net/npm/three@0.164.0/build/three.module.js",
                  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.164.0/examples/jsm/" } }
   </script>
   ```
3. Swap that project's `viewer` field for a `<canvas id="rl-racecar-canvas"></canvas>`.
4. In a new module script, load the model with `GLTFLoader`, render it
   into that canvas, and animate parts in with `AnimationMixer` (if
   authored in Blender) or a tweening library like GSAP.

Happy to help build that step out in detail once you've got a model
you're ready to self-host.
