const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector("i");

function applyIcon(theme) {
  themeIcon.className = theme === "light" ? "ti ti-sun" : "ti ti-moon";
}

applyIcon(document.documentElement.getAttribute("data-theme") || "dark");

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  applyIcon(next);
});
