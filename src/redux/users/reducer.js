import {
  REGISTER_USER,
  LOGIN,
  CREATE_TASK,
  MARK_DONE,
  REMOVE_TASK,
  SET_LOGIN,
  UPDATE_ACCOUNT,
  RESET_PASSWORD,
  GET_USERS,
  UPDATE_APP_TOUR,
  CURRENT_VERSION,
} from './actions';

const initialState = {
  user: {},
  registeredUsers: [],
  tasks: [],
  loggedIn: false,
  passwordReset: false,
  app_tour: false,
  current_version: true,
};

export default function (state = initialState, action) {
  const { type, user, data } = action;
  switch (type) {
    case REGISTER_USER:
      return {
        ...state,
      };
    case LOGIN:
      return {
        ...state,
        user: user,
        tasks: user.tasks,
        app_tour: user.app_tour,
        loggedIn: true,
      };
    case GET_USERS:
      return {
        ...state,
        registeredUsers: data,
      };
    case UPDATE_ACCOUNT:
      return {
        ...state,
        user: data,
      };
    case UPDATE_APP_TOUR:
      return {
        ...state,
        app_tour: false,
      };
    case RESET_PASSWORD:
      return {
        ...state,
        passwordReset: data,
      };
    case CREATE_TASK:
      return {
        ...state,
        tasks: [...state.tasks, { ...data }],
      };
    case MARK_DONE:
      return {
        ...state,
        tasks: state.tasks.map((todo) =>
          todo._id === action.id ? { ...todo, done: !todo.done } : todo
        ),
      };
    case REMOVE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.id),
      };
    case SET_LOGIN:
      return {
        ...state,
        loggedIn: true,
      };

    case CURRENT_VERSION:
      return {
        ...state,
        current_version: false,
      };

    default:
      return {
        ...state,
      };
  }
}
