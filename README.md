# Cartpanda Funnel Builder

A professional, drag-and-drop funnel builder application. Built with React, TypeScript, Tailwind CSS, and React Flow.

## Features

- **Infinite Canvas**: Pan, zoom, and navigate freely.
- **Drag & Drop Interface**: Add nodes from the sidebar (Sales, Order, Upsell, Downsell, Thank You).
- **Smart Validation**: 
  - Visual warnings for disconnected nodes.
  - Usage rules (e.g., "Sales Page" must connect to "Order Page").
  - "Thank You" pages cannot have outgoing connections.
- **Persistence**: Auto-saves work to local storage.
- **Import/Export**: Share funnels via JSON export.

## Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Diagramming**: [React Flow](https://reactflow.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)

## Project Structure

This project follows a Feature-Sliced Design approach:

```
src/
├── components/         # Shared UI components (Button, etc.)
│   ├── layout/         # App shell (TopBar, Sidebar, DashboardLayout)
│   └── ui/             # Primitive UI elements
├── features/           # Feature-based modules
│   └── funnels/        # Funnel Builder feature
│       ├── components/ # Feature-specific components
│       ├── hooks/      # Feature hooks (store)
│       └── types/      # Feature types
├── lib/                # Utilities (cn, etc.)
└── pages/              # Application routes
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## accessibility

This application strives to meet WCAG standards:
- Semantic HTML structure.
- ARIA labels for interactive elements.
- Keyboard navigation support for the canvas and sidebar.
