"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { useKanbanStore } from "@/store/kanbanStore";
import Column from "./Column";
import Task from "./Task";
import TaskModal from "./TaskModal";
import AddColumnModal from "./AddColumnModal";
import type { Task as TaskType } from "@/types";

export default function Board() {
  const {
    columns,
    tasks,
    initializeStore,
    reorderColumns,
    reorderTasks,
    moveTask,
  } = useKanbanStore();

  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === "task") {
      setActiveTask(active.data.current.task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === "column" && overType === "column") {
      reorderColumns(active.id as string, over.id as string);
    } else if (activeType === "task") {
      const task = active.data.current?.task as TaskType;
      const overId = over.id as string;

      if (overType === "task") {
        const overTask = over.data.current?.task as TaskType;
        reorderTasks(active.id as string, overId, overTask.columnId);
      } else if (overType === "column") {
        moveTask(task.id, overId);
      }
    }

    setActiveTask(null);
  };

  const handleTaskEdit = (task: TaskType) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleAddColumnClick = () => {
    setIsAddColumnModalOpen(true);
  };

  const handleAddColumnModalClose = () => {
    setIsAddColumnModalOpen(false);
  };

  const columnIds = columns.map((col) => col.id);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex overflow-x-auto p-6 min-h-screen bg-[#F9F9F9]">
          <SortableContext
            items={columnIds}
            strategy={horizontalListSortingStrategy}
          >
            {columns.map((column) => {
              const columnTasks = tasks.filter(
                (task) => task.columnId === column.id
              );
              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  onTaskEdit={handleTaskEdit}
                />
              );
            })}
          </SortableContext>
          <div
            className="rounded-t-md h-10 mb-3 flex flex-col items-center justify-center relative group bg-[#f5f5f5] flex-shrink-0 w-80"
          >
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddColumnClick();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-full text-sm text-center font-medium text-zinc-950 hover:text-zinc-700 transition-colors">
                + New column
              </button>
            </div>
          </div>
          {/* <div className="flex-shrink-0 w-80 mr-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAddColumnClick();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="text-sm font-medium text-zinc-950 hover:text-zinc-700 transition-colors">
              + New column
            </button>
          </div> */}
        </div>
        <DragOverlay>
          {activeTask ? <Task task={activeTask} onEdit={handleTaskEdit} /> : null}
        </DragOverlay>
      </DndContext>
      <TaskModal
        task={editingTask}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
      <AddColumnModal
        isOpen={isAddColumnModalOpen}
        onClose={handleAddColumnModalClose}
      />
    </>
  );
}
