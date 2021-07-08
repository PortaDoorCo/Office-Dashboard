import React, { Component } from 'react';
import { Row, Col, CardSubtitle, Button, Card, CardBody, FormGroup } from 'reactstrap';
import DoorFilter from '../DoorInfo/Filter/Filter';
import Conditionals from './Conditionals';
import CopyModal from './CopyModal';
import FileUploader from '../../FileUploader/FileUploader';

const construction = [
  {
    name: 'Cope And Stick',
    value: 'Cope',
  },
  {
    name: 'Mitered Construction',
    value: 'M',
  },
  {
    name: 'MT Construction',
    value: 'MT',
  },
  {
    name: 'Slab',
    value: 'Slab',
  },
];

const orderType = [
  {
    name: 'Door Order',
    value: 'Door',
  },
  {
    name: 'Drawer Front',
    value: 'DF',
  }
];

const thickness = [
  {
    name: '4/4',
    value: 0.75,
  },
  {
    name: '5/4',
    value: 1,
  },
];

const ff_thickness = [
  {
    name: '3/4"',
    value: 0.75,
  },
  {
    name: '1"',
    value: 1,
  },
  {
    name: '1 1/8"',
    value: 1.125,
  },
  {
    name: '1 1/4"',
    value: 1.25,
  },
  {
    name: '1 3/8"',
    value: 1.375,
  },
  {
    name: '1 1/2"',
    value: 1.5,
  },
  {
    name: '1 5/8"',
    value: 1.625,
  },
  {
    name: '1 3/4"',
    value: 1.75,
  },
  {
    name: '1 7/8"',
    value: 1.875,
  },
  {
    name: '2"',
    value: 2,
  },
];

class DoorInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      designFilter: [],
      mouldFilter: [],
      test: [],
      modal: false,
      type: null
    };
  }

  toggle = (type) => {
    this.setState({
      modal: !this.state.modal,
    });
    this.setState({
      type: type
    });
  };

  
  render() {
    const { fields, formState, isValid, edit, updateSubmit, onUploaded } = this.props;

    return (
      <div className="order-tour">
        <div>
          <CopyModal
            modal={this.state.modal}
            toggle={this.toggle}
            copy={this.copy}
            type={this.state.type}
          />
        </div>
        {fields.map((part, index) => {
          return (
            <div id={`item-${index}`} key={index}>
              <hr />
              <CardSubtitle className="mt-4">
                {console.log({ part111111: part })}
                <Row>
                  <Col lg="11">
                    <div>
                      <h2>
                        Item #{index + 1} -{' '}
                        {formState && formState.part_list && formState.part_list[index] && formState.part_list[index].orderType && formState.part_list[index].orderType.name}
                      </h2>
                    </div>
                  </Col>
                  <Col>
                    {!edit ? (
                      fields.length > 1 ? (
                        <Button
                          color="danger"
                          onClick={() => fields.remove(index)}
                        >
                          x
                        </Button>
                      ) : null
                    ) : null}
                  </Col>
                </Row>
              </CardSubtitle>

              <DoorFilter
                formState={formState}
                part={part}
                index={index}
                edit={edit}
                orderType={orderType}
                construction={construction}
                thickness={thickness}
                ff_thickness={ff_thickness}
                updateSubmit={updateSubmit}
                onUploaded={onUploaded}
              />

              <Conditionals
                formState={formState}
                part={part}
                index={index}
                edit={edit}
                isValid={isValid}
                updateSubmit={updateSubmit}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export default DoorInfo;
