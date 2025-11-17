# trackwise
Personal Expense Tracker

Trackwise is a modern, clean, and efficient expense tracking application built with React, TypeScript, Vite, Zustand, and shadcn/ui.
Designed with a sleek analytic dashboard, Trackwise helps users understand their spending habits with clarity — all without a backend.

This project is fully client-side and stores data securely using localStorage.

**Tech Stack**

- Frontend

  - React + TypeScript
  - Vite
  - Tailwind CSS
  - shadcn/ui (Radix primitives + Tailwind components)
  - Recharts (for charts)

- State Management

  - Zustand
  - Zustand Persist (localStorage)

- Testing

  - Jest
  - React Testing Library

**Features**

- Core

  - Add expenses (amount, category, date, note)
  - Edit expenses
  - Delete expenses
  - Filter by category or month
  -  Category management
  -  LocalStorage data persistence
  - Derived totals (e.g., monthly total, category totals)

- Dashboard

  - Monthly spending chart
  - Category breakdown
  - Recent expenses list
  - Summary cards (total spent, biggest category, etc.)

- UI/UX

  - Responsive layout
  - Sidebar navigation
  - Light mode (Dark mode later)
  - shadcn/ui components (Dialog, Button, Card, Table, Input)

- Testing

  - Unit tests for the Zustand store (add/edit/remove/getTotal)
  - Component tests for AddExpense form + tables
  - Integration tests for the add → filter → delete flow
