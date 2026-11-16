# Code Tab QA Sample App

This disposable repo fixture is for human QA of Code Tab's GitHub/repo workflows.

## What it is

A static feature-request dashboard showing five sample requests with their ID, title, priority, status, and owner. The displayed data is embedded in `src/app.js`; `data/feature-requests.csv` contains a matching fixture and is not loaded at runtime.

Filter requests by priority and status (Backlog, Planned, or In Progress). Both filters apply together. Changing status preserves the selected priority, even when no requests match; changing priority likewise preserves status. Choosing All removes only that filter. A message appears when no requests match.

## How to run

Open `src/index.html` in a browser. No server, build step, package installation, or network connection is needed.

## Manual verification

- Both filters start at All and show all five requests.
- Priority High shows FR-101 and FR-104.
- Status In Progress with priority All shows FR-102 and FR-104.
- Priority High with status Planned shows only FR-101.
- Priority Low with status Planned shows the no-matches message.
- Reset both filters to All to restore all five requests.

## Regression test

With Node.js installed, run `node tests/status-filter.test.js` from this fixture directory. The test uses DOM stubs to verify that changing status never resets priority, both filters apply together, and empty results and All preserve the other selection. Node.js is optional for testing and is not needed to open the app.

## QA task

Ask Code Tab to review the repo and add a status filter while preserving the existing priority filter.
