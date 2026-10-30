# Code Tab QA Sample App

This disposable repo fixture is for human QA of Code Tab's GitHub/repo workflows.

## What it is

A static feature-request dashboard showing each request's ID, title, priority, status, and owner. The app renders sample data embedded in `src/app.js`; `data/feature-requests.csv` contains a matching fixture and is not loaded at runtime.

Use the Priority and Status dropdowns to filter requests. Both filters apply together; choose All to remove that filter. Status options are Backlog, Planned, and In Progress. If no requests match, the dashboard displays an empty-state message.

## How to run

Open `src/index.html` in a browser. No server, build step, or dependencies are required.

## QA task

Ask Code Tab to review the repo and add a status filter while preserving the existing priority filter.
