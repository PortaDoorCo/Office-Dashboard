import React, { Component } from 'react';
import { Row, Col, CardSubtitle, Button, ButtonGroup } from 'reactstrap';
import DoorFilter from '../DoorInfo/Filter/Filter';
import Conditionals from './Conditionals';
import CopyModal from './CopyModal';

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
  },
  // {
  //   name: 'Glass Door',
  //   value: 'Glass'
  // },
  // {
  //   name: 'Glass DF',
  //   value: 'Glass_DF'
  // },
  // {
  //   name: 'Face Frame',
  //   value: 'Face_Frame'
  // },
  // {
  //   name: 'One Piece Door',
  //   value: 'One_Piece'
  // },
  // {
  //   name: 'One Piece DF',
  //   value: 'One_Piece_DF'
  // },
  // {
  //   name: 'Two Piece Door',
  //   value: 'Two_Piece'
  // },
  // {
  //   name: 'Two Piece DF',
  //   value: 'Two_Piece_DF'
  // },
  // {
  //   name: 'Slab Type Door',
  //   value: 'Slab_Door'
  // },
  // {
  //   name: 'Slab Type DF',
  //   value: 'Slab_DF'
  // },
  // {
  //   name: 'Multi-Panel Doors w/ Glass Lites',
  //   value: 'MultiPanel'
  // }
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

  copy = (type) => {
    const { fields, formState } = this.props;
    const lastItem = formState.part_list[formState?.part_list?.length - 1];

    switch(type) {
      case 'Door':
        fields.push({
          orderType: orderType[0],
          construction: lastItem.construction,
          thickness: lastItem.thickness,
          dimensions: [],
          addPrice: 0,
          files: [],
        });
        break;
      case 'DF':
        fields.push({
          orderType: orderType[1],
          construction: lastItem.construction,
          thickness: lastItem.thickness,
          dimensions: [],
          addPrice: 0,
          files: [],
        });
        break;
      default:
        switch(this.state.type) {
          case 'Door':
            fields.push({
              orderType: orderType[0],
              construction: construction[0],
              thickness: thickness[0],
              dimensions: [],
              addPrice: 0,
              files: [],
            });
            break;
          case 'DF':
            fields.push({
              orderType: orderType[1],
              construction: construction[0],
              thickness: thickness[0],
              dimensions: [],
              addPrice: 0,
              files: [],
            });
            break;
          default:
            fields.push({
              orderType: orderType[0],
              construction: construction[0],
              thickness: thickness[0],
              dimensions: [],
              addPrice: 0,
              files: [],
            });
        }

    }

    this.toggle();
  };

  render() {
    const { fields, formState, isValid, edit, updateSubmit } = this.props;

    console.log({ formState });

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

        {!edit ? (
          <div>
            <ButtonGroup>
              <Button
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  this.toggle('Door');
                  e.target.blur();
                }}
              >
                Add Door
              </Button>
              <Button
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  this.toggle('DF');
                  e.target.blur();
                }}
              >
                Add Drawer Front
              </Button>
            </ButtonGroup>
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default DoorInfo;
