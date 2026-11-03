const storageKey = "team-launch-checklist:v1";
const tasks = Array.from(document.querySelectorAll("input[data-task]"));
const sections = Array.from(document.querySelectorAll(".checklist"));
const progress = document.querySelector("#progress");
const progressText = document.querySelector("#progress-text");
const saveNotice = document.querySelector("#save-notice");

function showStorageWarning() {
  saveNotice.textContent = "Browser storage is unavailable or saved progress could not be read. You can still use the checklist, but changes may not survive reopening it.";
}

function updateProgress() {
  const completed = tasks.filter(task => task.checked).length;
  progress.max = tasks.length;
  progress.value = completed;
  progressText.textContent = `${completed} of ${tasks.length} tasks complete${completed === tasks.length ? " — ready to launch!" : ""}`;
  sections.forEach(section => {
    const sectionTasks = Array.from(section.querySelectorAll("input[data-task]"));
    const count = sectionTasks.filter(task => task.checked).length;
    section.querySelector(".section-count").textContent = `${count} / ${sectionTasks.length}`;
  });
}

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (!Array.isArray(saved) || !saved.every(id => typeof id === "string")) {
    throw new Error("Invalid saved checklist");
  }
  tasks.forEach(task => { task.checked = saved.includes(task.dataset.task); });
} catch {
  showStorageWarning();
}

tasks.forEach(task => {
  task.addEventListener("change", () => {
    updateProgress();
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks.filter(item => item.checked).map(item => item.dataset.task)));
    } catch {
      showStorageWarning();
    }
  });
});

document.querySelector("#reset").addEventListener("click", () => {
  if (!window.confirm("Reset all launch tasks in this browser?")) return;
  tasks.forEach(task => { task.checked = false; });
  updateProgress();
  try {
    localStorage.removeItem(storageKey);
  } catch {
    showStorageWarning();
  }
});

updateProgress();
