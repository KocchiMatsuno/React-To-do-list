import type{ TaskState } from './task.types';

const initial: TaskState = { tasks: [], loading: false };
export function taskReducer(state = initial, action: any): TaskState {
  switch (action.type) {
    case 'LOAD_START': return { ...state, loading: true };
    case 'LOAD_SUCCESS': return { ...state, loading: false, tasks: action.payload };
    case 'LOAD_ERROR': return { ...state, loading: false, error: action.payload };
    default: return state;
  }
}
