import React from 'react';
import ReactDOM from 'react-dom';
import DrawerBox from '../DrawerBox';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../../../../../../rootReducer';

const middleware = [thunk];
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));



it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <DrawerBox />
    </Provider>
    , div);
  ReactDOM.unmountComponentAtNode(div);
});
