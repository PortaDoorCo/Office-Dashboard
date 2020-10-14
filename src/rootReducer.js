import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { loadingBarReducer } from 'react-redux-loading-bar'

import part_list from './redux/part_list/reducer';
import Orders from './redux/orders/reducer';
import users from './redux/users/reducer';
import todos from './views/Admin/Tasks/reducers/todos';
import customers from './redux/customers/reducer';
import sales from './redux/sales/reducer';
import misc_items from './redux/misc_items/reducer';


const rootReducer = combineReducers({
  part_list,
  users,
  Orders,
  todos,
  customers,
  sales,
  misc_items,
  loadingBar: loadingBarReducer,
  form: formReducer
});

export default rootReducer;
