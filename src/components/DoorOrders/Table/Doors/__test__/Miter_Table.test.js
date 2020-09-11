import React from 'react';
import ReactDOM from 'react-dom';
import Miter_Table from '../Miter_Table';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../../../../../rootReducer';
import { reduxForm } from 'redux-form';

const middleware = [thunk];
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));

const Decorated = reduxForm({ 
  form: 'testForm'
})(Miter_Table);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <Decorated />
    </Provider>
    , div);
  ReactDOM.unmountComponentAtNode(div);
});
