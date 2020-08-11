import React, { Component } from 'react';
import {
  Row,
  Col,
  CardSubtitle,
  Button
} from 'reactstrap';
<<<<<<< HEAD
import 'antd/dist/antd.css';
import 'react-widgets/dist/css/react-widgets.css';
import DoorFilter from '../DoorInfo/Filter/Filter';
import Conditionals from './Conditionals';
=======
import DoorFilter from '../DoorInfo/Filter/Filter';
import Conditionals from './Conditionals';


>>>>>>> staging

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
