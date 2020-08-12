import React from 'react';
import ReactDOM from 'react-dom';
import DrawerBoxInfo from '../DrawerBoxInfo';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../../../../../../../rootReducer';

const middleware = [thunk];
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));

it('renders without crashing', () => {
  const div = document.createElement('div');
  DrawerBoxInfo.defaultProps = { fields: [] };
  ReactDOM.render(
    <Provider store={store}>
      <DrawerBoxInfo />
    </Provider>
    , div);
  ReactDOM.unmountComponentAtNode(div);
});
