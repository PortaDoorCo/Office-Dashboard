import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Editor from './Editor'
import { Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap'

const EditorPage = (props) => {
  const [breakdowns, setBreakdowns] = useState(props.breakdowns);

  const [topRailEdit, setTopRailEdit] = useState(false);
  const [bottomRailEdit, setBottomRailEdit] = useState(false);



  return (
    <div>
      <h3>Breakdowns</h3>

      <Row className="mt-2">
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
                Top Rail
            </CardTitle>
              <Editor code={breakdowns.topRail} edit={topRailEdit} />

              <div className="mt-2">
                {topRailEdit ? <Button color="danger">Submit Changes</Button> : null}
                <Button color="primary" onClick={() => setTopRailEdit(!topRailEdit)}>Edit</Button>
              </div>

            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
                Bottom Rail
            </CardTitle>
              <Editor code={breakdowns.bottomRail} />
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
                Left Stile
            </CardTitle>
              <Editor code={breakdowns.leftStile} />
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
                Right Stile
            </CardTitle>
              <Editor code={breakdowns.rightStile} />
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
                Vertical Mid Rail
            </CardTitle>
              <Editor code={breakdowns.vertical_mid_rail} />
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
                Horizontal Mid Rail
            </CardTitle>
              <Editor code={breakdowns.horizontal_mid_rail} />
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
                Panel Width
            </CardTitle>
              <Editor code={breakdowns.panel_width} />
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <CardBody>
              <CardTitle>
                Panel Height
            </CardTitle>
              <Editor code={breakdowns.panel_height} />
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