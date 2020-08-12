import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Editor from './Editor';
import { Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap';
import { updateBreakdowns } from '../../../../../../redux/part_list/actions';

const EditorPage = (props) => {
  const [breakdowns] = useState(props.breakdowns);
  const [bottomsWidth, setBottomsWidth] = useState(false);
  const [bottomsDepth, setBottomsDepth] = useState(false);
  const [frontsHeight, setFrontsHeight] = useState(false);
  const [frontsWidth, setFrontsWidth] = useState(false);
  const [frontsThickness, setFrontsThickness] = useState(false);
  const [sidesHeight, setSidesHeight] = useState(false);
  const [sidesDepth, setSidesDepth] = useState(false);
  const [sidesThickness, setSidesThickness] = useState(false);

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
                <h4 style={{ textDecoration: 'underline' }}>Fronts Height</h4>
              </CardTitle>
              <Row>
                <Col>
                  Height
                  <Editor code={breakdowns ? breakdowns.fronts_height : ''} name={'fronts_height'}  toggleEdit={setFrontsHeight} edit={frontsHeight} />
                </Col>
              </Row>

              <div className="mt-2">
                <Button color="primary" onClick={() => setFrontsHeight(!frontsHeight)}>Edit</Button>
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
                  <Editor code={breakdowns ? breakdowns.fronts_width : ''} name={'fronts_width'}  toggleEdit={setFrontsWidth} edit={frontsWidth} />
                </Col>
              </Row>
              <div className="mt-2">
                <Button color="primary" onClick={() => setFrontsWidth(!frontsWidth)}>Edit</Button>
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
                  <Editor code={breakdowns ? breakdowns.fronts_thickness : ''} name={'fronts_thickness'}  toggleEdit={setFrontsThickness} edit={frontsThickness} />
                </Col>
              </Row>
              <div className="mt-2">
                <Button color="primary" onClick={() => setFrontsThickness(!frontsThickness)}>Edit</Button>
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
                  <Editor code={breakdowns ? breakdowns.sides_height : ''} name={'sides_height'}  toggleEdit={setSidesHeight} edit={sidesHeight} />
                </Col>
              </Row>
              <div className="mt-2">
                <Button color="primary" onClick={() => setSidesHeight(!sidesHeight)}>Edit</Button>
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
                  <Editor code={breakdowns ? breakdowns.sides_depth : ''} name={'sides_depth'}   toggleEdit={setSidesDepth} edit={sidesDepth} />
                </Col>
              </Row>
              <div className="mt-2">
                <Button color="primary" onClick={() => setSidesDepth(!sidesDepth)}>Edit</Button>
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
                  <Editor code={breakdowns ? breakdowns.sides_thickness : ''} name={'sides_thickness'}   toggleEdit={setSidesThickness} edit={sidesThickness} />
                </Col>
              </Row>
              <div className="mt-2">
                <Button color="primary" onClick={() => setSidesThickness(!sidesThickness)}>Edit</Button>
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
                <h4 style={{ textDecoration: 'underline' }}>Bottoms Width</h4>
              </CardTitle>
              <Row>
                <Col>
                  Width
                  <Editor code={breakdowns ? breakdowns.bottoms_width : ''} name={'bottoms_width'} toggleEdit={setBottomsWidth}  edit={bottomsWidth} />
                </Col>
              </Row>


              <div className="mt-2">
                <Button color="primary" onClick={() => setBottomsWidth(!bottomsWidth)}>Edit</Button>
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
                  <Editor code={breakdowns ? breakdowns.bottoms_depth : ''} name={'bottoms_depth'} toggleEdit={setBottomsDepth}  edit={bottomsDepth} />
                </Col>
              </Row>

              <div className="mt-2">
                <Button color="primary" onClick={() => setBottomsDepth(!bottomsDepth)}>Edit</Button>
              </div>

            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};


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