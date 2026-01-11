"use client";

import { useEffect, useState } from "react";
import { useKanbanStore } from "@/store/kanbanStore";
import type { Task } from "@/types";

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskModal({ task, isOpen, onClose }: TaskModalProps) {
  const updateTask = useKanbanStore((state) => state.updateTask);
  const deleteTask = useKanbanStore((state) => state.deleteTask);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setShowDeleteConfirm(false);
    }
  }, [task]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const handleSave = () => {
    if (task) {
      updateTask(task.id, { title, description });
      onClose();
    }
  };

  const handleDelete = () => {
    if (task) {
      deleteTask(task.id);
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Editar Tarefa</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            autoFocus
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
          />
        </div>

        <div className="flex justify-between items-center">
          <div>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50"
              >
                Excluir
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Confirmar exclusão
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
