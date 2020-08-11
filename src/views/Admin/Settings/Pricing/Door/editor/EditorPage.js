import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Editor from './Editor';
import { Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap';
import { updateBreakdowns } from '../../../../../../redux/part_list/actions';

const EditorPage = (props) => {

  const { pricing, role } = props;
  const [doorPricing, setDoorPricing] = useState(false);
  const [faceFramePricing, setFaceFramePricing] = useState(false);


  return (
    <div>
      <h3>Door Pricing</h3>
      <Row className="mt-3">
        <Col>
          <p style={{ color: 'red' }}>**WARNING ** <br />
              EDITING THESE VALUES MAY BREAK COMPONENTS IF NOT DONE CORRECTLY. <br />
              PLEASE MAKE SURE YOUR MATH IS COMPLETE</p>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
                <h4 style={{ textDecoration: 'underline' }}>Door Pricing</h4>
              </CardTitle>
              <Row>
                <Col>
                  <Editor code={pricing.door_pricing} name={'door_pricing'} toggleEdit={setDoorPricing} edit={doorPricing} />
                </Col>
              </Row>

              {role.type === 'management' || role.type === 'authenticated' || role.type === 'owner' ?
                <div className="mt-2">
                  <Button color="primary" onClick={() => setDoorPricing(!doorPricing)}>Edit</Button>
                </div>
                :
                <div />
              }

            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
                <h4 style={{ textDecoration: 'underline' }}>Face Frame Pricing</h4>
              </CardTitle>
              <Row>
                <Col>
                  <Editor code={pricing.face_frame_pricing} name={'face_frame_pricing'} toggleEdit={setFaceFramePricing} edit={faceFramePricing} />
                </Col>
              </Row>

              {role.type === 'management' || role.type === 'authenticated' || role.type === 'owner' ?
                <div className="mt-2">
                  <Button color="primary" onClick={() => setFaceFramePricing(!faceFramePricing)}>Edit</Button>
                </div>
                :
                <div />
              }
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};


const mapStateToProps = (state) => ({
  pricing: state.part_list.pricing[0],
  role: state.users.user.role
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateBreakdowns
    },
    dispatch
  );



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorPage);