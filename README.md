# Northstar CRM Dashboard

A responsive CRM dashboard built with Angular 22, TypeScript, and SCSS. This repository currently contains the application shell, dashboard overview, and customer directory backed by typed mock data.

## Getting started

### Requirements

- Node.js supported by the installed Angular CLI
- npm

### Install and run

```bash
npm install
npm start
```

Open `http://localhost:4200/` in a browser. The development server reloads the app when source files change.

## Current features

- Responsive application shell with sidebar navigation, page title, header search field, and profile placeholder.
- Dashboard overview with four KPI cards:
  - Total Customers
  - Active Customers
  - New Customers (added in the last 30 days)
  - Pending Follow-ups (due today or overdue)
- Customer directory at `/customers` with mock customer records, search by name or email, status filtering, name/date sorting, and an empty state with a clear-filters action.
- Reports and Settings routes with placeholder pages for future work.
- Standalone Angular components, semantic HTML, accessible labels and table controls, and responsive SCSS.

## Project structure

```text
src/app/
  core/
    layout/app-shell/           # App layout and mobile navigation state
    models/                     # Customer and dashboard metric types
    services/                   # Customer mock data and dashboard metrics
  features/dashboard/
    components/                 # Header, sidebar, KPI cards, customer table
    pages/                      # Dashboard, customer directory, placeholders
  app.routes.ts                 # Dashboard and section routes
src/styles.scss                 # Global styles and shared CSS variables
```

Customer data is defined by the `Customer` interface in `src/app/core/models/customer.model.ts` and provided by `CustomerService`. `DashboardService` derives the KPI values from those records. No backend API or persistence layer is configured.

## Available scripts

```bash
npm start        # Run the development server
npm run build    # Create a production build
npm test         # Run the configured unit test command
```

## Current scope and next steps

- Customer records and KPI values are based on local mock data; changes are not persisted.
- The header search, account/profile, and notification controls are visual placeholders.
- Reports, Settings, and adding customers are not implemented yet.
- This README will be updated as the application grows.
