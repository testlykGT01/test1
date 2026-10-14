# Team Launch Checklist

A small, static checklist app for running a team launch. It covers four sections:

- **Planning** — goals, dates, owners, audience, risks
- **Content** — announcement, release notes, docs, assets, internal FAQ
- **Approvals** — engineering, QA, legal/brand, security, exec go/no-go
- **Launch day** — deploy, verify, publish, notify, monitor, retro

## How to open it locally

No build step, no dependencies, and no server are required.

1. Clone or download this repository.
2. Open `team-launch-checklist/index.html` in any modern browser.

From a terminal:

```bash
# macOS
open team-launch-checklist/index.html

# Windows
start team-launch-checklist\index.html

# Linux
xdg-open team-launch-checklist/index.html
```

### Optional: serve it over HTTP

Opening the file directly works. If you prefer a local server (for example, to
share it on your network or to avoid browser restrictions on `file://` storage):

```bash
cd team-launch-checklist
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## How it works

- `index.html` — page shell, progress bar, and the "hide completed" toggle
- `app.js` — checklist data plus rendering and state handling
- `styles.css` — plain CSS, no framework

Checked items are saved in your browser with `localStorage` under the key
`team-launch-checklist:v1`, so progress survives a refresh. It is per-browser and
per-device — it is not shared between teammates. **Reset checklist** clears it.

If `localStorage` is unavailable (private browsing, or a browser that restricts
storage on `file://`), the app still works for the current session; progress just
won't persist after you close the tab.

## Customizing the checklist

Edit the `SECTIONS` array at the top of `app.js`. Each section has an `id`,
`title`, `note`, and a list of tasks:

```js
{
  id: "planning",
  title: "Planning",
  note: "Lock scope, dates, and owners before anything else starts.",
  tasks: [
    { id: "planning-goals", text: "Agree on launch goals and success metrics" },
  ],
}
```

Task `id` values are the storage keys. Keep them stable when editing wording, and
use a new `id` when adding a task. Saved ids that no longer exist are ignored on
load, so removing a task won't corrupt saved progress.
