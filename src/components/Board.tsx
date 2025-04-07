'use client';

import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter, 
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent
} from '@dnd-kit/core';
import { toast, Toaster } from 'react-hot-toast';
import Lane from './Lane';
import AddTodoForm from './AddTodoForm';
import { Lane as LaneType, Todo } from '@/types';
import { todoService } from '@/services/todoService';

export default function Board() {
  const [lanes, setLanes] = useState<LaneType[]>([
    { id: 'pending', title: 'Pending', todos: [] },
    { id: 'inProgress', title: 'In Progress', todos: [] },
    { id: 'completed', title: 'Completed', todos: [] },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const todos = await todoService.fetchTodos();
      
      // Distribute todos to lanes based on their status
      const updatedLanes = lanes.map(lane => {
        return {
          ...lane,
          todos: todos.filter(todo => todo.status === lane.id)
        };
      });
      
      setLanes(updatedLanes);
      setError(null);
    } catch (err) {
      setError('Failed to load todos. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;
    
    if (activeData?.type === 'todo') {
      setActiveTodo(activeData.todo);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id;
    
    // Find the active todo
    const activeData = active.data.current;
    if (!activeData || activeData.type !== 'todo') return;
    
    // Find the destination lane
    const overData = over.data.current;
    
    // If hovering over a todo, we need to get its parent lane
    let destLaneId;
    if (overData?.type === 'todo') {
      const overTodo = overData.todo;
      destLaneId = overTodo.status;
    } else if (overData?.type === 'lane') {
      destLaneId = overData.laneId;
    } else {
      return;
    }
    
    // Find the source lane
    const sourceLaneId = activeData.todo.status;
    
    // If the source and destination lanes are the same, do nothing
    if (sourceLaneId === destLaneId) return;
    
    // Clone the lanes array
    const newLanes = [...lanes];
    
    // Find the source lane and remove the todo
    const sourceLane = newLanes.find(lane => lane.id === sourceLaneId);
    const destLane = newLanes.find(lane => lane.id === destLaneId);
    
    if (!sourceLane || !destLane) return;
    
    // Find the todo index in the source lane
    const todoIndex = sourceLane.todos.findIndex(todo => todo.id === activeId);
    if (todoIndex === -1) return;
    
    // Remove the todo from the source lane
    const [movedTodo] = sourceLane.todos.splice(todoIndex, 1);
    
    // Update the todo's status
    const updatedTodo = {
      ...movedTodo,
      status: destLaneId as 'pending' | 'inProgress' | 'completed',
      completed: destLaneId === 'completed'
    };
    
    // Add the todo to the destination lane
    destLane.todos.push(updatedTodo);
    
    // Update the lanes state
    setLanes(newLanes);
    
    // Store the updated todo for the API call when drag ends
    setActiveTodo(updatedTodo);
    
    // Log for debugging
    console.log(`Moved todo ${updatedTodo.id} from ${sourceLaneId} to ${destLaneId}`);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    
    if (!over || !activeTodo) return;
    
    // Update the todo in the API
    // Note: Always update regardless of the bucket
    const updatedTodo = {
      ...activeTodo,
      completed: activeTodo.status === 'completed'
    };
    updateTodo(updatedTodo);
    
    // Log for debugging
    console.log(`Drag ended, updating todo ${updatedTodo.id} in API`);
    
    // Reset the active todo
    setActiveTodo(null);
  };

  const handleAddTodo = async (newTodo: Omit<Todo, 'id'>) => {
    try {
      const addedTodo = await todoService.createTodo(newTodo);
      
      console.log('New todo created:', addedTodo); // Debug log
      
      // Add the new todo to the pending lane regardless of API response
      const updatedLanes = lanes.map(lane => {
        if (lane.id === 'pending') {
          return {
            ...lane,
            todos: [...lane.todos, addedTodo]
          };
        }
        return lane;
      });
      
      setLanes(updatedLanes);
      toast.success('Todo added successfully!');
    } catch (err) {
      toast.error('Failed to add todo. Please try again.');
      console.error(err);
    }
  };

  const handleEditTodo = async (updatedTodo: Todo) => {
    try {
      await todoService.updateTodo(updatedTodo);
      
      // Update the todo in the lanes
      const updatedLanes = lanes.map(lane => {
        if (lane.id === updatedTodo.status) {
          return {
            ...lane,
            todos: lane.todos.map(todo => 
              todo.id === updatedTodo.id ? updatedTodo : todo
            )
          };
        }
        return lane;
      });
      
      setLanes(updatedLanes);
      toast.success('Todo updated successfully!');
    } catch (err) {
      toast.error('Failed to update todo. Please try again.');
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      
      // Remove the todo from lanes
      const updatedLanes = lanes.map(lane => {
        return {
          ...lane,
          todos: lane.todos.filter(todo => todo.id !== id)
        };
      });
      
      setLanes(updatedLanes);
      toast.success('Todo deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete todo. Please try again.');
      console.error(err);
    }
  };

  const updateTodo = async (todo: Todo) => {
    try {
      await todoService.updateTodo(todo);
      toast.success('Todo status updated!');
    } catch (err) {
      toast.error('Failed to update todo status. Please try again.');
      console.error(err);
      
      // Revert the changes if the API call fails
      fetchTodos();
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading todos...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>{error}</p>
        <button 
          onClick={fetchTodos}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-right" />
      <AddTodoForm onAddTodo={handleAddTodo} />
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lanes.map((lane, index) => (
            <div 
              key={lane.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Lane
                lane={lane}
                onEditTodo={handleEditTodo}
                onDeleteTodo={handleDeleteTodo}
              />
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
} 