import axios from 'axios';

export const REGISTER_USER = 'REGISTER_USER';
export const LOGIN = 'LOGIN';
export const CREATE_TASK = 'CREATE_TASK';
export const MARK_DONE = 'MARK_DONE';
export const REMOVE_TASK = 'REMOVE_TASK'

const url = 'https://portadoor-server-production.herokuapp.com/'


export function registerUser(user) {
  return async function (dispatch) {
    const res = await axios.post(`https://portadoor-server-production.herokuapp.com/auth/local/register`, user);
    console.log(res);
    return dispatch({
      type: REGISTER_USER,
    });
  };
}

export function login(token) {
  return async function (dispatch) {
    const res = await axios.get(`https://portadoor-server-production.herokuapp.com/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(res);
    return dispatch({
      type: LOGIN,
      user: res.data,
    });
  };
}

export function createTask(task) {
  return async function (dispatch) {
    const res = await axios.post(`https://portadoor-server-production.herokuapp.com/tasks`, task);
    const data = await res;
    console.log(data);
    return dispatch({
      type: CREATE_TASK,
      data: data.data
    });
  };
}


export function markDone(id, done) {
  return async function (dispatch) {
    const res = await axios.put(`https://portadoor-server-production.herokuapp.com/tasks/${id}`, done);
    const data = await res;
    console.log(data);
    return dispatch({
      type: MARK_DONE,
      id: id
    });
  };
}

export function removeTask(id) {
  return async function (dispatch) {
    // const res = await axios.delete(`/tasks/${id}`);
    return dispatch({
      type: REMOVE_TASK,
      id: id
    });
  };
}

