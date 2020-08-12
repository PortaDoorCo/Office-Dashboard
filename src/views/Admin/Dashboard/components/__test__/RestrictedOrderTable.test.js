import React from 'react';
import ReactDOM from 'react-dom';
import RestrictedOrderTable from '../RestrictedOrderTable';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../../../../../rootReducer';

const middleware = [thunk];
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <RestrictedOrderTable />
    </Provider>
    , div);
  ReactDOM.unmountComponentAtNode(div);
});