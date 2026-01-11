import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { KanbanStore, Column, Task } from "@/types";

const STORAGE_KEY = "kanban-board-state";

const getDefaultColumns = (): Column[] => {
  const now = Date.now();
  return [
    {
      id: "backlog",
      title: "Backlog",
      backgroundColor: "#f3f4f6",
      textColor: "#000000",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "a-fazer",
      title: "A fazer",
      backgroundColor: "#f3f4f6",
      textColor: "#000000",
      createdAt: now + 1,
      updatedAt: now + 1,
    },
    {
      id: "fazendo",
      title: "Fazendo",
      backgroundColor: "#f3f4f6",
      textColor: "#000000",
      createdAt: now + 2,
      updatedAt: now + 2,
    },
    {
      id: "pronto",
      title: "Pronto",
      backgroundColor: "#f3f4f6",
      textColor: "#000000",
      createdAt: now + 3,
      updatedAt: now + 3,
    },
  ];
};

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const generateTaskCode = (existingTasks: Task[]): string => {
  const maxCode = existingTasks.reduce((max, task) => {
    const match = task.code?.match(/^TASK-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      return Math.max(max, num);
    }
    return max;
  }, 0);
  const nextNumber = maxCode + 1;
  return `TASK-${nextNumber.toString().padStart(5, "0")}`;
};

export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set, get) => ({
      columns: [],
      tasks: [],

      initializeStore: () => {
        const state = get();
        if (state.columns.length === 0) {
          set({ columns: getDefaultColumns() });
        }
        // Migrar tasks existentes sem código
        const tasksWithoutCode = state.tasks.filter((task) => !task.code);
        if (tasksWithoutCode.length > 0) {
          let currentMax = state.tasks.reduce((max, task) => {
            const match = task.code?.match(/^TASK-(\d+)$/);
            if (match) {
              const num = parseInt(match[1], 10);
              return Math.max(max, num);
            }
            return max;
          }, 0);

          const tasksWithCode = state.tasks.map((task) => {
            if (!task.code) {
              currentMax += 1;
              return {
                ...task,
                code: `TASK-${currentMax.toString().padStart(5, "0")}`,
              };
            }
            return task;
          });
          set({ tasks: tasksWithCode });
        }
      },

      addColumn: (column) => {
        const now = Date.now();
        const newColumn: Column = {
          ...column,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          columns: [...state.columns, newColumn],
        }));
      },

      updateColumn: (id, updates) => {
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === id ? { ...col, ...updates, updatedAt: Date.now() } : col
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
        const now = Date.now();
        const state = get();
        const newTask: Task = {
          ...task,
          id: generateId(),
          code: generateTaskCode(state.tasks),
          createdAt: now,
          updatedAt: now,
        };
        set((currentState) => ({
          tasks: [...currentState.tasks, newTask],
        }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates, updatedAt: Date.now() } : task
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
            const updatedTask = { ...activeTask, columnId: targetColumnId, updatedAt: Date.now() };
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
              t.id === taskId ? { ...t, columnId: newColumnId, updatedAt: Date.now() } : t
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
