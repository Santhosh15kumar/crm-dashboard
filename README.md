# Northstar CRM Dashboard

A responsive CRM dashboard built with Angular 22, TypeScript, and SCSS. The project uses standalone components and stores customer records in the current browser's LocalStorage. It does not connect to a backend.

## Getting started

### Requirements

- Node.js version supported by the installed Angular CLI
- npm

### Install and run

```bash
npm install
npm start
```

Open `http://localhost:4200/` in a browser.

## Features

- Responsive application shell with sidebar navigation, page title, header search field, and profile placeholder.
- Dashboard overview with four customer metrics:
  - **Total Customers** — all customer records.
  - **Active Customers** — records with active status.
  - **New Customers** — records created in the last 30 days.
  - **Pending Follow-ups** — follow-ups due at or before the current date and time.
- Customer directory at `/customers` with case-insensitive search by name or email, status filtering, name/date sorting, and an empty state with a clear-filters action.
- Customer CRUD using a Reactive Forms modal: add, edit, and delete with confirmation. Required fields, email format, and field length are validated.
- Customer changes update dashboard metrics immediately and are saved to LocalStorage. Valid stored records are loaded during browser application initialization.
- Missing storage starts with typed sample records. Empty, malformed, or invalid stored data falls back to sample records and shows a warning. A valid empty array is treated as an intentionally empty directory. Storage write failures keep changes in the current session and display a warning.
- Reports and Settings routes currently display placeholder pages.
- Accessible labels, semantic page structure, keyboard-operable controls, and responsive layouts.

## Architecture

```text
src/app/
  core/
    layout/app-shell/            # Shared dashboard layout
    models/                      # Customer and dashboard metric types
    services/                    # Customer data/storage and dashboard metrics
  features/dashboard/
    components/                  # Header, sidebar, KPI cards, table, customer form
    pages/                       # Dashboard, customer directory, placeholders
  app.config.ts                  # Providers and customer initialization
  app.routes.ts                  # Application routes
src/styles.scss                  # Global styles and shared CSS variables
```

`Customer` and form types are declared in `src/app/core/models/customer.model.ts`. `CustomerService` owns the reactive customer collection and LocalStorage access; UI components use the service rather than accessing storage directly. `DashboardService` derives metrics from that collection, so CRUD changes are reflected in the KPI cards.

LocalStorage is browser-local and tied to the current browser profile. It is not a backend, does not sync across devices, and can be cleared by the user or browser.

## Tests

The project uses the Angular unit-test builder with Vitest and jsdom. Tests cover:

- Customer service create, update, delete, stored data loading, malformed/invalid storage, and storage write failure.
- Customer directory search, status filtering, combined filters, sorting, and empty-state clearing.
- Dashboard KPI calculations and updates as customer records change.
- Customer form validation, normalized submission, edit prefilling, and reset behavior.

Run the unit tests once:

```bash
npm test -- --watch=false
```

## Available scripts

```bash
npm start        # Run the development server
npm run build    # Create a production build
npm test         # Run the configured unit test command
```

## Current scope

- Customer records persist only in LocalStorage; there is no backend API or cross-device synchronization.
- Header search, profile, and notification controls are visual placeholders.
- Reports and Settings are placeholder pages.
- This README will evolve as project features are added.
