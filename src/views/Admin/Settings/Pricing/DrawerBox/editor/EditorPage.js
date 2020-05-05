import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Editor from './Editor'
import { Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap'
import { updateBreakdowns } from '../../../../../../redux/part_list/actions'

const EditorPage = (props) => {

  const { updateBreakdowns } = props;

  const [breakdowns, setBreakdowns] = useState(props.breakdowns);

  const [topRailWidth, setTopRailWidth] = useState(false);
  const [topRailHeight, setTopRailHeight] = useState(false);
  const [bottomRailWidth, setBottomRailWidth] = useState(false);
  const [bottomRailHeight, setBottomRailHeight] = useState(false);
  const [leftStileWidth, setLeftStileWidth] = useState(false);
  const [leftStileHeight, setLeftStileHeight] = useState(false);
  const [rightStileWidth, setRightStileWidth] = useState(false);
  const [rightStileHeight, setRightStileHeight] = useState(false);
  const [verticalMidRailWidth, setVerticalMidRailWidth] = useState(false);
  const [verticalMidRailHeight, setVerticalMidRailHeight] = useState(false);
  const [horizontalMidRailWidth, setHorizontalMidRailWidth] = useState(false);
  const [horizontalMidRailHeight, setHorizontalMidRailHeight] = useState(false);
  const [panelWidth, setPanelWidth] = useState(false);
  const [panelHeight, setPanelHeight] = useState(false);




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
                <h4 style={{ textDecoration: 'underline' }}>Door Pricing</h4>
              </CardTitle>
              <Row>
                <Col>
                  <Editor code={breakdowns.topRail_width} name={'topRail_width'} toggleEdit={setTopRailWidth}  edit={topRailWidth} />
                </Col>
              </Row>

              <div className="mt-2">
                <Button color="primary" onClick={() => setTopRailWidth(!topRailWidth)}>Edit</Button>
              </div>

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
                  <Editor code={breakdowns.bottomRail_width} name={'bottomRail_width'}  toggleEdit={setBottomRailWidth} edit={bottomRailWidth} />
                </Col>
              </Row>

              <div className="mt-2">
                <Button color="primary" onClick={() => setBottomRailWidth(!bottomRailWidth)}>Edit</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}


const mapStateToProps = (state) => ({
  breakdowns: state.part_list.breakdowns[0],
  woodtypes: state.part_list.woodtypes,
  designs: state.part_list.cope_designs,
  edges: state.part_list.edges,
  panels: state.part_list.panels,
  profiles: state.part_list.profiles,
  applied_profiles: state.part_list.applied_moulds
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