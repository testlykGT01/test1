const STORAGE_KEY = "team-launch-checklist-v1";

const DEFAULT_SECTIONS = [
  {
    id: "planning",
    title: "Planning",
    items: [
      "Define launch goals and success metrics",
      "Confirm launch date and owners",
      "Identify target audience",
      "Share timeline with the team",
    ],
  },
  {
    id: "content",
    title: "Content",
    items: [
      "Write announcement blog post",
      "Prepare social media posts",
      "Update website and product pages",
      "Create screenshots and demo assets",
    ],
  },
  {
    id: "approvals",
    title: "Approvals",
    items: [
      "Product sign-off",
      "Legal and compliance review",
      "Marketing sign-off",
      "Final go/no-go decision",
    ],
  },
  {
    id: "launch-day",
    title: "Launch Day",
    items: [
      "Publish announcement",
      "Send customer email",
      "Monitor feedback and support channels",
      "Share launch recap with the team",
    ],
  },
];

function createDefaultState() {
  return DEFAULT_SECTIONS.map((section) => ({
    id: section.id,
    title: section.title,
    items: section.items.map((text, index) => ({
      id: `${section.id}-${index}`,
      text,
      done: false,
    })),
  }));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch {
    // Fall back to defaults when storage is unavailable or corrupted.
  }
  return createDefaultState();
}

let state = loadState();

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be blocked (e.g. some file:// contexts); the app still works for this visit.
  }
}

const sectionsEl = document.querySelector("#sections");
const template = document.querySelector("#sectionTemplate");
const overallText = document.querySelector("#overallText");
const overallProgress = document.querySelector("#overallProgress");

function render() {
  sectionsEl.innerHTML = "";
  let total = 0;
  let done = 0;

  state.forEach((section) => {
    const node = template.content.cloneNode(true);
    const sectionEl = node.querySelector(".section");
    const list = node.querySelector(".items");
    const form = node.querySelector(".add-form");
    const input = form.querySelector("input");
    const sectionDone = section.items.filter((item) => item.done).length;

    total += section.items.length;
    done += sectionDone;

    node.querySelector("h2").textContent = section.title;
    node.querySelector(".count").textContent = `${sectionDone}/${section.items.length}`;
    sectionEl.classList.toggle("complete", section.items.length > 0 && sectionDone === section.items.length);

    const inputId = `add-${section.id}`;
    input.id = inputId;
    form.querySelector("label").htmlFor = inputId;
    form.querySelector("label").textContent = `Add a ${section.title} task`;

    section.items.forEach((item) => {
      const li = document.createElement("li");
      li.className = item.done ? "item done" : "item";

      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.done;
      checkbox.addEventListener("change", () => {
        item.done = checkbox.checked;
        saveState();
        render();
      });

      const text = document.createElement("span");
      text.textContent = item.text;
      label.append(checkbox, text);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove";
      remove.setAttribute("aria-label", `Remove "${item.text}"`);
      remove.textContent = "×";
      remove.addEventListener("click", () => {
        section.items = section.items.filter((other) => other.id !== item.id);
        saveState();
        render();
      });

      li.append(label, remove);
      list.append(li);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      section.items.push({ id: `${section.id}-${Date.now()}`, text, done: false });
      saveState();
      render();
      document.querySelector(`#${inputId}`).focus();
    });

    sectionsEl.append(node);
  });

  overallText.textContent = `${done} of ${total} done`;
  overallProgress.max = Math.max(total, 1);
  overallProgress.value = done;
}

document.querySelector("#resetButton").addEventListener("click", () => {
  if (!confirm("Reset the checklist to the default tasks? Your changes will be lost.")) return;
  state = createDefaultState();
  saveState();
  render();
});

render();
