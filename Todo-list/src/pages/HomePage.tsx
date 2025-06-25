import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  fetchTasks,
  addNew,
  removeOne,
  updateTask,
  toggleComplete,
  deleteCompleted,
} from "../reduxToolkit/task.slice";
import TaskInput from "../components/TaskInput";
import TaskItem from "../components/TaskItem";

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
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

  const handleDeleteCompleted = () => {
    const completedIds = tasks.filter((t) => t.completed).map((t) => t.id);
    setRemovingIds(completedIds);
    setTimeout(() => {
      dispatch(deleteCompleted());
      setRemovingIds([]);
    }, 300);
  };

  return (
    <div className={`page-wrapper ${darkMode ? "dark" : "light"}`}>
      <header className="header">
        <h1>Todo List</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="toggle-theme-btn"
          title="Toggle Theme"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>

      <main className="main-content">
        <div className="task-input-wrapper">
          <TaskInput onAdd={(t) => dispatch(addNew(t))} />
          <button
            onClick={handleDeleteCompleted}
            className="delete-completed-button"
            title="Delete All Completed Tasks"
          >
            Delete Completed Tasks
          </button>
        </div>

        {loading && <p>Loading...</p>}
        <ul className="task-list">
          {tasks.map((x) => (
            <TaskItem
              key={x.id}
              id={x.id}
              title={x.title}
              completed={x.completed}
              isRemoving={removingIds.includes(x.id)}
              onToggleComplete={(id, completed) =>
                dispatch(toggleComplete({ id, completed }))
              }
              onRemove={(id) => dispatch(removeOne(id))}
              onEdit={(id, newTitle) =>
                dispatch(updateTask({ id, title: newTitle }))
              }
            />
          ))}
        </ul>
      </main>
    </div>
  );
}
