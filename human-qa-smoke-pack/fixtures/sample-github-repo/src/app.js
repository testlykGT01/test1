const requests = [
  { id: "FR-101", title: "Add export to CSV", priority: "High", status: "Planned", owner: "Maya" },
  { id: "FR-102", title: "Improve empty state copy", priority: "Medium", status: "In Progress", owner: "Elena" },
  { id: "FR-103", title: "Add keyboard shortcuts", priority: "Low", status: "Backlog", owner: "Jordan" },
  { id: "FR-104", title: "Fix chart tooltip overlap", priority: "High", status: "In Progress", owner: "Liam" },
  { id: "FR-105", title: "Add dark mode", priority: "Medium", status: "Planned", owner: "Nina" },
];

const STORAGE_KEY = "feature-request-dashboard:filters:v1";

const priorityFilter = document.querySelector("#priorityFilter");
const statusFilter = document.querySelector("#statusFilter");
const resultCount = document.querySelector("#resultCount");
const cards = document.querySelector("#cards");

function optionValues(select) {
  return Array.from(select.options).map((option) => option.value);
}

function restoreFilters() {
  let saved;
  try {
    saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
  } catch (error) {
    return;
  }
  if (!saved || typeof saved !== "object") return;

  // Ignore saved values that are no longer offered, so a stale entry can't
  // leave a select showing a filter the user cannot see or clear.
  if (optionValues(priorityFilter).includes(saved.priority)) {
    priorityFilter.value = saved.priority;
  }
  if (optionValues(statusFilter).includes(saved.status)) {
    statusFilter.value = saved.status;
  }
}

function saveFilters() {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ priority: priorityFilter.value, status: statusFilter.value })
    );
  } catch (error) {
    // Storage may be unavailable (private mode, file:// restrictions); filters
    // still work for this page view, they just won't survive a reload.
  }
}

function render() {
  const priority = priorityFilter.value;
  const status = statusFilter.value;

  const visible = requests.filter(
    (item) =>
      (priority === "all" || item.priority === priority) &&
      (status === "all" || item.status === status)
  );

  resultCount.textContent = `${visible.length} of ${requests.length} requests`;

  if (visible.length === 0) {
    cards.innerHTML = `<p class="empty">No feature requests match the selected filters.</p>`;
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

function onFilterChange() {
  saveFilters();
  render();
}

priorityFilter.addEventListener("change", onFilterChange);
statusFilter.addEventListener("change", onFilterChange);

restoreFilters();
render();
