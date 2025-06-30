import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux";
import {
  fetchTasks,
  addNew,
  removeOne,
  updateTask,
  toggleComplete,
  deleteCompleted,
} from "../redux/task.slice";
import TaskInput from "../components/TaskInput";
import TaskItem from "../components/TaskItem";
import Toast from "../components/Toast";
import CongratsOverlay from "../components/CongratsOverlay";
import ConfirmDeleteOverlay from "../components/ConfirmDeleteOverlay";
import { v4 as uuidv4 } from "uuid";

type Filter = "all" | "active" | "completed";

type ToastItem = {
  id: string;
  message: string;
  type: "success" | "error";
  action?: "add" | "delete" | "complete" | "duplicate" | "activate";
};

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [confirmDeleteTask, setConfirmDeleteTask] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);

  const [removingIds, setRemovingIds] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const allCompleted = tasks.length > 0 && tasks.every((t) => t.completed);
    setShowCongrats(allCompleted);
  }, [tasks]);

  const showToast = (toast: Omit<ToastItem, "id">) => {
    const id = uuidv4();
    const newToast: ToastItem = { ...toast, id };
    setToasts((prev) => {
      const next = [...prev, newToast];
      return next.length > 3 ? next.slice(next.length - 3) : next;
    });
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDeleteCompleted = () => {
    const completedIds = tasks.filter((t) => t.completed).map((t) => t.id);
    setRemovingIds(completedIds);
    setTimeout(() => {
      dispatch(deleteCompleted());
      setRemovingIds([]);
      showToast({
        message: "Completed tasks deleted.",
        type: "success",
        action: "delete",
      });
    }, 300);
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    dispatch(toggleComplete({ id, completed })).then(() => {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        showToast({
          message: completed
            ? `"${task.title}" marked as completed.`
            : `"${task.title}" is active again.`,
          type: "success",
          action: completed ? "complete" : "activate",
        });
      }
    });
  };

  const handleAddTask = (title: string) => {
    const existing = tasks.find(
      (t) => t.title.toLowerCase() === title.toLowerCase()
    );
    if (existing) {
      const message = existing.completed
        ? `"${title}" is already completed.`
        : `"${title}" already exists.`;
      showToast({
        message,
        type: "error",
        action: "duplicate",
      });
      return false;
    }

    dispatch(addNew(title));
    showToast({
      message: `"${title}" has been added.`,
      type: "success",
      action: "add",
    });
    return true;
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div className={`page-wrapper ${darkMode ? "dark" : "light"}`}>
      <header className="header">
        <h1>Todo List</h1>
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="toggle-theme-btn"
          title="Toggle Theme"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>

      <main className={`main-content ${confirmDeleteTask ? "blurred" : ""}`}>
        <TaskInput onAdd={handleAddTask} />

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <button className="add-button" onClick={() => setFilter("all")}>
            Tasks
          </button>
          <button className="add-button" onClick={() => setFilter("active")}>
            Active
          </button>
          <button className="add-button" onClick={() => setFilter("completed")}>
            Completed
          </button>
        </div>

        {filter === "completed" && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "1rem",
            }}
          >
            <button
              onClick={handleDeleteCompleted}
              className="delete-completed-button"
              title="Delete All Completed Tasks"
            >
              🗑️ Delete Completed
            </button>
          </div>
        )}

        {loading && <p>Loading...</p>}

        <ul className="task-list">
          {filteredTasks.map((x) => (
            <TaskItem
              key={x.id}
              id={x.id}
              title={x.title}
              completed={x.completed}
              isRemoving={removingIds.includes(x.id)}
              onToggleComplete={handleToggleComplete}
              onRemove={(id) => {
                const task = tasks.find((t) => t.id === id);
                if (!task) return;

                if (!task.completed) {
                  setConfirmDeleteTask({ id: task.id, title: task.title });
                } else {
                  setRemovingIds((prev) => [...prev, id]);
                  setTimeout(() => {
                    dispatch(removeOne(id));
                    showToast({
                      message: `"${task.title}" has been deleted.`,
                      type: "success",
                      action: "delete",
                    });
                    setRemovingIds((prev) => prev.filter((x) => x !== id));
                  }, 300);
                }
              }}
              onEdit={(id, newTitle) =>
                dispatch(updateTask({ id, title: newTitle }))
              }
            />
          ))}
        </ul>
      </main>

      <div className="toast-container">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            action={t.action}
            onClose={() =>
              setToasts((prev) => prev.filter((toast) => toast.id !== t.id))
            }
          />
        ))}
      </div>

      {showCongrats && (
        <CongratsOverlay onClose={() => setShowCongrats(false)} />
      )}

      {confirmDeleteTask && (
        <ConfirmDeleteOverlay
          taskTitle={confirmDeleteTask.title}
          onConfirm={() => {
            setRemovingIds((prev) => [...prev, confirmDeleteTask.id]);
            setTimeout(() => {
              dispatch(removeOne(confirmDeleteTask.id));
              showToast({
                message: `"${confirmDeleteTask.title}" has been deleted.`,
                type: "success",
                action: "delete",
              });
              setRemovingIds((prev) =>
                prev.filter((x) => x !== confirmDeleteTask.id)
              );
              setConfirmDeleteTask(null);
            }, 300);
          }}
          onCancel={() => {
            setConfirmDeleteTask(null); // cancel does nothing to task
          }}
        />
      )}
    </div>
  );
}
