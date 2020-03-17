import React, { Component, Fragment } from 'react';
import {
    Row,
    Col,
    CardSubtitle,
    FormGroup,
    Label,
    Button,
    Input
  } from 'reactstrap';
import DropdownList from 'react-widgets/lib/DropdownList';
import Multiselect from 'react-widgets/lib/Multiselect'
import 'react-widgets/dist/css/react-widgets.css';



export const renderMultiSelect = ({
    input,
    data,
    valueField,
    textField,
    meta: { touched, error, warning }
}) => (
        <div>
            <Multiselect
                {...input}
                onBlur={() => input.onBlur()}
                value={input.value || []} // requires value to be an array
                data={data}
                valueField={valueField}
                textField={textField}
                placeholder="Add Misc Items"
            />
            {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
        </div>
    );

export const renderDropdownListFilter = ({
    input,
    data,
    valueField,
    textField,
    meta: { touched, error, warning }
}) => (
        <div>
            <DropdownList
                {...input}
                data={data}
                valueField={valueField}
                textField={textField}
                placeholder="Select"
                onChange={input.onChange}
                filter
            />
            {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
        </div>
    );


export const renderDropdownList = ({
    input,
    data,
    valueField,
    textField,
    meta: { touched, error, warning }
}) => (
        <div>
            <DropdownList
                {...input}
                data={data}
                valueField={valueField}
                textField={textField}
                placeholder="Select"
                onChange={input.onChange}
            />
            {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
        </div>
    );

export const renderField = ({
    input,
    props,
    meta: { touched, error, warning },
    ...custom
}) => (
        <Fragment>
            <Input {...input} {...custom} autocomplete="new-password" />
            {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
        </Fragment>
    );