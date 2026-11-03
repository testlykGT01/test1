# Code Tab QA Sample App

This disposable repo fixture is for human QA of Code Tab's GitHub/repo workflows.

## What it is

A static feature-request dashboard displaying five sample requests with their title, priority, status, and owner. The app uses hardcoded data in `src/app.js`; `data/feature-requests.csv` contains a matching reference copy and is not loaded at runtime.

## How to run

Open `src/index.html` in a browser. No server, package installation, or build step is required.

## Filters

Use **Priority** (All, High, Medium, Low) and **Status** (All, Planned, In Progress, Backlog) to narrow the cards. Both filters apply together, and each defaults to All. Selecting All clears only that filter. If no requests match, the dashboard shows an empty-state message.

Changing Status preserves the currently selected Priority, including when Status is set to All. For example, Priority High with Status In Progress shows only FR-104; changing Status to Planned shows only FR-101 while Priority stays High.

## Regression tests

Open `tests/index.html` in a browser. It loads the real `src/app.js` against test controls and checks all 16 priority/status combinations, priority retention on every status change, empty results, and independent filter resets. The page displays PASS or FAIL. No test packages or server are needed.

## Manual checks

- On first load, all five requests appear.
- Status In Progress shows FR-102 and FR-104.
- Priority High with Status In Progress shows only FR-104.
- Priority High with Status Backlog shows the no-matches message.
- Set Status to All to restore both High-priority requests; set Priority to All to restore all five.
- With Status All, Priority Medium shows FR-102 and FR-105; Priority Low shows FR-103.

## QA task

Ask Code Tab to review the repo and add a status filter while preserving the existing priority filter.
