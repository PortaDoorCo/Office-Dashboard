import React, { Component } from 'react';
import {
  Row,
  Col,
  CardSubtitle,
  Button
} from 'reactstrap';
import DoorFilter from '../DoorInfo/Filter/Filter';
import Conditionals from './Conditionals';



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
    name: 'Glass Door',
    value: 'Glass'
  },
  {
    name: 'Glass DF',
    value: 'Glass_DF'
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
    name: 'One Piece DF',
    value: 'One_Piece_DF'
  },
  {
    name: 'Two Piece Door',
    value: 'Two_Piece'
  },
  {
    name: 'Two Piece DF',
    value: 'Two_Piece_DF'
  },
  {
    name: 'Slab Type Door',
    value: 'Slab_Door'
  },
  {
    name: 'Slab Type DF',
    value: 'Slab_DF'
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


const ff_thickness = [
  {
    name: '1"',
    value: 1
  },
  {
    name: '1 1/8"',
    value: 1.125
  },
  {
    name: '1 1/4"',
    value: 1.25
  },
  {
    name: '1 3/8"',
    value: 1.375
  },
  {
    name: '1 1/2"',
    value: 1.5
  },
  {
    name: '1 5/8"',
    value: 1.625
  },
  {
    name: '1 3/4"',
    value: 1.75
  },
  {
    name: '1 7/8"',
    value: 1.875
  },
  {
    name: '2"',
    value: 2
  },
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
      isValid,
      edit
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
                    {!edit ?
                      fields.length > 1 ? (
                        <Button color="danger" onClick={() => fields.remove(index)}>
                          x
                        </Button>
                      ) : null
                      : null
                    }

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
              />

              <Conditionals
                formState={formState}
                part={part}
                index={index}
                edit={edit}
                isValid={isValid}
              />

            </div>
          );
        })}

        {!edit ?
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
          :
          <div />
        }

      </div>
    );
  }
}

export default DoorInfo;
