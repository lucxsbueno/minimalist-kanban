export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
  backgroundColor: string;
  textColor: string;
}

export interface KanbanStore {
  columns: Column[];
  tasks: Task[];
  initializeStore: () => void;
  addColumn: (column: Omit<Column, "id">) => void;
  updateColumn: (id: string, updates: Partial<Omit<Column, "id">>) => void;
  deleteColumn: (id: string) => void;
  reorderColumns: (activeId: string, overId: string) => void;
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, "id">>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (activeId: string, overId: string, newColumnId?: string) => void;
  moveTask: (taskId: string, newColumnId: string) => void;
}
