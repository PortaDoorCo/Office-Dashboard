import React from 'react';
import ReactDOM from 'react-dom';
import EditorPage from '../EditorPage';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../../../../../../../../rootReducer';

const middleware = [thunk];
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));

EditorPage.defaultProps = { code: '' };

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <EditorPage />
    </Provider>
    , div);
  ReactDOM.unmountComponentAtNode(div);
});
