import React from 'react';
import ReactDOM from 'react-dom';
import EmployeeProfile from './EmployeeProfile';

it('renders without crashing', () => {
const div = document.createElement('div');
ReactDOM.render(<EmployeeProfile />, div);
ReactDOM.unmountComponentAtNode(div);
});
