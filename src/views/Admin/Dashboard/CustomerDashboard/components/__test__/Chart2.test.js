import React from 'react';
import ReactDOM from 'react-dom';
import Chart2 from '../Chart2';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../../../../../../rootReducer';

const middleware = [thunk];
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));

it('renders without crashing', () => {
  const div = document.createElement('div');
  window.HTMLCanvasElement.prototype.getContext = () => {};
  ReactDOM.render(
    <Provider store={store}>
      <Chart2 />
    </Provider>
    , div);
  ReactDOM.unmountComponentAtNode(div);
});