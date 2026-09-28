const STORAGE_KEY = "team-launch-checklist-v1";

const SECTIONS = [
  {
    id: "planning",
    title: "Planning",
    description: "Lock the scope, the date, and who owns what.",
    items: [
      { id: "planning-goal", label: "Agree on the launch goal and success metrics" },
      { id: "planning-date", label: "Confirm the launch date with all teams" },
      { id: "planning-owners", label: "Assign an owner for each workstream" },
      { id: "planning-scope", label: "Write down what is explicitly out of scope" },
      { id: "planning-risks", label: "List the top risks and a fallback plan" },
    ],
  },
  {
    id: "content",
    title: "Content",
    description: "Everything the audience will read, see, or click.",
    items: [
      { id: "content-messaging", label: "Finalize core messaging and positioning" },
      { id: "content-release-notes", label: "Draft release notes and changelog entry" },
      { id: "content-docs", label: "Update product docs and help center articles" },
      { id: "content-assets", label: "Prepare screenshots, demo video, and social assets" },
      { id: "content-proofread", label: "Proofread all copy for typos and broken links" },
    ],
  },
  {
    id: "approvals",
    title: "Approvals",
    description: "Sign-offs to collect before anything ships.",
    items: [
      { id: "approvals-legal", label: "Legal review of claims and terms" },
      { id: "approvals-brand", label: "Brand and design sign-off on assets" },
      { id: "approvals-security", label: "Security and privacy review complete" },
      { id: "approvals-exec", label: "Executive sponsor approves go/no-go" },
      { id: "approvals-support", label: "Support team briefed and ready" },
    ],
  },
  {
    id: "launch-day",
    title: "Launch day",
    description: "The run-of-show for the day itself.",
    items: [
      { id: "launch-final-check", label: "Run final go/no-go check with all owners" },
      { id: "launch-ship", label: "Ship the release and verify it is live" },
      { id: "launch-announce", label: "Publish announcement and social posts" },
      { id: "launch-monitor", label: "Monitor errors, performance, and support volume" },
      { id: "launch-retro", label: "Schedule the retrospective" },
    ],
  },
];

const sectionsEl = document.querySelector("#sections");
const overallBar = document.querySelector("#overallBar");
const overallCount = document.querySelector("#overallCount");
const hideDoneEl = document.querySelector("#hideDone");
const resetButton = document.querySelector("#resetButton");
const statusEl = document.querySelector("#status");

const allItems = SECTIONS.flatMap((section) => section.items);
let checked = loadState();

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
}

function saveState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    statusEl.textContent = "Progress saved in this browser.";
  } catch (error) {
    statusEl.textContent = "Progress can't be saved in this browser, so it resets on reload.";
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[char];
  });
}

function render() {
  const hideDone = hideDoneEl.checked;

  sectionsEl.innerHTML = SECTIONS.map((section) => {
    const doneCount = section.items.filter((item) => checked[item.id]).length;
    const visibleItems = hideDone ? section.items.filter((item) => !checked[item.id]) : section.items;
    const percent = section.items.length ? Math.round((doneCount / section.items.length) * 100) : 0;

    const itemsMarkup = visibleItems.length
      ? visibleItems.map((item) => {
          const isDone = Boolean(checked[item.id]);
          return `
            <li>
              <label class="item${isDone ? " done" : ""}">
                <input type="checkbox" data-item-id="${item.id}"${isDone ? " checked" : ""}>
                <span class="item-label">${escapeHtml(item.label)}</span>
              </label>
            </li>
          `;
        }).join("")
      : `<li class="empty">All items in this section are done.</li>`;

    return `
      <section class="section">
        <div class="section-head">
          <h2>${escapeHtml(section.title)}</h2>
          <span class="meta">${doneCount}/${section.items.length}</span>
        </div>
        <p class="section-description meta">${escapeHtml(section.description)}</p>
        <div class="progress">
          <div class="progress-fill${percent === 100 ? " complete" : ""}" style="width: ${percent}%"></div>
        </div>
        <ul class="items">${itemsMarkup}</ul>
      </section>
    `;
  }).join("");

  const totalDone = allItems.filter((item) => checked[item.id]).length;
  const overallPercent = Math.round((totalDone / allItems.length) * 100);
  overallCount.textContent = `${totalDone} of ${allItems.length} done (${overallPercent}%)`;
  overallBar.style.width = `${overallPercent}%`;
  overallBar.classList.toggle("complete", totalDone === allItems.length);
}

sectionsEl.addEventListener("change", (event) => {
  const id = event.target.dataset.itemId;
  if (!id) return;

  if (event.target.checked) {
    checked[id] = true;
  } else {
    delete checked[id];
  }

  saveState();
  render();
});

hideDoneEl.addEventListener("change", render);

resetButton.addEventListener("click", () => {
  const hasProgress = allItems.some((item) => checked[item.id]);
  if (hasProgress && !window.confirm("Clear all checked items?")) return;

  checked = {};
  saveState();
  render();
  statusEl.textContent = "Checklist reset.";
});

render();
