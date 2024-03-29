import React, { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, Row, Col, Button, Card, CardBody, CardTitle, TabContent, TabPane, Nav, NavItem, NavLink, Collapse } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Woodtype from '../../Door/Attributes/Woodtypes';
import Designs from './attributes/Designs';
import Panels from '../../Door/Attributes/Panels';
import GlassOptions from '../../Door/Attributes/Glass_Options';
import { updateProduct } from '../../../../../../redux/part_list/actions';
import classnames from 'classnames';
import EditorPage from './editor/EditorPage';


const Navigation = (props) => {

  return (
    <Col>
      <Breadcrumb>
        <BreadcrumbItem>Drawer Front</BreadcrumbItem>
        <BreadcrumbItem active>Miter Design DF</BreadcrumbItem>
      </Breadcrumb>
    </Col>
  );
};


const Cope = (props) => {
  const { role } = props;
  const [activeTab, setActiveTab] = useState('1');
  const [openEditor, setOpenEditor] = useState(false);

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const toggleEditor = () => setOpenEditor(!openEditor);


  return (
    <div>
      <Row>
        <Navigation />
      </Row>
      <Row>
        <Col xs='4'>
          <Card>
            {/* <CardImg top width="100%" src={"https://picsum.photos/1200"} alt="Card image cap" /> */}
            <CardBody>
              <Row className="mt-2">
                <Col>
                  <CardTitle>
                    <h1>Miter Design</h1>
                  </CardTitle>
                </Col>
              </Row>

              <Row className="mt-2 mb-3">
                <Col>
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '1' })}
                        onClick={() => { toggle('1'); }}
                      >
                        Woodtype
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '2' })}
                        onClick={() => { toggle('2'); }}
                      >
                        Designs
                      </NavLink>
                    </NavItem>

                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '3' })}
                        onClick={() => { toggle('3'); }}
                      >
                        Panels
                      </NavLink>
                    </NavItem>
                    {/* <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '4' })}
                        onClick={() => { toggle('4'); }}
                      >
                        Glass Options
                      </NavLink>
                    </NavItem> */}
                  </Nav>
                </Col>
              </Row>

              <Row>
                <Col>
                  <img src="https://res.cloudinary.com/porta-door/image/upload/v1623171230/miter_b999484459_8bfa290f0c.png" alt="miter" className="mb-3 mt-3"/>
                  <p>
                  The Mitre joint,often miter, is a joint made by cutting each of two parts to be joined, across
                  the main surface, usually at a 45° angle, to form a corner, usually a 90° angle. It is
                  called beveling when the angled cut is done on the side, although the resulting joint is still a
                  mitre joint. [1]
                  </p>
                  <p>
                  For woodworking, a disadvantage of a mitre joint is its weakness, but it can be strengthened
                  with a tenon joint, usually arranged with the long grain of the tenon across the short grain of
                  the frame timber). [2]  There are two common variations of a tenoned mitre joint, one where
                  the tenon is long and runs the length of the mating surfaces and another where the slot is
                  perpendicular to the joined edges.
                  </p>
                  {role && (role.type === 'management' || role.type === 'authenticated' || role.type === 'owner' || role.type === 'administrator') ?
                    <Button color="primary" onClick={toggleEditor} style={{ marginBottom: '1rem' }}>View Breakdowns</Button>
                    : <div />
                  }
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col xs='8'>
          <Row>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <Woodtype />
              </TabPane>
              <TabPane tabId="2">
                <Designs />
              </TabPane>
              <TabPane tabId="3">
                <Panels panels={props.panels} />
              </TabPane>
              <TabPane tabId="4">
                <GlassOptions />
              </TabPane>
            </TabContent>
          </Row>
          <Row className="mt-2">
            <Col>

              <Collapse isOpen={openEditor}>
                <Card>
                  <CardBody>
                    <EditorPage />
                  </CardBody>
                </Card>
              </Collapse>
            </Col>
          </Row>

        </Col>
      </Row>
    </div>
  );


};

const mapStateToProps = (state) => ({
  woodtypes: state.part_list.woodtypes,
  designs: state.part_list.cope_designs,
  edges: state.part_list.edges,
  panels: state.part_list.panels,
  profiles: state.part_list.profiles,
  applied_profiles: state.part_list.applied_profiles,
  role: state.users.user.role
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateProduct
    },
    dispatch
  );



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cope);

