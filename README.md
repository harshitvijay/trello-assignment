# Trello-Like Kanban Board

A responsive, drag-and-drop task management application built with Next.js 15 and TypeScript.

![Kanban Board Demo](https://github.com/harshitvijay/assignment/assets/xxxxx/gif-placeholder.png)

## 🔗 Links

- [Live Demo (GitHub Pages)](https://harshitvijay.github.io/assignment/)
- [GitHub Repository](https://github.com/harshitvijay/assignment)

## ✨ Features

- Drag-and-drop task management across different lanes (Pending, In Progress, Completed)
- Create, edit, and delete tasks
- Persists state with API or fallback to local state if API is unavailable
- Fully responsive design for all device sizes
- Elegant UI with smooth animations
- Error handling with toast notifications

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/harshitvijay/assignment.git
cd assignment
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Design Decisions & Architecture

### Code Structure & Design Patterns

- **Component-Based Architecture**: The application is built using reusable components (Board, Lane, TodoCard, AddTodoForm), making the codebase modular and maintainable.
- **Service Layer Pattern**: API interactions are abstracted into a service layer (`todoService.ts`), keeping components focused on the UI.
- **State Management**: Using React's useState and useEffect hooks for local state management.
- **Typed Interfaces**: Strong TypeScript typing throughout the codebase to ensure type safety.

### Responsiveness and UI

- **Mobile-First Design**: The UI is designed to work on all screen sizes, prioritizing mobile experience.
- **TailwindCSS**: Used for styling with consistent design tokens and responsive utilities.
- **Drag and Drop**: Implemented using `@dnd-kit`, providing a smooth and accessible drag and drop experience.
- **Visual Feedback**: Hover states, transitions, and toast notifications for a polished user experience.

### Performance Optimization

- **Lazy Loading**: Images and non-critical assets are lazy-loaded.
- **Optimized Renders**: Components are structured to avoid unnecessary re-renders.
- **Error Handling**: Robust error handling with fallback UI states and helpful error messages.
- **Optimistic Updates**: UI updates immediately before API confirmation for a snappy experience.

## 🛠️ Technical Implementation

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS 4
- **Drag and Drop**: @dnd-kit/core and @dnd-kit/sortable
- **Notifications**: react-hot-toast
- **API Integration**: DummyJSON API with local fallbacks

## 🚧 Limitations & Future Improvements

- **Authentication**: Add user authentication and permission-based access.
- **Persistence**: Implement a real backend or database for true persistence.
- **Rich Text**: Add rich text editing for task descriptions.
- **Due Dates and Reminders**: Implement task due dates and reminder notifications.
- **Filtering and Sorting**: Add ability to filter and sort tasks by various criteria.
- **Attachments**: Allow file attachments to tasks.
- **Team Collaboration**: Add collaboration features like comments and assignments.

## 📝 License

MIT
