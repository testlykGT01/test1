# Team Launch Checklist

A small, static checklist app for running a team launch. It covers four sections:

- **Planning** — scope, date, owners, risks
- **Content** — messaging, release notes, docs, assets
- **Approvals** — legal, brand, security, exec sign-off
- **Launch day** — go/no-go, shipping, announcing, monitoring

Each section shows its own progress, and there's an overall progress bar at the top.

## How to open it locally

No build step, no dependencies, no server required.

1. Clone or download this repository.
2. Open `launch-checklist/index.html` in any modern browser.

From the command line, from the repository root:

```bash
# macOS
open launch-checklist/index.html

# Windows
start launch-checklist\index.html

# Linux
xdg-open launch-checklist/index.html
```

### Optional: serve it over http

Opening the file directly works fine. If you'd rather serve it (for example, so
progress is saved more reliably in browsers that restrict storage on `file://`
URLs), run any static server from the repository root:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000/launch-checklist/>.

## Using the checklist

- Click any item to check or uncheck it.
- **Hide completed items** collapses the list down to what's left.
- **Reset checklist** clears all progress after a confirmation prompt.

Progress is saved to your browser's `localStorage`, so it survives a reload on
the same browser and machine. It is *not* shared between people or devices, and
it is not committed back to the repository. If your browser blocks storage on
`file://` URLs, the app still works — it just starts fresh each time, and says so
at the bottom of the page.

## Customizing the items

All checklist content lives in the `SECTIONS` array at the top of
`launch-checklist/app.js`. Add, remove, or reword items there; the UI and the
progress math update automatically.

Give each item a unique, stable `id`. Progress is keyed by `id`, so renaming an
`id` clears that item's saved state, while changing only its `label` preserves it.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and controls |
| `app.js` | Checklist data, rendering, and `localStorage` persistence |
| `styles.css` | Styling |
