import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Editor from './Editor'
import { Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap'
import { VerticalLine } from 'devextreme-react/chart';

const EditorPage = (props) => {
  const [breakdowns, setBreakdowns] = useState(props.breakdowns);

  const [topRailEdit, setTopRailEdit] = useState(false);
  const [bottomRailEdit, setBottomRailEdit] = useState(false);
  const [leftStileEdit, setLeftStileEdit] = useState(false);
  const [rightStileEdit, setRightStileEdit] = useState(false);
  const [verticalMidRailEdit, setVerticalMidRailEdit] = useState(false);
  const [horizontalMidRailEdit, setHorizontalMidRailEdit] = useState(false);
  const [panelWidthEdit, setPanelWidthEdit] = useState(false);
  const [panelHeightEdit, setPanelHeightEdit] = useState(false);



  return (
    <div>
      <h3>Breakdowns</h3>
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
                <h4 style={{ textDecoration: 'underline' }}>Top Rail</h4>
            </CardTitle>
              <Row>
                <Col>
                  Width
                  <Editor code={breakdowns.topRail_width} edit={topRailEdit} />
                </Col>
                <Col>
                  Height
                  <Editor code={breakdowns.topRail_height} edit={topRailEdit} />
                </Col>
              </Row>


              <div className="mt-2">
                <Button color="primary" onClick={() => setTopRailEdit(!topRailEdit)}>Edit</Button>
              </div>

            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
              <h4 style={{ textDecoration: 'underline' }}>Bottom Rail</h4>
            </CardTitle>
              <Row>
                <Col>
                  Width
                  <Editor code={breakdowns.bottomRail_width} edit={bottomRailEdit} />
                </Col>
                <Col>
                  Height
                  <Editor code={breakdowns.bottomRail_height} edit={bottomRailEdit} />
                </Col>
              </Row>

              <div className="mt-2">
                <Button color="primary" onClick={() => setBottomRailEdit(!bottomRailEdit)}>Edit</Button>
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
              <h4 style={{ textDecoration: 'underline' }}>Left Stile</h4>
            </CardTitle>
              <Row>
                <Col>
                  Width
                  <Editor code={breakdowns.leftStile_width} edit={leftStileEdit} />
                </Col>
                <Col>
                  Height
                  <Editor code={breakdowns.leftStile_height} edit={leftStileEdit} />
                </Col>
              </Row>

              <div className="mt-2">
                <Button color="primary" onClick={() => setLeftStileEdit(!leftStileEdit)}>Edit</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
              <h4 style={{ textDecoration: 'underline' }}>Right Stile</h4>
            </CardTitle>
              <Row>
                <Col>
                  Width
                  <Editor code={breakdowns.rightStile_width} edit={rightStileEdit} />
                </Col>
                <Col>
                  Height
                  <Editor code={breakdowns.rightStile_height} edit={rightStileEdit} />
                </Col>
              </Row>
              <div className="mt-2">
                <Button color="primary" onClick={() => setRightStileEdit(!rightStileEdit)}>Edit</Button>
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
              <h4 style={{ textDecoration: 'underline' }}>Vertical Mid Rail</h4>
            </CardTitle>
              <Row>
                <Col>
                  Width
                  <Editor code={breakdowns.vertical_mid_rail_width} edit={verticalMidRailEdit} />
                </Col>
                <Col>
                  Height
                  <Editor code={breakdowns.vertical_mid_rail_height} edit={verticalMidRailEdit} />
                </Col>
              </Row>
              <div className="mt-2">
                <Button color="primary" onClick={() => setVerticalMidRailEdit(!verticalMidRailEdit)}>Edit</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
                <h4 style={{ textDecoration: 'underline' }}>Horizontal Mid Rail</h4>
            </CardTitle>
              <Row>
                <Col>
                  Width
                  <Editor code={breakdowns.horizontal_mid_rail_width} edit={horizontalMidRailEdit} />
                </Col>
                <Col>
                  Height
                  <Editor code={breakdowns.horizontal_mid_rail_height} edit={horizontalMidRailEdit} />
                </Col>
              </Row>
              <div className="mt-2">
                <Button color="primary" onClick={() => setHorizontalMidRailEdit(!horizontalMidRailEdit)}>Edit</Button>
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
              <h4 style={{ textDecoration: 'underline' }}>Panel Width</h4>
            </CardTitle>
              <Editor code={breakdowns.panel_width} edit={panelWidthEdit} />
              <div className="mt-2">
                <Button color="primary" onClick={() => setPanelWidthEdit(!panelWidthEdit)}>Edit</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
              <h4 style={{ textDecoration: 'underline' }}>Panel Height</h4>
            </CardTitle>
              <Editor code={breakdowns.panel_height} edit={panelHeightEdit} />
              <div className="mt-2">
                <Button color="primary" onClick={() => setPanelHeightEdit(!panelHeightEdit)}>Edit</Button>
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

    },
    dispatch
  );



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorPage);