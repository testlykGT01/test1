# Code Tab QA Sample App

This disposable repo fixture is for human QA of Code Tab's GitHub/repo workflows.

## What it is

A static feature-request dashboard with sample data in `data/feature-requests.csv`.

Requests can be filtered by priority and by status. The filters combine, and the
dashboard shows how many requests are currently visible.

Both selections are stored in the URL query string (for example
`index.html?priority=High&status=Planned`), so reloading the page or sharing the
link keeps the same filters applied.

## How to run

Open `src/index.html` in a browser.

## QA task

Ask Code Tab to review the repo and add a status filter while preserving the existing priority filter.
