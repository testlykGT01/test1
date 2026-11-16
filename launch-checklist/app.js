const sections = [
  { title: "Planning", description: "Agree on the destination before you start.", tasks: [
    { id: "planning-goals", text: "Define launch goals and success measures" },
    { id: "planning-audience", text: "Identify the target audience" },
    { id: "planning-owners", text: "Assign task owners and deadlines" },
    { id: "planning-date", text: "Confirm the launch date and milestones" },
  ] },
  { title: "Content", description: "Prepare the story and everything that supports it.", tasks: [
    { id: "content-message", text: "Finalize key messaging and launch copy" },
    { id: "content-assets", text: "Prepare visuals and product assets" },
    { id: "content-channels", text: "Draft email, social, and website updates" },
    { id: "content-review", text: "Proofread content and check all links" },
  ] },
  { title: "Approvals", description: "Get the right people to sign off.", tasks: [
    { id: "approvals-product", text: "Get product and engineering sign-off" },
    { id: "approvals-brand", text: "Get marketing and brand approval" },
    { id: "approvals-legal", text: "Complete required legal and compliance review" },
    { id: "approvals-go", text: "Confirm the final go / no-go decision" },
  ] },
  { title: "Launch day", description: "Ship, check, and keep the team informed.", tasks: [
    { id: "launch-publish", text: "Publish approved content and updates" },
    { id: "launch-verify", text: "Verify the live experience and links" },
    { id: "launch-notify", text: "Notify stakeholders and the support team" },
    { id: "launch-monitor", text: "Monitor results and capture follow-up actions" },
  ] },
];

const storageKey = "team-launch-checklist-v1";
const taskIds = sections.flatMap((section) => section.tasks.map((task) => task.id));
const checklist = document.querySelector("#checklist");
const progress = document.querySelector("#progress");
const progressText = document.querySelector("#progressText");
const saveNotice = document.querySelector("#saveNotice");
let completed = new Set();

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (Array.isArray(saved)) {
    completed = new Set(saved.filter((id) => taskIds.includes(id)));
  }
} catch {
  saveNotice.textContent = "Saved progress could not be loaded. You can still use the checklist.";
}

checklist.innerHTML = sections.map((section, index) => `
  <section class="checklist-section" aria-labelledby="section-${index}">
    <span class="step" aria-hidden="true">0${index + 1}</span>
    <h2 id="section-${index}">${section.title}</h2>
    <p class="description">${section.description}</p>
    <ul>${section.tasks.map((task) => `
      <li><label for="${task.id}"><input type="checkbox" id="${task.id}" ${completed.has(task.id) ? "checked" : ""}><span>${task.text}</span></label></li>
    `).join("")}</ul>
  </section>
`).join("");

function updateProgress() {
  progress.max = taskIds.length;
  progress.value = completed.size;
  progressText.textContent = `${completed.size} of ${taskIds.length} tasks complete${completed.size === taskIds.length ? " — ready to launch!" : ""}`;
}

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify([...completed]));
    saveNotice.textContent = "Checkmarks are saved in this browser only, not shared with teammates.";
  } catch {
    saveNotice.textContent = "Browser storage is unavailable. Checkmarks will not be saved after closing or reloading this page.";
  }
}

checklist.addEventListener("change", (event) => {
  const input = event.target;
  if (!taskIds.includes(input.id) || input.type !== "checkbox") return;
  if (input.checked) completed.add(input.id);
  else completed.delete(input.id);
  updateProgress();
  save();
});

document.querySelector("#reset").addEventListener("click", () => {
  if (!window.confirm("Reset all checkmarks in this browser?")) return;
  completed.clear();
  checklist.querySelectorAll('input[type="checkbox"]').forEach((input) => { input.checked = false; });
  updateProgress();
  save();
});

updateProgress();
