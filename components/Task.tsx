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

  const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const handleClick = () => {
    onEdit(task);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-gray-200 rounded-md p-3 mb-2 cursor-pointer hover:border-gray-300 transition-colors ${task.completed ? "opacity-60" : ""
        }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          onClick={handleCheckboxClick}
          className="mt-1 cursor-pointer"
        />
        <div className="flex-1 min-w-0" {...attributes} {...listeners}>
          <div
            className={`font-medium mb-1 ${task.completed ? "line-through" : ""
              }`}
          >
            {task.code && (
              <span className="text-gray-500 font-normal mr-2">{task.code}</span>
            )}
            {task.title}
          </div>
          <div
            className={`text-sm text-gray-600 ${task.completed ? "line-through" : ""
              } truncate`}
          >
            {task.description || "Sem descrição"}
          </div>
        </div>
      </div>
    </div>
  );
}
