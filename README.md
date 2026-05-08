# Souste Kanban: Frontend

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

Souste Kanban is a high-performance, responsive task management application inspired by Trello and Linear. It features a robust drag-and-drop interface, real-time state synchronization, and a mobile-first design.

Backend Repository available here: https://github.com/souste/taskboard_backend

## Demo Video

To be added 🎥

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **State & Context:** React Context API (Auth & Data)
- **Drag & Drop:** @dnd-kit/core & @dnd-kit/sortable
- **Backend:** Node.js, Express, PostgreSQL, JWT

## Features

- **Dynamic Kanban Board:** Create, update, and reorder lists and cards with an intuitive interface
- **Advanced Drag-and-Drop:** Smooth reordering of tasks within columns and between lists using **@dnd-kit**
- **Responsive Design:** Mobile-first layout with custom scroll-handling and **"safe-area"** padding for a native-app feel
- **Task Details:** Dedicated task view modal for managing descriptions, completion status, and comments
- **Type-Safe Architecture:** Fully centralized **TypeScript** definitions ensuring data consistency from database to UI
- **User Authentication:** Secure **JWT-based** login and signup with persisted sessions via LocalStorage
- **Form Validation:** Robust validation for task creation, column editing, and user authentication

## Getting Started

To run the frontend locally, follow these steps:

### Prerequisites

- **Node.js** (v20 or higher)
- **npm** (v10 or higher)

### Steps

1. Clone this [repository](https://github.com/souste/taskboard_frontend)
2. Install dependencies with `npm install`
3. Ensure the backend is running (see its README for setup)
4. Create a `.env` file with `VITE_API_URL=http://localhost:3000`
5. Start the frontend server: `npm run dev`
6. Open **http://localhost:5173/** in your browser
