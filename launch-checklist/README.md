# Team Launch Checklist

A small, static checklist app for coordinating a product launch. It covers four
stages — **Planning**, **Content**, **Approvals**, and **Launch Day** — with
per-section counts and an overall progress bar.

## How to open it locally

No build step, no install, no dependencies.

**Option 1 — double-click**

Open `launch-checklist/index.html` in your browser. On macOS you can also run:

```bash
open launch-checklist/index.html
```

On Windows use `start launch-checklist\index.html`, and on Linux `xdg-open launch-checklist/index.html`.

**Option 2 — local web server**

Some browsers restrict `localStorage` on `file://` URLs. If your checkmarks
aren't saved between reloads, serve the folder over HTTP instead:

```bash
cd launch-checklist
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Using it

- Click any item (or its label) to check it off. Checked items are struck through.
- Each section header shows a `done/total` count that turns green when the section is finished.
- The bar at the top shows overall completion across all sections.
- **Reset checklist** clears everything. It asks for confirmation first if anything is checked.

## Saving your progress

Progress is stored in your browser's `localStorage` under the key
`team-launch-checklist.v1`. It is per-browser and per-machine — it is not synced
and not committed to the repo, so two people opening the file keep separate
progress. If `localStorage` is unavailable, the checklist still works normally
for the session but won't persist across reloads.

## Customizing the items

All content lives in the `CHECKLIST` array at the top of `app.js`. Each section
has an `id`, `title`, `blurb`, and a list of `items`:

```js
{
  id: "planning",
  title: "Planning",
  blurb: "Lock scope, dates, and owners before anything else starts.",
  items: [
    { id: "goals", text: "Define launch goals and success metrics" },
  ],
}
```

Add, remove, or reword items freely. Keep `id` values stable — saved progress is
keyed on `sectionId.itemId`, so renaming an `id` resets that item, while editing
its `text` preserves the checked state.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page shell, header, and progress bar markup |
| `app.js` | Checklist data, rendering, progress, and persistence |
| `styles.css` | Layout and styling |
