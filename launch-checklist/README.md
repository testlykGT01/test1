# Team Launch Checklist

A simple, static checklist for coordinating a team launch, with 16 tasks across **Planning**, **Content**, **Approvals**, and **Launch day**.

## Open locally

1. Clone this repository or download its ZIP from GitHub and extract it. Select the branch containing this app before downloading.
2. Open `launch-checklist/index.html` in a modern browser (double-click the file, or drag it into your browser).
3. Check tasks as you complete them. The launch readiness bar updates automatically.

No installation, dependencies, build step, account, or web server is required. Keep `index.html`, `styles.css`, and `app.js` together in the same directory.

## Saving progress

Progress is saved automatically using this browser's local storage. Reopening the same file in the same browser normally restores it. Browser settings may restrict storage for local files; the app displays a warning and remains usable if saving fails.

This is a team-oriented checklist template, **not a live collaborative service**: progress stays on your device and is not synced to teammates or GitHub. Private browsing, clearing browser data, or moving the file can remove or separate saved progress.

Use **Reset checklist** and confirm to clear all tasks. Edit the labels in `index.html` to customize tasks; keep checkbox IDs unique and stable so saved progress remains associated with the correct tasks.

## Files

- `index.html`: checklist sections and accessible controls.
- `styles.css`: responsive layout and styles.
- `app.js`: progress tracking, local persistence, and confirmed reset.
