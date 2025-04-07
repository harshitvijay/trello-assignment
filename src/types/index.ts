export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  userId: number;
  description?: string;
  status: 'pending' | 'inProgress' | 'completed';
}

export interface Lane {
  id: string;
  title: string;
  todos: Todo[];
}

export interface DummyJSONResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
} 