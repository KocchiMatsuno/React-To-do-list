import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '../domain/entities/Task';
import { LocalStorageTaskRepository } from '../data/repos/LocalStorageTaskRepository';
import { AddTaskUseCase } from '../domain/usecases/AddTaskUseCase';
import { RemoveTaskUseCase } from '../domain/usecases/RemoveTaskUseCase';
import { GetAllTasksUseCase } from '../domain/usecases/GetAllTasksUseCase';
import { UpdateTaskUseCase } from '../domain/usecases/UpdateTaskUseCase';

import { v4 as uuidv4 } from 'uuid';

// Repositories and Use Cases
const repo = new LocalStorageTaskRepository();
const getAllTasks = new GetAllTasksUseCase(repo);
const addTaskUC = new AddTaskUseCase(repo);
const removeTaskUC = new RemoveTaskUseCase(repo);
const updateTaskUC = new UpdateTaskUseCase(repo);

// Thunks
export const fetchTasks = createAsyncThunk('tasks/fetch', async () => {
  return await getAllTasks.execute();
});

export const addNew = createAsyncThunk('tasks/add', async (title: string) => {
  const task = { id: uuidv4(), title };
  await addTaskUC.execute(task);
  return task;
});

export const removeOne = createAsyncThunk('tasks/remove', async (id: string) => {
  await removeTaskUC.execute(id);
  return id;
});

export const updateTask = createAsyncThunk(
  'tasks/update',
  async (payload: { id: string; title: string }) => {
    await updateTaskUC.execute(payload); // ✅ CORRECTED
    return payload;
  }
);

// State
interface TaskState {
  tasks: Task[];
  loading: boolean;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
};

// Slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(addNew.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      .addCase(removeOne.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<{ id: string; title: string }>) => {
        const task = state.tasks.find((t) => t.id === action.payload.id);
        if (task) {
          task.title = action.payload.title;
        }
      });
  },
});

export default taskSlice.reducer;
