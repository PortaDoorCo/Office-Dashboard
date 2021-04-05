import React, { useState } from 'react';
import { Row, Col, Button, Card, CardBody, CardTitle, TabContent, TabPane, Nav, NavItem, NavLink, Collapse, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Woodtype from './attributes/Woodtypes';
import BoxThickness from './attributes/BoxThickness';
import BoxBottomThickness from './attributes/BoxBottomThickness';
import { updateProduct } from '../../../../../redux/part_list/actions';
import classnames from 'classnames';
import EditorPage from './editor/EditorPage';
import NotchDrill from './attributes/NotchDrill';
import Finish from './attributes/Finish';
import Scoops from './attributes/BoxScoopes';

const Navigation = (props) => {

  return (
    <Col>
      <Breadcrumb>
        <BreadcrumbItem>Drawer Box</BreadcrumbItem>
        <BreadcrumbItem active>Dovetail Drawer Box</BreadcrumbItem>
      </Breadcrumb>
    </Col>
  );
};


const DrawerBox = (props) => {
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
                    <h1>Drawer Box</h1>
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
                        Box Thickness
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '4' })}
                        onClick={() => { toggle('4'); }}
                      >
                        Box Bottom Thickness
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '5' })}
                        onClick={() => { toggle('5'); }}
                      >
                        Notch and Drill
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '6' })}
                        onClick={() => { toggle('6'); }}
                      >
                        Finish/Assembly
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '7' })}
                        onClick={() => { toggle('7'); }}
                      >
                        Scoops
                      </NavLink>
                    </NavItem>
                  </Nav>
                </Col>
              </Row>

              <Row>
                <Col>

                  <img src="https://res.cloudinary.com/porta-door/image/upload/v1617574759/drawer_f6214eb4de.png" alt="drawer_box" className="mb-3 mt-3"/>

                  {role && (role.type === 'management' || role.type === 'authenticated' || role.type === 'owner') ?
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
                <BoxThickness />
              </TabPane>
              <TabPane tabId="4">
                <BoxBottomThickness />
              </TabPane>
              <TabPane tabId="5">
                <NotchDrill />
              </TabPane>
              <TabPane tabId="6">
                <Finish />
              </TabPane>
              <TabPane tabId="7">
                <Scoops />
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
)(DrawerBox);

