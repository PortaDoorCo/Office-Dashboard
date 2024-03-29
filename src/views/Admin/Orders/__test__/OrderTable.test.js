import React from 'react';
import ReactDOM from 'react-dom';
import OrderTable from '../OrderTable';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../../../../rootReducer';

const middleware = [thunk];
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));

OrderTable.defaultProps = { 
  orders: [{
    created_at: ''
  }]
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <OrderTable />
    </Provider>
    , div);
  ReactDOM.unmountComponentAtNode(div);
});
