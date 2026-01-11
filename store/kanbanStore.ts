import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { KanbanStore, Column, Task } from "@/types";

const STORAGE_KEY = "kanban-board-state";

const defaultColumns: Column[] = [
  {
    id: "backlog",
    title: "Backlog",
    backgroundColor: "#f3f4f6",
    textColor: "#000000",
  },
  {
    id: "a-fazer",
    title: "A fazer",
    backgroundColor: "#f3f4f6",
    textColor: "#000000",
  },
  {
    id: "fazendo",
    title: "Fazendo",
    backgroundColor: "#f3f4f6",
    textColor: "#000000",
  },
  {
    id: "pronto",
    title: "Pronto",
    backgroundColor: "#f3f4f6",
    textColor: "#000000",
  },
];

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set, get) => ({
      columns: [],
      tasks: [],

      initializeStore: () => {
        const state = get();
        if (state.columns.length === 0) {
          set({ columns: defaultColumns });
        }
      },

      addColumn: (column) => {
        const newColumn: Column = {
          ...column,
          id: generateId(),
        };
        set((state) => ({
          columns: [...state.columns, newColumn],
        }));
      },

      updateColumn: (id, updates) => {
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === id ? { ...col, ...updates } : col
          ),
        }));
      },

      deleteColumn: (id) => {
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id),
          tasks: state.tasks.filter((task) => task.columnId !== id),
        }));
      },

      reorderColumns: (activeId, overId) => {
        set((state) => {
          const columns = [...state.columns];
          const activeIndex = columns.findIndex((col) => col.id === activeId);
          const overIndex = columns.findIndex((col) => col.id === overId);

          if (activeIndex === -1 || overIndex === -1) return state;

          const [removed] = columns.splice(activeIndex, 1);
          columns.splice(overIndex, 0, removed);

          return { columns };
        });
      },

      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: generateId(),
        };
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      reorderTasks: (activeId, overId, newColumnId) => {
        set((state) => {
          const activeTask = state.tasks.find((t) => t.id === activeId);
          if (!activeTask) return state;

          const targetColumnId = newColumnId || activeTask.columnId;
          const isMovingColumn = newColumnId && activeTask.columnId !== newColumnId;

          if (isMovingColumn) {
            const overTask = state.tasks.find((t) => t.id === overId);
            if (!overTask) return state;

            const newColumnTasks = state.tasks.filter(
              (t) => t.columnId === targetColumnId && t.id !== activeId
            );
            const otherTasks = state.tasks.filter(
              (t) => t.columnId !== targetColumnId && t.id !== activeId && t.columnId !== activeTask.columnId
            );
            const oldColumnTasks = state.tasks.filter(
              (t) => t.columnId === activeTask.columnId && t.id !== activeId
            );

            const overIndex = newColumnTasks.findIndex((t) => t.id === overId);
            const updatedTask = { ...activeTask, columnId: targetColumnId };
            newColumnTasks.splice(overIndex >= 0 ? overIndex : newColumnTasks.length, 0, updatedTask);

            return {
              tasks: [...otherTasks, ...oldColumnTasks, ...newColumnTasks],
            };
          } else {
            const columnTasks = state.tasks.filter((t) => t.columnId === targetColumnId);
            const otherTasks = state.tasks.filter((t) => t.columnId !== targetColumnId);

            const activeIndex = columnTasks.findIndex((t) => t.id === activeId);
            const overIndex = columnTasks.findIndex((t) => t.id === overId);

            if (activeIndex === -1 || overIndex === -1) return state;

            const [removed] = columnTasks.splice(activeIndex, 1);
            columnTasks.splice(overIndex, 0, removed);

            return {
              tasks: [...otherTasks, ...columnTasks],
            };
          }
        });
      },

      moveTask: (taskId, newColumnId) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task || task.columnId === newColumnId) return state;

          return {
            tasks: state.tasks.map((t) =>
              t.id === taskId ? { ...t, columnId: newColumnId } : t
            ),
          };
        });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
