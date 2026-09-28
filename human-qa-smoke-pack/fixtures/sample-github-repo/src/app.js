const requests = [
  { id: "FR-101", title: "Add export to CSV", priority: "High", status: "Planned", owner: "Maya" },
  { id: "FR-102", title: "Improve empty state copy", priority: "Medium", status: "In Progress", owner: "Elena" },
  { id: "FR-103", title: "Add keyboard shortcuts", priority: "Low", status: "Backlog", owner: "Jordan" },
  { id: "FR-104", title: "Fix chart tooltip overlap", priority: "High", status: "In Progress", owner: "Liam" },
  { id: "FR-105", title: "Add dark mode", priority: "Medium", status: "Planned", owner: "Nina" },
];

const priorityFilter = document.querySelector("#priorityFilter");
const statusFilter = document.querySelector("#statusFilter");
const resultCount = document.querySelector("#resultCount");
const cards = document.querySelector("#cards");

function isValidOption(select, value) {
  return Array.from(select.options).some((option) => option.value === value);
}

function restoreFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const priority = params.get("priority");
  const status = params.get("status");

  if (priority && isValidOption(priorityFilter, priority)) {
    priorityFilter.value = priority;
  }
  if (status && isValidOption(statusFilter, status)) {
    statusFilter.value = status;
  }
}

function saveFiltersToUrl() {
  const params = new URLSearchParams(window.location.search);

  if (priorityFilter.value === "all") {
    params.delete("priority");
  } else {
    params.set("priority", priorityFilter.value);
  }

  if (statusFilter.value === "all") {
    params.delete("status");
  } else {
    params.set("status", statusFilter.value);
  }

  const query = params.toString();
  const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;

  try {
    window.history.replaceState(null, "", url);
  } catch (error) {
    // Some browsers block history updates on file:// URLs; filtering still works.
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

  resultCount.textContent = `Showing ${visible.length} of ${requests.length} requests`;

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
  saveFiltersToUrl();
  render();
}

priorityFilter.addEventListener("change", onFilterChange);
statusFilter.addEventListener("change", onFilterChange);

restoreFiltersFromUrl();
render();
