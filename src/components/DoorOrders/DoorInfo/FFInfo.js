import React, { Component } from 'react';
import { Row, Col, CardSubtitle, Button } from 'reactstrap';
import DoorFilter from '../DoorInfo/Filter/Filter';
import Conditionals from './Conditionals';
import CopyModal from './CopyModal';
import thickness from './thickness';





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
                thickness={thickness}
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
