import { REGISTER_USER, LOGIN, CREATE_TASK, MARK_DONE, REMOVE_TASK, SET_LOGIN, UPDATE_ACCOUNT, RESET_PASSWORD, GET_USERS } from './actions';

const initialState = {
  user: {},
  registeredUsers: [],
  tasks: [],
  loggedIn: false,
  passwordReset: false
};

export default function (state = initialState, action) {
  const { type, user, data } = action;
  switch (type) {
    case REGISTER_USER:
      return {
        ...state
      };
    case LOGIN:
      return {
        ...state,
        user: user,
        tasks: user.tasks,
        loggedIn: true
      };
    case GET_USERS:
      return {
        ...state,
        registeredUsers: data,
      };
    case UPDATE_ACCOUNT:
   
      return {
        ...state,
        user: data
      };
    case RESET_PASSWORD:
      return {
        ...state,
        passwordReset: data
      };
    case CREATE_TASK:
      return {
        ...state,
        tasks: [...state.tasks, { ...data }]
      };
    case MARK_DONE:
      return {
        ...state,
        tasks: state.tasks.map(todo =>
          todo._id === action.id ? { ...todo, done: !todo.done } : todo
        )
      };
    case REMOVE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.id)
      };
    case SET_LOGIN:
      return {
        ...state,
        loggedIn: true
      };

    default:
      return {
        ...state
      };
  }
}
