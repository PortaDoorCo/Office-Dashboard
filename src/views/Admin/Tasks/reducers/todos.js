import {
  LOAD_TASKS, CREATE_TASK
} from '../actions';

const initialState = {
  tasks: []
};

export default function (state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case LOAD_TASKS:
      return {
        ...state,
        tasks: data
      };
    case CREATE_TASK:
      return {
        ...state,
        tasks: data
      };
    default:
      return {
        ...state
      };
  }
}
  