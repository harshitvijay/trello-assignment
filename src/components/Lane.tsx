'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TodoCard from './TodoCard';
import { Lane as LaneType, Todo } from '@/types';

interface LaneProps {
  lane: LaneType;
  onEditTodo: (todo: Todo) => void;
  onDeleteTodo: (id: string) => void;
}

export default function Lane({ lane, onEditTodo, onDeleteTodo }: LaneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: lane.id,
    data: { type: 'lane', laneId: lane.id }
  });

  // Different colors for each lane type
  const getLaneColors = () => {
    switch (lane.id) {
      case 'pending':
        return 'bg-blue-50 border-blue-200';
      case 'inProgress':
        return 'bg-amber-50 border-amber-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Different header colors for each lane type
  const getHeaderColors = () => {
    switch (lane.id) {
      case 'pending':
        return 'text-blue-700';
      case 'inProgress':
        return 'text-amber-700';
      case 'completed':
        return 'text-green-700';
      default:
        return 'text-gray-700';
    }
  };

  // Different badge colors for each lane type
  const getBadgeColors = () => {
    switch (lane.id) {
      case 'pending':
        return 'bg-blue-100 text-blue-700';
      case 'inProgress':
        return 'bg-amber-100 text-amber-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <div 
      className={`rounded-lg p-4 min-h-[500px] w-full md:w-80 flex flex-col shadow-md border transition-all duration-200 
      ${getLaneColors()} ${isOver ? 'ring-2 ring-blue-500 shadow-lg transform scale-[1.02]' : ''}`}
    >
      <h2 className={`font-bold text-lg mb-4 flex items-center justify-between ${getHeaderColors()}`}>
        <span className="flex items-center">
          {lane.id === 'pending' && <span className="mr-2">📋</span>}
          {lane.id === 'inProgress' && <span className="mr-2">⏳</span>}
          {lane.id === 'completed' && <span className="mr-2">✅</span>}
          {lane.title}
        </span>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${getBadgeColors()}`}>
          {lane.todos.length}
        </span>
      </h2>
      
      <div 
        ref={setNodeRef} 
        className={`flex-grow transition-colors duration-300 rounded-lg ${lane.todos.length === 0 
          ? `flex items-center justify-center border-2 border-dashed ${
              isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }` 
          : ''
        }`}
      >
        {lane.todos.length === 0 ? (
          <p className={`text-sm ${isOver ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            {isOver ? 'Drop here!' : 'Drop tasks here'}
          </p>
        ) : (
          <SortableContext 
            items={lane.todos.map(todo => todo.id)} 
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {lane.todos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onEdit={onEditTodo}
                  onDelete={onDeleteTodo}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
} 