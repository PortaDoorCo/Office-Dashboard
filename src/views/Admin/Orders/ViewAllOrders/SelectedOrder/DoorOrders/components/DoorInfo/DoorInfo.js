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
import DoorFilter from './Filter/Filter'
import { renderMultiSelect, renderDropdownList, renderDropdownListFilter, renderField } from '../RenderInputs/renderInputs'
import Conditionals from './Conditionals'



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
  },
  {
    name: 'Glass Door',
    value: 'Glass'
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
    name: 'Face Frame',
    value: 'Face_Frame'
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
      updateSubmit,

    } = this.props;

    return (
      <div>
        {fields.map((part, index) => {
          return (
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
                formState={formState}
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
  
                isValid={isValid}
              />
  
            </div>
          )
        })}
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
