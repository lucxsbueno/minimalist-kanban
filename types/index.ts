export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  columnId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Column {
  id: string;
  title: string;
  backgroundColor: string;
  textColor: string;
  createdAt: number;
  updatedAt: number;
}

export interface KanbanStore {
  columns: Column[];
  tasks: Task[];
  initializeStore: () => void;
  addColumn: (column: Omit<Column, "id" | "createdAt" | "updatedAt">) => void;
  updateColumn: (id: string, updates: Partial<Omit<Column, "id" | "createdAt" | "updatedAt">>) => void;
  deleteColumn: (id: string) => void;
  reorderColumns: (activeId: string, overId: string) => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (activeId: string, overId: string, newColumnId?: string) => void;
  moveTask: (taskId: string, newColumnId: string) => void;
}
