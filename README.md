# Souste Kanban: Frontend

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

Souste Kanban is a full-stack Kanban task management application inspired by tools like Trello. It features drag-and-drop task management, responsive design, secure authentication, and detailed task tracking.

Backend Repository: https://github.com/souste/taskboard_backend

## Demo Video

🎥 [Souste Kanban Full Demo](https://youtu.be/UlOvm154tCk)

## Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS

### State Management

- React Context API

### Drag and Drop

- @dnd-kit/core
- @dnd-kit/sortable

## Features

- Create, edit, delete, and reorder columns and tasks
- Drag-and-drop task movement within and between columns
- Dedicated task detail pages with descriptions and comments
- Task completion tracking
- Secure JWT-based authentication
- Responsive layout for desktop and mobile devices
- Form validation for authentication and board actions
- Shared TypeScript types between frontend and backend

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
