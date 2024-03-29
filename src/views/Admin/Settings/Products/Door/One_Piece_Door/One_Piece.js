import React, { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, Row, Col, Button, Card, CardBody, CardTitle, TabContent, TabPane, Nav, NavItem, NavLink, Collapse } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Woodtype from '../Attributes/Woodtypes';
import Designs from './attributes/Designs';
import Edges from '../Attributes/Edges';
import Profiles from '../Attributes/Profiles';
import Panels from '../Attributes/Panels';
import AppliedProfiles from '../Attributes/Applied_Profiles';
import { updateProduct } from '../../../../../../redux/part_list/actions';
import classnames from 'classnames';

import EditorPage from './editor/EditorPage';


const Navigation = (props) => {

  return (
    <Col>
      <Breadcrumb>
        <BreadcrumbItem>Doors</BreadcrumbItem>
        <BreadcrumbItem active>One Piece Door</BreadcrumbItem>
      </Breadcrumb>
    </Col>
  );
};


const Cope = (props) => {
  const [activeTab, setActiveTab] = useState('1');
  const [openEditor, setOpenEditor] = useState(false);

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const toggleEditor = () => setOpenEditor(!openEditor);

  const { role } = props;


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
                    <h1>One Piece Door</h1>
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
                        Edges
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '4' })}
                        onClick={() => { toggle('4'); }}
                      >
                        Profiles
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '5' })}
                        onClick={() => { toggle('5'); }}
                      >
                        Panels
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '6' })}
                        onClick={() => { toggle('6'); }}
                      >
                        Applied Profiles
                      </NavLink>
                    </NavItem>
                  </Nav>
                </Col>
              </Row>

              <Row>
                <Col>
                  <p>
                    Cope-and-stick joinery produces great-looking frames for cabinet doors, but you need specialized router bits or shaper cutters to do the job the traditional way. Those items don't come cheap. So we found a low-cost, low-tech alternative, based on a simple dovetail bit.</p>

                  <p>First, let's define some terms. "Stick" or "sticking" refers to the molded edge that's cut along the inside edge of the frame; pieces that meet that molding at a right angle must be "coped" to match the profile. Our technique replaces the usual round-over profile with a clean, simple bevel. It produces a subtle effect, not a dramatic one.</p>

                  <p>If you have a router, a router table, a dovetail bit, and a slot cutter, you can do it the way we show here. Begin by cutting the stiles to their final length. Lay out the rails by adding 1" to the final inside width of the frame. That measurement will allow for a 1⁄2 " stub tenon on both ends of each rail.</p>

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
                <Edges edges={props.edges} />
              </TabPane>
              <TabPane tabId="4">
                <Profiles profiles={props.profiles} />
              </TabPane>
              <TabPane tabId="5">
                <Panels panels={props.panels} />
              </TabPane>
              <TabPane tabId="6">
                <AppliedProfiles applied_profiles={props.applied_profiles} />
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
  designs: state.part_list.designs,
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

