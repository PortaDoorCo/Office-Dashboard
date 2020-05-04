import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Editor from './Editor'
import { Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap'
import { VerticalLine } from 'devextreme-react/chart';
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
                <h4 style={{ textDecoration: 'underline' }}>Bottoms Width</h4>
              </CardTitle>
              <Row>
                <Col>
                  Width
                  <Editor code={breakdowns.bottoms_width} name={'bottoms_width'} toggleEdit={setTopRailWidth}  edit={topRailWidth} />
                </Col>
              </Row>


              <div className="mt-2">
                <Button color="primary" onClick={() => setTopRailWidth(!topRailWidth)}>Edit</Button>
              </div>

            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
                <h4 style={{ textDecoration: 'underline' }}>Bottoms Depth</h4>
              </CardTitle>
              <Row>
                <Col>
                  Depth
                  <Editor code={breakdowns.bottoms_depth} name={'bottoms_depth'} toggleEdit={setTopRailHeight}  edit={topRailHeight} />
                </Col>
              </Row>

              <div className="mt-2">
                <Button color="primary" onClick={() => setTopRailHeight(!topRailHeight)}>Edit</Button>
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
                <h4 style={{ textDecoration: 'underline' }}>Fronts Height</h4>
              </CardTitle>
              <Row>
                <Col>
                  Height
                  <Editor code={breakdowns.fronts_height} name={'fronts_height'}  toggleEdit={setBottomRailWidth} edit={bottomRailWidth} />
                </Col>
              </Row>

              <div className="mt-2">
                <Button color="primary" onClick={() => setBottomRailWidth(!bottomRailWidth)}>Edit</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
                <h4 style={{ textDecoration: 'underline' }}>Fronts Width</h4>
              </CardTitle>
              <Row>
                <Col>
                  Width
                  <Editor code={breakdowns.fronts_width} name={'fronts_width'}  toggleEdit={setBottomRailHeight} edit={bottomRailHeight} />
                </Col>
              </Row>
              <div className="mt-2">
                <Button color="primary" onClick={() => setBottomRailHeight(!bottomRailHeight)}>Edit</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
                <h4 style={{ textDecoration: 'underline' }}>Fronts Thickness</h4>
              </CardTitle>
              <Row>
                <Col>
                  Thickness
                  <Editor code={breakdowns.fronts_thickness} name={'fronts_thickness'}  toggleEdit={setBottomRailHeight} edit={bottomRailHeight} />
                </Col>
              </Row>
              <div className="mt-2">
                <Button color="primary" onClick={() => setBottomRailHeight(!bottomRailHeight)}>Edit</Button>
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
                <h4 style={{ textDecoration: 'underline' }}>Sides Height</h4>
              </CardTitle>
              <Row>
                <Col>
                  Height
                  <Editor code={breakdowns.sides_height} name={'sides_height'}  toggleEdit={setLeftStileWidth} edit={leftStileWidth} />
                </Col>
              </Row>
              <div className="mt-2">
                <Button color="primary" onClick={() => setLeftStileWidth(!leftStileWidth)}>Edit</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
                <h4 style={{ textDecoration: 'underline' }}>Sides Depth</h4>
              </CardTitle>
              <Row>
                <Col>
                  Depth
                  <Editor code={breakdowns.sides_depth} name={'sides_depth'}   toggleEdit={setLeftStileHeight} edit={leftStileHeight} />
                </Col>
              </Row>
              <div className="mt-2">
                <Button color="primary" onClick={() => setLeftStileHeight(!leftStileHeight)}>Edit</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
                <h4 style={{ textDecoration: 'underline' }}>Sides Thickness</h4>
              </CardTitle>
              <Row>
                <Col>
                  Thickness
                  <Editor code={breakdowns.sides_thickness} name={'sides_thickness'}   toggleEdit={setLeftStileHeight} edit={leftStileHeight} />
                </Col>
              </Row>
              <div className="mt-2">
                <Button color="primary" onClick={() => setLeftStileHeight(!leftStileHeight)}>Edit</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}


const mapStateToProps = (state) => ({
  breakdowns: state.part_list.box_breakdowns[0],
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