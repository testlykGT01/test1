const CHECKLIST = [
  {
    id: "planning",
    title: "Planning",
    blurb: "Lock scope, dates, and owners before anything else starts.",
    items: [
      { id: "goals", text: "Define launch goals and success metrics" },
      { id: "scope", text: "Agree on scope and explicit non-goals" },
      { id: "date", text: "Confirm launch date and freeze deadline" },
      { id: "owners", text: "Assign an owner for each workstream" },
      { id: "risks", text: "List top risks and mitigation plans" },
    ],
  },
  {
    id: "content",
    title: "Content",
    blurb: "Everything the audience will read, see, or click.",
    items: [
      { id: "messaging", text: "Finalize core messaging and positioning" },
      { id: "blog", text: "Draft announcement blog post" },
      { id: "docs", text: "Update product docs and help center" },
      { id: "assets", text: "Produce screenshots, demo video, and social assets" },
      { id: "faq", text: "Write customer-facing FAQ" },
    ],
  },
  {
    id: "approvals",
    title: "Approvals",
    blurb: "Sign-offs that must land before you can ship.",
    items: [
      { id: "legal", text: "Legal review of claims and naming" },
      { id: "brand", text: "Brand and design sign-off on assets" },
      { id: "security", text: "Security and privacy review complete" },
      { id: "exec", text: "Executive sponsor approves go/no-go" },
      { id: "support", text: "Support team briefed and staffed" },
    ],
  },
  {
    id: "launch-day",
    title: "Launch Day",
    blurb: "The run-of-show for the day itself.",
    items: [
      { id: "deploy", text: "Ship the release and verify in production" },
      { id: "publish", text: "Publish blog, docs, and social posts" },
      { id: "notify", text: "Send customer and internal announcements" },
      { id: "monitor", text: "Watch dashboards, errors, and support queue" },
      { id: "retro", text: "Schedule the post-launch retro" },
    ],
  },
];

const STORAGE_KEY = "team-launch-checklist.v1";

const sectionsEl = document.querySelector("#sections");
const overallLabel = document.querySelector("#overallLabel");
const overallPct = document.querySelector("#overallPct");
const overallBar = document.querySelector("#overallBar");
const overallFill = document.querySelector("#overallFill");
const resetBtn = document.querySelector("#resetBtn");

const totalItems = CHECKLIST.reduce((sum, section) => sum + section.items.length, 0);

// localStorage can throw in restricted/private contexts, especially over file://.
// The checklist still works there; it just won't persist between reloads.
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* persistence unavailable — ignore */
  }
}

let state = loadState();

const keyFor = (sectionId, itemId) => `${sectionId}.${itemId}`;

// Built once. Toggling only updates progress text, never rebuilds the list,
// so keyboard focus stays on the checkbox the user just activated.
const sectionRefs = [];

function buildSection(section) {
  const wrapper = document.createElement("section");
  wrapper.className = "section";
  wrapper.dataset.sectionId = section.id;

  const head = document.createElement("div");
  head.className = "section-head";

  const heading = document.createElement("h2");
  heading.textContent = section.title;
  heading.id = `heading-${section.id}`;

  const count = document.createElement("span");
  count.className = "section-count";

  head.append(heading, count);

  const blurb = document.createElement("p");
  blurb.className = "section-blurb";
  blurb.textContent = section.blurb;

  const list = document.createElement("ul");
  list.className = "items";

  const boxes = [];

  section.items.forEach((item) => {
    const key = keyFor(section.id, item.id);
    const li = document.createElement("li");
    li.className = "item";

    const label = document.createElement("label");
    label.className = "item-label";

    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = state[key] === true;
    box.dataset.key = key;

    const text = document.createElement("span");
    text.className = "item-text";
    text.textContent = item.text;

    box.addEventListener("change", () => {
      state[key] = box.checked;
      saveState(state);
      li.classList.toggle("done", box.checked);
      updateProgress();
    });

    li.classList.toggle("done", box.checked);
    label.append(box, text);
    li.append(label);
    list.append(li);
    boxes.push(box);
  });

  wrapper.append(head, blurb, list);
  wrapper.setAttribute("aria-labelledby", heading.id);
  sectionRefs.push({ count, boxes });
  return wrapper;
}

function updateProgress() {
  let doneTotal = 0;

  sectionRefs.forEach(({ count, boxes }) => {
    const done = boxes.filter((b) => b.checked).length;
    doneTotal += done;
    count.textContent = `${done}/${boxes.length}`;
    count.classList.toggle("complete", done === boxes.length);
  });

  const pct = totalItems === 0 ? 0 : Math.round((doneTotal / totalItems) * 100);
  overallLabel.textContent =
    doneTotal === totalItems
      ? `All ${totalItems} items complete — ready to launch.`
      : `${doneTotal} of ${totalItems} complete`;
  overallPct.textContent = `${pct}%`;
  overallFill.style.width = `${pct}%`;
  overallBar.setAttribute("aria-valuenow", String(pct));
}

CHECKLIST.forEach((section) => sectionsEl.append(buildSection(section)));
updateProgress();

resetBtn.addEventListener("click", () => {
  const anyChecked = sectionRefs.some(({ boxes }) => boxes.some((b) => b.checked));
  if (anyChecked && !window.confirm("Clear every checked item?")) return;

  state = {};
  saveState(state);
  sectionRefs.forEach(({ boxes }) => {
    boxes.forEach((box) => {
      box.checked = false;
      box.closest(".item").classList.remove("done");
    });
  });
  updateProgress();
});
