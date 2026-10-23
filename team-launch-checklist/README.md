# Team Launch Checklist

A simple, static checklist app for coordinating a team launch. Tasks are grouped into four sections:

- **Planning**
- **Content**
- **Approvals**
- **Launch Day**

You can check off tasks, add your own tasks to any section, remove tasks, and reset everything back to the defaults. Each section shows its own progress, and an overall progress bar tracks the whole launch.

Progress is saved in your browser's `localStorage`, so it stays put when you reload the page on the same browser and device. It is not shared with teammates.

## Open it locally

No install, build step, or server is required.

1. Clone or download this repository:
   ```bash
   git clone https://github.com/testlykGT01/test1.git
   cd test1/team-launch-checklist
   ```
2. Open `index.html` in your browser:
   - **macOS:** `open index.html`
   - **Windows:** `start index.html`
   - **Linux:** `xdg-open index.html`
   - Or double-click `index.html` in your file explorer.

### Optional: serve it over HTTP

Some browsers limit `localStorage` for pages opened directly from disk. If your progress isn't being saved, serve the folder instead:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page layout and section template |
| `app.js` | Default tasks, rendering, and saving to `localStorage` |
| `styles.css` | Styling |

## Customize the default tasks

Edit the `DEFAULT_SECTIONS` array at the top of `app.js`. If you've already used the app, click **Reset checklist** to load the new defaults.
