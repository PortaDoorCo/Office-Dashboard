import axios from 'axios';
import Cookies from "js-cookie";
import db_url from '../db_url'
import { NotificationManager } from 'react-notifications';
const cookie = Cookies.get("jwt");



export const REGISTER_USER = 'REGISTER_USER';
export const LOGIN = 'LOGIN';
export const CREATE_TASK = 'CREATE_TASK';
export const MARK_DONE = 'MARK_DONE';
export const REMOVE_TASK = 'REMOVE_TASK';
export const SET_LOGIN = 'SET_LOGIN';
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
export const FORGOT_PASSWORD = "FORGOT_PASSWORD";
export const RESET_PASSWORD = "RESET_PASSWORD";
export const GET_USERS = 'GET_USERS'




export function registerUser(user) {
  return async function (dispatch) {
    await axios.post(`${db_url}/auth/local/register`, user);

    return dispatch({
      type: REGISTER_USER,
    });
  };
}

export function getUsers(token) {
  return async function (dispatch) {
    const res = await axios.get(`${db_url}/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return dispatch({
      type: GET_USERS,
      data: res.data,
    });
  };
}

export function login(token) {
  return async function (dispatch) {
    const res = await axios.get(`${db_url}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return dispatch({
      type: LOGIN,
      user: res.data,
    });
  };
}


export function updateAccount(token, id, userInfo) {
  return async function (dispatch) {
    const res = await axios.put(`${db_url}/users/${id}`, userInfo, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    NotificationManager.success(`User Updated!`, 'User Updated!', 2000);
    return dispatch({
      type: UPDATE_ACCOUNT,
      data: res.data
    });
  };
}

export function forgotPassword(email) {
  return async function (dispatch) {
    await axios.post(`${db_url}/auth/forgot-password`, email).then(res => {
      console.log(res)
    });
    return dispatch({
      type: FORGOT_PASSWORD,
    });
  };
}

export function resetPassword(code) {
  return async function (dispatch) {
    try {
      const res = axios.post(`${db_url}/auth/reset-password`, code);
      const data = await res;
      return await dispatch({
        type: RESET_PASSWORD,
        data: true
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error('There was an problem with your submission', 'Error', 2000);
    }


  };
}

export function createTask(task) {
  return async function (dispatch) {
    const res = await axios.post(`${db_url}/tasks`, task, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res;

    return dispatch({
      type: CREATE_TASK,
      data: data.data
    });
  };
}


export function markDone(id, done) {
  return async function (dispatch) {
    await axios.put(`${db_url}/tasks/${id}`, done, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
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

export function setLogin() {
  return async function (dispatch) {
    return dispatch({
      type: SET_LOGIN,
    });
  };
}

