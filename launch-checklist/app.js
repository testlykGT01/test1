const storageKey = "team-launch-checklist:v1";
const tasks = Array.from(document.querySelectorAll('input[type="checkbox"]'));
const progress = document.querySelector("#progress");
const progressText = document.querySelector("#progressText");
const saveStatus = document.querySelector("#saveStatus");

function updateProgress() {
  const completed = tasks.filter((task) => task.checked).length;
  progress.max = tasks.length;
  progress.value = completed;
  progressText.textContent = `${completed} of ${tasks.length} complete`;
}

function save() {
  const state = {};
  tasks.forEach((task) => { state[task.id] = task.checked; });
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
    saveStatus.textContent = "Progress saved in this browser only; it is not synced with teammates.";
  } catch {
    saveStatus.textContent = "Browser storage is unavailable. You can use the checklist, but progress will not survive a reload.";
  }
}

try {
  const state = JSON.parse(localStorage.getItem(storageKey) || "{}");
  tasks.forEach((task) => { task.checked = state?.[task.id] === true; });
} catch {
  saveStatus.textContent = "Saved progress could not be loaded. Start checking tasks to save a fresh checklist.";
}

tasks.forEach((task) => {
  task.addEventListener("change", () => {
    updateProgress();
    save();
  });
});

document.querySelector("#reset").addEventListener("click", () => {
  if (!window.confirm("Reset all launch tasks? This clears your saved progress.")) return;
  tasks.forEach((task) => { task.checked = false; });
  updateProgress();
  save();
});

updateProgress();
