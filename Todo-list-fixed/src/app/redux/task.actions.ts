import type{ Dispatch } from 'redux';
import * as svc from '../TaskService';

export const loadTasks = () => async (d: Dispatch) => {
  d({ type: 'LOAD_START' });
  try {
    const tasks = await svc.getAllTasks();
    d({ type: 'LOAD_SUCCESS', payload: tasks });
  } catch (e) { d({ type: 'LOAD_ERROR', payload: String(e) }); }
};
