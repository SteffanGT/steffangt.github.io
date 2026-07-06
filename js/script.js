/*
  Portfolio project explorer
  ---------------------------
  Each entry in `projects` is a folder in the sidebar.
  Set `active: true` on the ones you've finished writing up — anything
  without a `viewer` will show the "still being assembled" empty state,
  so you can add placeholder folders for work in progress.

  The `viewer` field holds raw HTML for the 3D preview. Right now every
  project uses a Sketchfab iframe embed, which is the easiest way to get
  a model on the page with zero extra hosting or build tooling.

  When you're ready to self-host a model and drive it with Three.js
  (e.g. for the assemble-in / drive-off animations), replace the iframe
  markup for that project with a <canvas id="..."></canvas>, drop your
  .glb file in assets/models/, and initialise a Three.js scene targeting
  that canvas in a separate script — see README.md for a starting point.
*/

const projects = [
  {
    slug: "rl-racecar",
    name: "rl-racecar",
    active: true,
    title: "RL racecar",
    tags: ["reinforcement learning", "PPO", "self-driving"],
    desc: "An agent trained from scratch to drive an F1-style car around procedurally generated circuits, using proximal policy optimization and a reward function shaped around lap time and track position.",
    links: [
      { label: "view repo", href: "https://github.com/yourusername/rl-racecar" }
    ],
    viewer: `<iframe title="Mclaren 35M 2021" allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen
      src="https://sketchfab.com/models/5094ae7c57c544e7832fcd9ca39bba2f/embed?autostart=1&transparent=1&ui_theme=dark&ui_infos=0&ui_watermark_link=0&ui_watermark=0&dnt=1"></iframe>`,
    credit: `<a href="https://sketchfab.com/3d-models/mclaren-35m-2021-wwwvecarzcom-5094ae7c57c544e7832fcd9ca39bba2f" target="_blank" rel="noopener">Mclaren 35M 2021</a> by <a href="https://sketchfab.com/heynic" target="_blank" rel="noopener">vecarz</a> on <a href="https://sketchfab.com" target="_blank" rel="noopener">Sketchfab</a>`,
    files: [
      { name: "README.md", size: "2.1 kb", icon: "ti-file-text", preview: "RL racecar\n\nAn agent trained to drive an F1-style car around\nprocedurally generated tracks using PPO." },
      { name: "train.py", size: "4.8 kb", icon: "ti-file-code", preview: "def train(env, agent, episodes=5000):\n    for ep in range(episodes):\n        obs = env.reset()\n        done = False\n        while not done:\n            action = agent.act(obs)" },
      { name: "environment.py", size: "6.3 kb", icon: "ti-file-code", preview: null },
      { name: "reward_function.py", size: "1.4 kb", icon: "ti-file-code", preview: null },
      { name: "models/policy_net.pth", size: "18.2 mb", icon: "ti-file", preview: null },
      { name: "models/checkpoint_1200.pth", size: "18.2 mb", icon: "ti-file", preview: null },
      { name: "notebooks/lap_time_analysis.ipynb", size: "310 kb", icon: "ti-file-code", preview: null },
      { name: "results/lap_times.csv", size: "44 kb", icon: "ti-file", preview: null }
    ]
  },
  { slug: "synth-sequencer", name: "synth-sequencer", active: false },
  { slug: "weather-dashboard", name: "weather-dashboard", active: false },
  { slug: "distributed-cache", name: "distributed-cache", active: false }
];

function renderSidebar() {
  const sidebar = document.getElementById("pf-sidebar");
  const label = document.createElement("div");
  label.className = "pf-sidebar-label";
  label.textContent = "projects";
  sidebar.innerHTML = "";
  sidebar.appendChild(label);

  projects.forEach((p, i) => {
    const btn = document.createElement("button");
    btn.className = "pf-proj" + (i === 0 ? " active" : "");
    btn.dataset.slug = p.slug;
    btn.innerHTML = `<i class="ti ${i === 0 ? "ti-folder-open" : "ti-folder"}" aria-hidden="true"></i>${p.name}`;
    btn.addEventListener("click", () => render(p.slug));
    sidebar.appendChild(btn);
  });
}

function render(slug) {
  const project = projects.find(p => p.slug === slug);
  const content = document.getElementById("pf-content");
  document.getElementById("pf-crumb").textContent = slug;

  document.querySelectorAll(".pf-proj").forEach(btn => {
    const isActive = btn.dataset.slug === slug;
    btn.classList.toggle("active", isActive);
    btn.querySelector("i").className = `ti ${isActive ? "ti-folder-open" : "ti-folder"}`;
  });

  if (!project || !project.active) {
    content.innerHTML = `
      <div class="pf-empty">
        <i class="ti ti-folder" aria-hidden="true"></i>
        <p>This project folder is still being assembled. Check back soon, or browse rl-racecar on the left.</p>
      </div>`;
    return;
  }

  const tagsHtml = project.tags.map(t => `<span class="pf-tag">${t}</span>`).join("");
  const linksHtml = (project.links || []).map(l => `<a href="${l.href}" target="_blank" rel="noopener">${l.label} <i class="ti ti-external-link" aria-hidden="true"></i></a>`).join("");
  const filesHtml = project.files.map((f, i) => `
    <button class="pf-file" data-idx="${i}">
      <i class="ti ${f.icon}" aria-hidden="true"></i>
      <span class="fname">${f.name}</span>
      <span class="fsize">${f.size}</span>
    </button>
    <div class="pf-preview" id="prev-${i}"></div>
  `).join("");

  content.innerHTML = `
    <div class="pf-viewer">${project.viewer}</div>
    ${project.credit ? `<p class="pf-sketchfab-credit">${project.credit}</p>` : ""}
    <div class="pf-info">
      <h3>${project.title}</h3>
      <div class="pf-tags">${tagsHtml}</div>
      <p class="pf-desc">${project.desc}</p>
      ${linksHtml ? `<div class="pf-links">${linksHtml}</div>` : ""}
    </div>
    <div class="pf-files">
      <div class="pf-files-label">files</div>
      ${filesHtml}
    </div>
  `;

  project.files.forEach((f, i) => {
    document.querySelector(`[data-idx="${i}"]`).addEventListener("click", () => {
      const prev = document.getElementById(`prev-${i}`);
      const isOpen = prev.style.display === "block";
      document.querySelectorAll(".pf-preview").forEach(el => (el.style.display = "none"));
      if (!isOpen) {
        prev.style.display = "block";
        prev.textContent = f.preview || "binary file — no preview available";
      }
    });
  });
}

renderSidebar();
render(projects[0].slug);
