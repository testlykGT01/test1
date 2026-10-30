(() => {
  const priority = document.querySelector("#priorityFilter");
  const status = document.querySelector("#statusFilter");
  const output = document.querySelector("#cards");
  const result = document.querySelector("#result");
  const expected = {
    High: { Planned: "FR-101", "In Progress": "FR-104", Backlog: "", all: "FR-101,FR-104" },
    Medium: { Planned: "FR-105", "In Progress": "FR-102", Backlog: "", all: "FR-102,FR-105" },
    Low: { Planned: "", "In Progress": "", Backlog: "FR-103", all: "FR-103" },
    all: { Planned: "FR-101,FR-105", "In Progress": "FR-102,FR-104", Backlog: "FR-103", all: "FR-101,FR-102,FR-103,FR-104,FR-105" }
  };

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  function change(select, value) {
    select.value = value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }

  try {
    let combinations = 0;
    Object.entries(expected).forEach(([selectedPriority, statuses]) => {
      change(priority, selectedPriority);
      Object.entries(statuses).forEach(([selectedStatus, ids]) => {
        change(status, selectedStatus);
        assert(priority.value === selectedPriority, "Status change reset priority " + selectedPriority);
        assert((output.innerHTML.match(/FR-\d+/g) || []).join(",") === ids,
          "Incorrect results for " + selectedPriority + " / " + selectedStatus);
        if (!ids) {
          assert(output.textContent.includes("No feature requests match"), "Missing empty state");
        }
        combinations++;
      });
    });
    change(status, "Planned");
    change(priority, "High");
    assert(status.value === "Planned", "Priority change reset status");
    assert((output.innerHTML.match(/FR-\d+/g) || []).join(",") === "FR-101", "Reverse filter sequence failed");
    change(priority, "all");
    change(status, "all");
    result.textContent = "PASS: " + combinations + " combinations preserve priority, including empty results and All; priority changes also preserve status.";
  } catch (error) {
    result.textContent = "FAIL: " + error.message;
    throw error;
  }
})();
