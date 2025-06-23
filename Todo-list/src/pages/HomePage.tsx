import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  fetchTasks,
  addNew,
  removeOne,
  updateTask,
} from "../reduxToolkit/task.slice";
import TaskInput from "../components/TaskInput";
import TaskItem from "../components/TaskItem";

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // ✅ Apply dark/light class to body for global background
  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(darkMode ? "dark" : "light");
  }, [darkMode]);

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
        <TaskInput onAdd={(t) => dispatch(addNew(t))} />
        {loading && <p>Loading...</p>}
        <ul className="task-list">
          {tasks.map((x) => (
            <TaskItem
              key={x.id}
              id={x.id}
              title={x.title}
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
