import { Todo, DummyJSONResponse } from '@/types';

const API_URL = 'https://dummyjson.com/todos';

// For generating unique IDs when API calls fail
let mockTodoId = 200;

export const todoService = {
  async fetchTodos(): Promise<Todo[]> {
    try {
      const response = await fetch(API_URL, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data: DummyJSONResponse = await response.json();
      
      // Add status field to todos based on completed field
      // Distribute some pending todos to the inProgress lane
      return data.todos.map((todo, index) => {
        // Determine the status - assign every third non-completed todo to inProgress
        let status: 'pending' | 'inProgress' | 'completed';
        
        if (todo.completed) {
          status = 'completed';
        } else if (index % 3 === 1) { // Every third non-completed todo goes to inProgress
          status = 'inProgress';
        } else {
          status = 'pending';
        }
        
        return {
          ...todo,
          status,
          // Convert id to string if it's a number
          id: todo.id.toString(),
          // Add description if not present
          description: todo.description || ''
        };
      });
    } catch (error) {
      console.error('Error fetching todos:', error);
      
      // Return mock data if API fails
      return getMockTodos();
    }
  },

  async createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
    try {
      const response = await fetch(API_URL + '/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create todo');
      }
      
      const data = await response.json();
      return {
        ...data,
        ...todo,
        id: data.id.toString(),
        // Always set to pending, regardless of API response
        status: 'pending',
        completed: false,
        description: data.description || todo.description || ''
      };
    } catch (error) {
      console.error('Error creating todo:', error);
      
      // Return mock todo if API fails
      return createMockTodo(todo);
    }
  },

  async updateTodo(todo: Todo): Promise<Todo> {
    try {
      const response = await fetch(`${API_URL}/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      
      const data = await response.json();
      return {
        ...data,
        id: data.id.toString(),
        status: todo.status,
        description: data.description || todo.description || ''
      };
    } catch (error) {
      console.error('Error updating todo:', error);
      // Return the same todo if API fails
      return todo;
    }
  },

  async deleteTodo(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      
      await response.json();
    } catch (error) {
      console.error('Error deleting todo:', error);
      // Do nothing if API fails; the UI will handle it
    }
  }
};

// Mock data functions
function getMockTodos(): Todo[] {
  return [
    {
      id: '1',
      title: 'Complete project documentation',
      completed: false,
      status: 'pending',
      userId: 1,
      description: 'Write comprehensive documentation for the project'
    },
    {
      id: '2',
      title: 'Code review for PR #123',
      completed: false,
      status: 'inProgress',
      userId: 1,
      description: 'Review the pull request for the new feature'
    },
    {
      id: '3',
      title: 'Fix login bug',
      completed: true,
      status: 'completed',
      userId: 1,
      description: 'The login page has an issue with validation'
    },
    {
      id: '4',
      title: 'Update dependencies',
      completed: false,
      status: 'pending',
      userId: 1,
      description: 'Update all npm packages to latest versions'
    },
    {
      id: '5',
      title: 'Deploy to production',
      completed: false,
      status: 'pending',
      userId: 1,
      description: 'Deploy the latest changes to production environment'
    },
    {
      id: '6',
      title: 'Create user profile page',
      completed: false,
      status: 'inProgress',
      userId: 1,
      description: 'Design and implement the user profile page'
    },
    {
      id: '7',
      title: 'Update README',
      completed: false,
      status: 'inProgress',
      userId: 1,
      description: 'Add instructions for installation and usage'
    }
  ];
}

function createMockTodo(todo: Omit<Todo, 'id'>): Todo {
  mockTodoId++;
  return {
    ...todo,
    id: mockTodoId.toString(),
    status: 'pending', // Always ensure status is pending
    completed: false
  };
} 