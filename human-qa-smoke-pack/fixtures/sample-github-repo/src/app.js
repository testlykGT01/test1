const requests = [
  { id: "FR-101", title: "Add export to CSV", priority: "High", status: "Planned", owner: "Maya" },
  { id: "FR-102", title: "Improve empty state copy", priority: "Medium", status: "In Progress", owner: "Elena" },
  { id: "FR-103", title: "Add keyboard shortcuts", priority: "Low", status: "Backlog", owner: "Jordan" },
  { id: "FR-104", title: "Fix chart tooltip overlap", priority: "High", status: "In Progress", owner: "Liam" },
  { id: "FR-105", title: "Add dark mode", priority: "Medium", status: "Planned", owner: "Nina" },
];

// If a stale cached copy of index.html loads against a newer app.js (or vice
// versa), an element can be missing. Failing loudly here beats a silent
// TypeError mid-render, which leaves the UI frozen and looks like the filters
// resetting or doing nothing.
function required(selector) {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`Dashboard: missing ${selector}. Hard-reload the page.`);
  return el;
}

const priorityFilter = required("#priorityFilter");
const statusFilter = required("#statusFilter");
const cards = required("#cards");
const summary = required("#summary");

// Both dropdowns are read together on every render, so each filter is applied
// independently and neither one clears the other.
function currentFilters() {
  return { priority: priorityFilter.value, status: statusFilter.value };
}

function matches(item, { priority, status }) {
  return (
    (priority === "all" || item.priority === priority) &&
    (status === "all" || item.status === status)
  );
}

function render() {
  const filters = currentFilters();
  const { priority, status } = filters;
  const visible = requests.filter((item) => matches(item, filters));

  const active = [
    priority === "all" ? null : `Priority: ${priority}`,
    status === "all" ? null : `Status: ${status}`,
  ].filter(Boolean);

  summary.textContent =
    `Showing ${visible.length} of ${requests.length}` +
    (active.length ? ` — ${active.join(" + ")}` : " — no filters applied");

  if (visible.length === 0) {
    cards.innerHTML = `<p class="empty">No feature requests match both filters.</p>`;
    return;
  }

  cards.innerHTML = visible.map((item) => `
    <article class="card">
      <h2>${item.id}</h2>
      <p>${item.title}</p>
      <p class="meta">Priority: ${item.priority}</p>
      <p class="meta">Status: ${item.status}</p>
      <p class="meta">Owner: ${item.owner}</p>
    </article>
  `).join("");
}

priorityFilter.addEventListener("change", render);
statusFilter.addEventListener("change", render);
render();
