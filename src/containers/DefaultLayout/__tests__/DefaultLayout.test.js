import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter, Route } from 'react-router-dom';
import DefaultLayout from '../DefaultLayout';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../../../rootReducer';

const middleware = [thunk];
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

it('renders without crashing', () => {
  const div = document.createElement('div');
  window.alert = () => {}; 
  ReactDOM.render(
    <Provider store={store}>
      <MemoryRouter>
        <Route path='/' name='Home' component={DefaultLayout} />
      </MemoryRouter>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
