const SECTIONS = [
  {
    id: "planning",
    title: "Planning",
    note: "Lock scope, dates, and owners before anything else starts.",
    tasks: [
      { id: "planning-goals", text: "Agree on launch goals and success metrics" },
      { id: "planning-date", text: "Confirm the launch date and freeze window" },
      { id: "planning-owners", text: "Assign an owner for each workstream" },
      { id: "planning-audience", text: "Define the target audience and key message" },
      { id: "planning-risks", text: "List top risks and a rollback plan" },
    ],
  },
  {
    id: "content",
    title: "Content",
    note: "Everything the audience will read, see, or click.",
    tasks: [
      { id: "content-announcement", text: "Draft the announcement post" },
      { id: "content-release-notes", text: "Write release notes and changelog entry" },
      { id: "content-docs", text: "Update product docs and help center articles" },
      { id: "content-assets", text: "Prepare screenshots, demo video, and social assets" },
      { id: "content-faq", text: "Prepare an internal FAQ for support and sales" },
    ],
  },
  {
    id: "approvals",
    title: "Approvals",
    note: "Sign-offs that must land before launch day.",
    tasks: [
      { id: "approvals-eng", text: "Engineering sign-off on the release build" },
      { id: "approvals-qa", text: "QA sign-off on the smoke test pass" },
      { id: "approvals-legal", text: "Legal and brand review of public content" },
      { id: "approvals-security", text: "Security and privacy review complete" },
      { id: "approvals-exec", text: "Executive go/no-go decision recorded" },
    ],
  },
  {
    id: "launch-day",
    title: "Launch day",
    note: "The run-of-show for the day itself.",
    tasks: [
      { id: "launch-deploy", text: "Deploy or flip the feature flag" },
      { id: "launch-verify", text: "Verify the live experience in production" },
      { id: "launch-publish", text: "Publish announcement and social posts" },
      { id: "launch-notify", text: "Notify support, sales, and internal channels" },
      { id: "launch-monitor", text: "Monitor errors, metrics, and feedback for 24 hours" },
      { id: "launch-retro", text: "Schedule the post-launch retro" },
    ],
  },
];

const STORAGE_KEY = "team-launch-checklist:v1";

const sectionsEl = document.querySelector("#sections");
const overallCount = document.querySelector("#overallCount");
const overallFill = document.querySelector("#overallFill");
const overallBar = document.querySelector("#overallBar");
const hideDone = document.querySelector("#hideDone");
const resetButton = document.querySelector("#resetButton");

const allTaskIds = SECTIONS.flatMap((section) => section.tasks.map((task) => task.id));

let doneIds = loadState();

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    // Drop ids that no longer exist so renamed tasks don't linger as "done".
    return new Set(Array.isArray(parsed) ? parsed.filter((id) => allTaskIds.includes(id)) : []);
  } catch (error) {
    return new Set();
  }
}

function saveState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...doneIds]));
  } catch (error) {
    // Storage can be unavailable (private mode, file:// restrictions); the app still works in-memory.
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function doneCount(tasks) {
  return tasks.filter((task) => doneIds.has(task.id)).length;
}

function renderSection(section) {
  const total = section.tasks.length;
  const done = doneCount(section.tasks);
  const visible = hideDone.checked
    ? section.tasks.filter((task) => !doneIds.has(task.id))
    : section.tasks;

  const items = visible.map((task) => {
    const isDone = doneIds.has(task.id);
    return `
      <li>
        <label class="task${isDone ? " done" : ""}">
          <input type="checkbox" data-task-id="${escapeHtml(task.id)}"${isDone ? " checked" : ""}>
          <span class="task-text">${escapeHtml(task.text)}</span>
        </label>
      </li>
    `;
  }).join("");

  const body = visible.length
    ? `<ul class="task-list">${items}</ul>`
    : `<p class="empty">All ${total} tasks complete.</p>`;

  return `
    <section class="section${done === total ? " complete" : ""}" aria-labelledby="${section.id}-title">
      <div class="section-header">
        <h2 id="${section.id}-title">${escapeHtml(section.title)}</h2>
        <span class="section-count">${done} / ${total}</span>
      </div>
      <p class="section-note">${escapeHtml(section.note)}</p>
      ${body}
    </section>
  `;
}

function render() {
  const total = allTaskIds.length;
  const done = allTaskIds.filter((id) => doneIds.has(id)).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  overallCount.textContent = `${done} of ${total} complete (${percent}%)`;
  overallFill.style.width = `${percent}%`;
  overallBar.setAttribute("aria-valuenow", String(percent));

  sectionsEl.innerHTML = SECTIONS.map(renderSection).join("");
}

function toggleTask(id, isDone) {
  if (isDone) {
    doneIds.add(id);
  } else {
    doneIds.delete(id);
  }
  saveState();
  render();
}

sectionsEl.addEventListener("change", (event) => {
  const taskId = event.target.dataset ? event.target.dataset.taskId : null;
  if (!taskId) return;
  toggleTask(taskId, event.target.checked);
});

hideDone.addEventListener("change", render);

resetButton.addEventListener("click", () => {
  if (doneIds.size === 0) return;
  doneIds = new Set();
  saveState();
  render();
});

render();
