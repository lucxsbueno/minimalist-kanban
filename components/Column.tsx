"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2 } from "lucide-react";
import { useKanbanStore } from "@/store/kanbanStore";
import Task from "./Task";
import ColumnModal from "./ColumnModal";
import type { Column as ColumnType, Task as TaskType } from "@/types";

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
  onTaskEdit: (task: TaskType) => void;
}

export default function Column({ column, tasks, onTaskEdit }: ColumnProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const addTask = useKanbanStore((state) => state.addTask);
  const deleteColumn = useKanbanStore((state) => state.deleteColumn);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const taskIds = tasks.map((task) => task.id);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir a coluna "${column.title}"? Todas as tarefas nesta coluna também serão excluídas.`)) {
      deleteColumn(column.id);
    }
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAddTaskClick = () => {
    setIsAddingTask(true);
  };

  const handleCancelAddTask = () => {
    setIsAddingTask(false);
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  const handleSaveNewTask = () => {
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim(),
        completed: false,
        columnId: column.id,
      });
      setNewTaskTitle("");
      setNewTaskDescription("");
      setIsAddingTask(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSaveNewTask();
    } else if (e.key === "Escape") {
      handleCancelAddTask();
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="flex-shrink-0 w-80 mr-4"
      >
        <div
          className="rounded-t-md px-4 py-2 mb-3 relative group"
          style={{
            backgroundColor: column.backgroundColor,
            color: column.textColor,
          }}
          {...attributes}
          {...listeners}
        >
          <div className="flex items-center justify-between gap-2">
            <h2
              className="font-semibold text-sm cursor-pointer flex-1 hover:opacity-80"
              onClick={handleTitleClick}
            >
              {column.title}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEditClick}
                className="p-1 hover:opacity-70 transition-opacity cursor-pointer flex-shrink-0 opacity-0 group-hover:opacity-100"
                style={{ color: column.textColor }}
                aria-label="Edit column"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-1 hover:opacity-70 transition-opacity cursor-pointer flex-shrink-0 opacity-0 group-hover:opacity-100"
                style={{ color: column.textColor }}
                aria-label="Delete column"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <span className="font-semibold text-sm opacity-75">
                {tasks.length}
              </span>
            </div>
          </div>
        </div>
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="min-h-[200px]">
            {tasks.map((task) => (
              <Task key={task.id} task={task} onEdit={onTaskEdit} />
            ))}
            {isAddingTask ? (
              <div className="bg-white border border-gray-200 rounded-md p-3 mb-2">
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-2 py-1 mb-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  autoFocus
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  className="w-full px-2 py-1 mb-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleCancelAddTask}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNewTask}
                    disabled={!newTaskTitle.trim()}
                    className="px-3 py-1 text-sm bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAddTaskClick}
                className="w-full text-center text-sm font-medium text-zinc-300 hover:text-zinc-950 transition-colors"
              >
                + Add task
              </button>
            )}
          </div>
        </SortableContext>
      </div>
      <ColumnModal
        column={column}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </>
  );
}
