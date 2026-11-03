# Team Launch Checklist

A small, offline-friendly static app with 12 tasks across **Planning**, **Content**, **Approvals**, and **Launch day**. Check tasks off to update overall progress and each section's count. It uses plain HTML, CSS, and JavaScript with no dependencies or build step.

## Open locally

1. Clone this repository or download its ZIP from GitHub. Select the branch containing `launch-checklist/` before downloading.
2. If downloading a ZIP, extract it first.
3. Open `launch-checklist/index.html` in a modern browser by double-clicking it or using the browser's Open File command.

Keep `index.html`, `styles.css`, and `app.js` together in the same folder. No server, package installation, account, or internet connection is needed. GitHub's file viewer shows source code, not the running app; download the files to use it.

## Use the checklist

- Select or clear any checkbox; progress updates immediately.
- When browser storage is available, checked task IDs are saved in `localStorage` and restored when you reopen the app at the same location in the same browser profile.
- **Reset checklist** asks for confirmation, then clears all checkboxes and only this app's saved progress.
- Edit task labels in `index.html` to customize the checklist. Keep each `data-task` ID unique and stable to retain its saved state. Counts automatically adapt to the number of tasks.

## Storage limitations

Progress is local to each browser profile and app location. It is **not synchronized between teammates**, and uploading source files to GitHub does not upload checklist progress. Storage behavior for directly opened `file://` pages varies by browser. Moving the folder, clearing browser data, or using private browsing may lose or separate saved progress. If saving or reading fails, the app displays a warning and remains usable for the current session.

## Quick verification

1. First open: all four sections appear, with 0 of 12 tasks complete.
2. Check a Planning task: overall progress reads 1 of 12 and Planning reads 1 / 3.
3. Reload: the task remains checked if browser storage is available.
4. Check all tasks: progress reads 12 of 12 with a ready-to-launch message.
5. Cancel a reset: progress stays unchanged. Confirm a reset: progress returns to zero and stays cleared on reload.
6. Check keyboard navigation and narrow-window layout; tasks have native labeled checkboxes and visible focus indicators.
