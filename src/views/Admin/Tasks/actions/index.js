export const LOAD_TASKS = 'LOAD_TASKS';
export const REMOVE_TASK = 'REMOVE_TASK';
export const CREATE_TASK = 'CREATE-TASK';

export function loadTasks() {
  return async function (dispatch) {
    const res = await fetch('/tasks');
    const data = await res.json();
    return dispatch({
      type: LOAD_TASKS,
      data: data
    });
  };
}

export function createTask(task) {
  return async function (dispatch) {
    return dispatch({
      type: CREATE_TASK,
      data: task
    });
  };
}


export function removeTask(id) {
  return async function (dispatch) {
    return dispatch({
      type: REMOVE_TASK,
      data: id
    });
  };
}