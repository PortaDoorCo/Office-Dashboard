import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Editor from './Editor'
import { Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap'
import { updateBreakdowns } from '../../../../../../redux/part_list/actions'

const EditorPage = (props) => {

  const { updateBreakdowns, pricing, role } = props;

  const [breakdowns, setBreakdowns] = useState(props.breakdowns);

  const [drawerBoxPricing, setDrawerBoxPricing] = useState(false);

  return (
    <div>
      <h3>Drawer Pricing</h3>
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
                <h4 style={{ textDecoration: 'underline' }}>Drawer Box Pricing</h4>
              </CardTitle>
              <Row>
                <Col>
                  <Editor code={pricing.drawer_box_pricing} name={'drawer_box_pricing'} toggleEdit={setDrawerBoxPricing} edit={drawerBoxPricing} />
                </Col>
              </Row>

              {role.type === 'management' || role.type === 'authenticated' || role.type === 'owner' ?
                <div className="mt-2">
                  <Button color="primary" onClick={() => setDrawerBoxPricing(!drawerBoxPricing)}>Edit</Button>
                </div>
                :
                <div />
              }

            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}


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