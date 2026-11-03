(() => {
  const priority = document.querySelector("#priorityFilter");
  const status = document.querySelector("#statusFilter");
  const cards = document.querySelector("#cards");
  const results = document.querySelector("#test-results");
  const expected = {
    all: [["FR-101", "FR-102", "FR-103", "FR-104", "FR-105"], ["FR-101", "FR-105"], ["FR-102", "FR-104"], ["FR-103"]],
    High: [["FR-101", "FR-104"], ["FR-101"], ["FR-104"], []],
    Medium: [["FR-102", "FR-105"], ["FR-105"], ["FR-102"], []],
    Low: [["FR-103"], [], [], ["FR-103"]],
  };

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  function select(control, value) {
    control.value = value;
    control.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function checkCards(ids) {
    const actual = Array.from(cards.querySelectorAll("h2"), heading => heading.textContent);
    assert(JSON.stringify(actual) === JSON.stringify(ids), `Expected ${JSON.stringify(ids)}, got ${JSON.stringify(actual)}`);
    if (ids.length === 0) {
      assert(cards.textContent.includes("No feature requests match the selected filters."), "Missing empty-state message");
    }
  }

  try {
    checkCards(expected.all[0]);
    Object.keys(expected).forEach(value => {
      select(priority, value);
      ["all", "Planned", "In Progress", "Backlog"].forEach((statusValue, index) => {
        select(status, statusValue);
        assert(priority.value === value, `Changing status to ${statusValue} reset priority ${value}`);
        assert(status.value === statusValue, "Status selection was not retained");
        checkCards(expected[value][index]);
      });
      select(status, "all");
      assert(priority.value === value, "Clearing status reset priority");
      checkCards(expected[value][0]);
    });
    select(status, "Planned");
    select(priority, "all");
    assert(status.value === "Planned", "Clearing priority reset status");
    checkCards(expected.all[1]);
    select(status, "all");
    checkCards(expected.all[0]);
    results.textContent = "PASS: all 16 filter combinations preserve priority; each filter clears independently.";
  } catch (error) {
    results.textContent = `FAIL: ${error.message}`;
    throw error;
  }
})();
