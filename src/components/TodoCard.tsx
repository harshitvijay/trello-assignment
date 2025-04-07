'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '@/types';

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoCard({ todo, onEdit, onDelete }: TodoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description || '');
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo.id,
    data: {
      type: 'todo',
      todo
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  // Get colors based on status
  const getStatusColors = () => {
    switch (todo.status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'inProgress':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (todo.status) {
      case 'pending':
        return 'Pending';
      case 'inProgress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return todo.status;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit({
      ...todo,
      title: editedTitle,
      description: editedDescription
    });
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg p-4 border shadow card-transition
        ${isDragging ? 'rotate-1 border-blue-300 shadow-lg' : 'border-gray-200'}
        ${isHovered ? 'shadow-md' : 'shadow-sm'}
        hover:shadow-md hover:border-gray-300 cursor-grab active:cursor-grabbing animate-scaleIn
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              id="title"
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="Title"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="Description"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-800 text-base">{todo.title}</h3>
            <div className="flex space-x-1 transition-opacity opacity-70 hover:opacity-100">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-blue-500"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-red-500"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
          {todo.description && (
            <p className="text-sm text-gray-600 mt-2 mb-3">{todo.description}</p>
          )}
          <div className="mt-2 text-xs">
            <span className={`inline-block px-2.5 py-1 rounded-full font-medium ${getStatusColors()}`}>
              {getStatusText()}
            </span>
            <span className="text-gray-500 text-xs ml-2">ID: {todo.id.substring(0, 4)}</span>
          </div>
        </>
      )}
    </div>
  );
} 