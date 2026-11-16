# Team Launch Checklist

A lightweight, static app with 16 tasks across **Planning**, **Content**, **Approvals**, and **Launch day**. Check off tasks to update the progress bar. Resetting the checklist requires confirmation.

## Open locally

1. Clone this repository or download its ZIP from GitHub and extract it.
2. Open `launch-checklist/index.html` in your browser (double-click the file).

The HTML, CSS, and JavaScript files must stay together. No install, build, server, account, or internet connection is required. JavaScript must be enabled.

## Saving progress

Checkmarks are stored in this browser's local storage. Reopening the same file in the same browser usually restores them. Storage behavior for local files varies by browser; private browsing, moving the folder, or clearing browser data may lose progress. If saving is unavailable, the app displays a warning and continues working for the current page session.

This is a team-oriented checklist template, **not a shared task database**: teammates opening their own copies have independent checkmarks. There is no backend, cross-device synchronization, or approval audit trail. Checking an approval task records only a local checkmark.

## Customize

Edit the `sections` array in `app.js` to change task names or add tasks. Keep each task ID unique and stable so saved checkmarks remain associated with the correct task. Progress totals are calculated from the task list.

## Quick checks

- A fresh checklist displays all four sections and 0 of 16 tasks complete.
- Checking and unchecking tasks updates the total and progress bar.
- Reloading restores checkmarks when local storage is available.
- Checking every task displays the ready-to-launch message.
- Canceling Reset keeps progress; confirming Reset clears it.
- At narrow widths the sections stack in one column. Use Tab and Space to operate checkboxes with a keyboard.
