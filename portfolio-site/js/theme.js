const themeCheckbox = document.getElementById("theme-toggle");

function currentTheme() {
  return document.documentElement.getAttribute("data-theme") || "dark";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  themeCheckbox.checked = theme === "light";
}

// Sync the switch position with whatever theme was applied on page load
// (see the inline script in index.html's <head>).
themeCheckbox.checked = currentTheme() === "light";

themeCheckbox.addEventListener("change", () => {
  setTheme(themeCheckbox.checked ? "light" : "dark");
});
