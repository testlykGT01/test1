function testStatusFilter(appSource) {
  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  function select() {
    return {
      value: "all",
      listeners: {},
      addEventListener(event, listener) { this.listeners[event] = listener; },
      change(value) { this.value = value; this.listeners.change(); },
    };
  }

  const priority = select();
  const status = select();
  const cards = { innerHTML: "" };
  const elements = { "#priorityFilter": priority, "#statusFilter": status, "#cards": cards };
  new Function("document", appSource)({ querySelector(selector) { return elements[selector]; } });

  function expectCards(expected) {
    const actual = [...cards.innerHTML.matchAll(/<h2>(.*?)<\/h2>/g)].map((match) => match[1]);
    assert(JSON.stringify(actual) === JSON.stringify(expected), `Expected ${expected}; got ${actual}`);
    assert(cards.innerHTML.includes("No feature requests match") === (expected.length === 0), "Incorrect empty state");
  }

  expectCards(["FR-101", "FR-102", "FR-103", "FR-104", "FR-105"]);
  priority.change("High");
  expectCards(["FR-101", "FR-104"]);

  for (const [value, expected] of [
    ["Planned", ["FR-101"]],
    ["In Progress", ["FR-104"]],
    ["Backlog", []],
    ["all", ["FR-101", "FR-104"]],
  ]) {
    status.change(value);
    assert(priority.value === "High", `Status ${value} reset the priority selection`);
    expectCards(expected);
  }

  priority.change("Low");
  status.change("Planned");
  assert(priority.value === "Low", "Empty results reset priority");
  expectCards([]);
  status.change("Backlog");
  assert(priority.value === "Low", "Changing status after empty results reset priority");
  expectCards(["FR-103"]);

  priority.change("all");
  assert(status.value === "Backlog", "Changing priority reset status");
  expectCards(["FR-103"]);
  status.change("all");
  expectCards(["FR-101", "FR-102", "FR-103", "FR-104", "FR-105"]);

  return "Passed: status changes preserve priority, filters combine, empty results preserve selections, and All resets only its own filter.";
}

if (typeof module !== "undefined") module.exports = testStatusFilter;
if (typeof require === "function" && require.main === module) {
  const fs = require("node:fs");
  const path = require("node:path");
  console.log(testStatusFilter(fs.readFileSync(path.join(__dirname, "../src/app.js"), "utf8")));
}
