import { REGISTER_USER, LOGIN, CREATE_TASK, MARK_DONE, REMOVE_TASK, SET_LOGIN, UPDATE_ACCOUNT } from "./actions";

const initialState = {
  user: [],
  tasks: [],
  loggedIn: false
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
    case UPDATE_ACCOUNT:
      console.log(data)
      return {
        ...state,
        user: data
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
