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
import 'antd/dist/antd.css';
import DropdownList from 'react-widgets/lib/DropdownList';
import Multiselect from 'react-widgets/lib/Multiselect'
import 'react-widgets/dist/css/react-widgets.css';
import OrderTable from '../Table/OrderTable';
import {
  Field,
  FieldArray,
  change
} from 'redux-form';
import FieldFileInput from '../UploadComponent'
import { FileUploader } from 'devextreme-react';
import Cookies from "js-cookie";
import Select from 'react-select';

import CopeDoor from './Cope/Door'
import MiterDoor from './Miter/Door'
import MTDoor from './MT/Door'

import CopeDF from './Cope/DF'

import DoorFilter from './Filter/Filter'
import { renderMultiSelect, renderDropdownList, renderDropdownListFilter, renderField } from '../RenderInputs/renderInputs'
import Conditionals from './Conditonals'



const cookie = Cookies.get("jwt");

const required = value => (value ? undefined : 'Required');

const header = { 'Authorization': 'Bearer ' + cookie };

const construction = [
  {
    name: 'Cope And Stick',
    value: 'Cope'
  },
  {
    name: 'Mitered Construction',
    value: 'M'
  },
  {
    name: 'MT Construction',
    value: 'MT'
  }
];

const orderType = [
  {
    name: 'Door Order',
    value: 'Door'
  },
  {
    name: 'Drawer Front',
    value: 'DF'
  },
  {
    name: 'Frame Only',
    value: 'Frame_Only'
  },
  {
    name: 'One Piece Door',
    value: 'One_Piece'
  },
  {
    name: 'Slab Type Door',
    value: 'Slab_Door'
  }
];

const thickness = [
  {
    name: '4/4',
    value: 0.75
  },
  {
    name: '5/4',
    value: 1
  }
];


class DoorInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      designFilter: [],
      mouldFilter: [],
      test: []
    };
  }

  render() {
    const {
      fields,



      formState,
      prices,
      part_list,
      isValid,
      subTotal,
      updateSubmit
    } = this.props;



    return (
      <div>
        {fields.map((part, index) => (
          <div id={`item-${index}`} key={index}>
            <hr />
            <CardSubtitle className="mt-4">
              <Row>
                <Col lg="11">
                  <div>
                    <h2>Item #{index + 1}</h2>
                  </div>

                </Col>
                <Col>
                  {fields.length > 1 ? (
                    <Button color="danger" onClick={() => fields.remove(index)}>
                      x
                    </Button>
                  ) : null}
                </Col>
              </Row>
            </CardSubtitle>

            <DoorFilter
              part={part}
              index={index}
              orderType={orderType}
              construction={construction}
              thickness={thickness}
            />

            <Conditionals
              formState={formState}
              part={part}
              index={index}
            />

            <Row className="mt-2">
              <Col xs="4">
                <FormGroup>
                  <strong>
                    <Label for="jobNotes">Job Notes</Label>
                    <Field
                      name={`${part}.notes`}
                      type="textarea"
                      component={renderField}
                    />
                  </strong>
                </FormGroup>
              </Col>
            </Row>

            <div>
              <CardSubtitle className="mt-4 mb-1">Dimensions</CardSubtitle>
              <div className="mt-1" />
              <FieldArray
                name={`${part}.dimensions`}
                component={OrderTable}
                i={index}
                prices={prices}
                subTotal={subTotal}
                part_list={part_list}
                formState={formState}
                isValid={isValid}
                part={part}
                updateSubmit={updateSubmit}
              />
              <div />
            </div>
          </div>
        ))}
        <Button
          color="primary"
          onClick={() =>

            fields.push({
              orderType: orderType[0],
              construction: construction[0],
              thickness: thickness[0],
              dimensions: [],
              addPrice: 0,
              files: []
            })

          }
        >
          Add Item
        </Button>
      </div>
    );
  }
}

export default DoorInfo;
