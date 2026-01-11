"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useKanbanStore } from "@/store/kanbanStore";
import type { Task as TaskType } from "@/types";

interface TaskProps {
  task: TaskType;
  onEdit: (task: TaskType) => void;
}

export default function Task({ task, onEdit }: TaskProps) {
  const updateTask = useKanbanStore((state) => state.updateTask);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleToggleComplete = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    updateTask(task.id, { completed: !task.completed });
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleClick = () => {
    onEdit(task);
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const displayDate = task.updatedAt > task.createdAt
    ? task.updatedAt
    : task.createdAt;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`text-xs bg-white shadow-sm hover:shadow-md rounded-md p-3 mb-2 cursor-pointer hover:border-gray-300 transition-colors ${task.completed ? "opacity-60" : ""
        }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <label
          className="relative flex items-center justify-center cursor-pointer"
          onClick={handleCheckboxClick}
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            className="sr-only"
          />
          <div
            className={`w-4 h-4 mt-[2px] rounded-full border transition-all duration-200 flex items-center justify-center ${task.completed
              ? "bg-purple-600 border-purple-600"
              : "bg-white border-zinc-200 hover:border-purple-400"
              }`}
          >
            {task.completed && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </div>
        </label>
        <div className="flex-1 min-w-0" {...attributes} {...listeners}>
          <div
            className={`font-medium mb-1 ${task.completed ? "line-through" : ""
              }`}
          >
            {task.code && (
              <span className="mr-1 text-xs">{task.code}</span>
            )}
            {task.title}
          </div>
          {task.description && (
            <div
              className={`text-xs text-zinc-500 ${task.completed ? "line-through" : ""
                } truncate`}
            >
              {task.description}
            </div>
          )}
          <div className="text-xs text-zinc-400 mt-1">
            {formatDate(displayDate)}
          </div>
        </div>
      </div>
    </div>
  );
}
