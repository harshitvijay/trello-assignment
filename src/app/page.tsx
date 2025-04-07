import Board from '@/components/Board';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
            Todo Assignment 
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
           Here is a simple drag-and-drop Kanban board. Add new tasks, move them between columns, edit details, and mark them as complete.
          </p>
        </header>
        
        <Board />
        
        <footer className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>By: Harshit</p>
          <p className="mt-1">© {new Date().getFullYear()} Assignment Task Board</p>
        </footer>
      </div>
    </main>
  );
}
