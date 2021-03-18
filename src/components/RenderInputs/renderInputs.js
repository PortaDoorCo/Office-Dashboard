import React, { Fragment } from 'react';
import {
  Input,
  CustomInput
} from 'reactstrap';
import DropdownList from 'react-widgets/lib/DropdownList';
import Multiselect from 'react-widgets/lib/Multiselect';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import 'react-widgets/dist/css/react-widgets.css';
import { Checkbox as CheckboxUI } from 'semantic-ui-react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import NumberFormat from 'react-number-format';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { formatPhoneNumber } from 'react-phone-number-input';

export const renderMultiSelect = ({
  input,
  data,
  valueField,
  textField,
  edit,
  meta: { touched, error, warning }
}) => (
  <Fragment>
    <Multiselect
      {...input}
      onBlur={() => input.onBlur()}
      value={input.value || []} // requires value to be an array
      data={data}
      valueField={valueField}
      textField={textField}
      placeholder="Add Misc Items"
      disabled={edit}
    />
    {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </Fragment>
);

export const renderDropdownListFilter = ({
  input,
  data,
  valueField,
  textField,
  edit,
  meta: { touched, error, warning }
}) => (
  <Fragment>
    <DropdownList
      {...input}
      data={data}
      valueField={valueField}
      textField={textField}
      placeholder="Select"
      onChange={input.onChange}
      allowCreate={false}
      filter
      disabled={edit}
    />
    {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </Fragment>
);


export const renderDropdownList = ({
  input,
  data,
  valueField,
  textField,
  edit,
  meta: { touched, error, warning }
}) => (
  <Fragment>
    <DropdownList
      {...input}
      data={data}
      valueField={valueField}
      textField={textField}
      placeholder="Select"
      onChange={input.onChange}
      disabled={edit}
    />
    {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </Fragment>
);


export const renderDatePicker = ({
  input,
  data,
  valueField,
  textField,
  edit,
  meta: { touched, error, warning }
}) => (
  <Fragment>
    <DateTimePicker
      {...input}
      data={data}
      valueField={valueField}
      textField={textField}
      onChange={input.onChange}
      disabled={edit}
    />
    {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </Fragment>
);

export const renderField = ({
  input,
  edit,
  meta: { touched, error, warning },
  ...custom
}) => (
  <Fragment>
    <Input {...input} disabled={edit} autoComplete="off" />
    {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </Fragment>
);

export const renderTextField = ({
  input,
  edit,
  meta: { touched, error, warning },
  ...custom
}) => (
  <Fragment>
    <Input {...input} disabled={edit} type="textarea" autoComplete="off" />
    {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </Fragment>
);

export const renderNumber = ({
  input,
  edit,
  meta: { touched, error, warning },
  ...custom
}) => (
  <Fragment>
    <AvForm>
      <AvField {...input} errorMessage="Only Numbers Allowed" validate={{
        pattern: {value: '^[0-9/ ]+$'},
      }} disabled={edit} autoComplete="off" /></AvForm>
    {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </Fragment>
);

export const renderInt = ({
  input,
  edit,
  meta: { touched, error, warning },
  ...custom
}) => (
  <Fragment>
    <AvForm>
      <AvField {...input} errorMessage="Only Integers Allowed" validate={{
        pattern: {value: '^[0-9]+$'},
      }} disabled={edit} autoComplete="off" /></AvForm>
    {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </Fragment>
);

export const renderSwitch = ({
  input,
  edit,
  meta: { touched, error, warning },
  ...custom
}) => (
  <Fragment>
    <CustomInput type="switch" {...input} disabled={edit} autoComplete="new-password" />
    {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </Fragment>
);

export const renderPrice = ({
  input,
  props,
  edit,
  meta: { touched, error, warning },
  ...custom
}) => (

  <Fragment>
    
    <NumberFormat thousandSeparator={true} {...input} disabled={edit} customInput={Input} prefix={'$'} />
    

    

    {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </Fragment>
);


export const renderCheckboxToggle = ({
  input: { value, onChange, ...input },
  edit,
  meta: { touched, error },
  ...rest
}) => (
  <div>
    <CheckboxUI
      toggle
      {...input}
      {...rest}
      checked={value ? true : false}
      onChange={(e, data) => onChange(data.checked)}
      type="checkbox"
      disabled={edit}
    />
    {touched && error && <span>{error}</span>}
  </div>
);

export const renderCheckbox = ({
  input: { value, onChange, ...input },
  meta: { touched, error },
  ...rest
}) => (
  <div>
    <CheckboxUI
      {...input}
      {...rest}
      defaultChecked={!!value}
      onChange={(e, data) => onChange(data.checked)}
      type="checkbox"

    />
    {touched && error && <span>{error}</span>}
  </div>
);

export const renderFieldDisabled = ({ input, props, meta: { touched, error, warning }, ...custom }) => (
  <Fragment>
    <Input {...input} {...custom} disabled style={{ display: 'none' }} />
    {touched &&
            ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </Fragment>
);

export const renderPhone = ({ input, edit, props, meta: { touched, error, warning }, ...custom }) => (
  <Fragment>
    <Input {...input} {...custom} />
    {touched &&
            ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </Fragment>
);