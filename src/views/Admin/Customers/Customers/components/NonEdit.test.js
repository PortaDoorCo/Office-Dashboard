import React from 'react';
import ReactDOM from 'react-dom';
import NonEdit from './NonEdit';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<NonEdit />, div);
    ReactDOM.unmountComponentAtNode(div);
});
