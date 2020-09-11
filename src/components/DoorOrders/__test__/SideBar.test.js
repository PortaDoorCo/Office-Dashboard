import React from 'react';
import ReactDOM from 'react-dom';
import SideBar from '../SideBar';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../../../rootReducer';

const middleware = [thunk];
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));

it('renders without crashing', () => {
  const div = document.createElement('div');
  const part = { 
    orderType: {
      'name': 'test',
      'value': 'test'
    }
  };
  ReactDOM.render(
    <Provider store={store}>
      <SideBar part={part} />
    </Provider>
    , div);
  ReactDOM.unmountComponentAtNode(div);
});
