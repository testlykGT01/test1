const requests = [
  { id: "FR-101", title: "Add export to CSV", priority: "High", status: "Planned", owner: "Maya" },
  { id: "FR-102", title: "Improve empty state copy", priority: "Medium", status: "In Progress", owner: "Elena" },
  { id: "FR-103", title: "Add keyboard shortcuts", priority: "Low", status: "Backlog", owner: "Jordan" },
  { id: "FR-104", title: "Fix chart tooltip overlap", priority: "High", status: "In Progress", owner: "Liam" },
  { id: "FR-105", title: "Add dark mode", priority: "Medium", status: "Planned", owner: "Nina" },
];

const priorityFilter = document.querySelector("#priorityFilter");
const statusFilter = document.querySelector("#statusFilter");
const cards = document.querySelector("#cards");

function render() {
  const priority = priorityFilter.value;
  const status = statusFilter.value;
  const visible = requests.filter((item) =>
    (priority === "all" || item.priority === priority) &&
    (status === "all" || item.status === status)
  );

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

// Keep both filters in the URL hash (e.g. #priority=High&status=Planned) so they survive reloads.
function setSelect(select, value) {
  const valid = [...select.options].some((option) => option.value === value);
  select.value = valid ? value : "all";
}

function readFiltersFromHash() {
  const params = new URLSearchParams(location.hash.slice(1));
  setSelect(priorityFilter, params.get("priority") || "all");
  setSelect(statusFilter, params.get("status") || "all");
}

function writeFiltersToHash() {
  const params = new URLSearchParams();
  if (priorityFilter.value !== "all") params.set("priority", priorityFilter.value);
  if (statusFilter.value !== "all") params.set("status", statusFilter.value);
  const hash = params.toString();
  if (location.hash.slice(1) !== hash) {
    try {
      history.replaceState(null, "", hash ? `#${hash}` : location.pathname + location.search);
    } catch {
      location.hash = hash;
    }
  }
}

function onFilterChange() {
  writeFiltersToHash();
  render();
}

priorityFilter.addEventListener("change", onFilterChange);
statusFilter.addEventListener("change", onFilterChange);
window.addEventListener("hashchange", () => {
  readFiltersFromHash();
  render();
});

readFiltersFromHash();
render();
