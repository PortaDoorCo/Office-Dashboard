import React, { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, Row, Col, Button, Card, CardBody, CardTitle, TabContent, TabPane, Nav, NavItem, NavLink, Collapse } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Woodtype from '../../Door/Attributes/Woodtypes';
import Designs from './attributes/Designs';
import Edges from '../../Door/Attributes/Edges';
import Profiles from '../../Door/Attributes/Profiles';
import Panels from '../../Door/Attributes/Panels';
import AppliedProfiles from '../../Door/Attributes/Applied_Profiles';
import GlassOptions from '../../Door/Attributes/Glass_Options';
import { updateProduct } from '../../../../../../redux/part_list/actions';
import classnames from 'classnames';
import EditorPage from './editor/EditorPage';


const Navigation = (props) => {

  return (
    <Col>
      <Breadcrumb>
        <BreadcrumbItem>Drawer Front</BreadcrumbItem>
        <BreadcrumbItem active>MT Design DF</BreadcrumbItem>
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
                    <h1>MT Design</h1>
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
                    {/* <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '7' })}
                        onClick={() => { toggle('7'); }}
                      >
                        Glass Options
                      </NavLink>
                    </NavItem> */}
                  </Nav>
                </Col>
              </Row>

              <Row>
                <Col>
                  <img src="https://res.cloudinary.com/porta-door/image/upload/v1623171230/MT_cca8a9532e_dbc0716702.png" alt="MT" className="mb-3 mt-3"/>
                  <p>
                  The “MT” door construction is a far superior constructed door to an applied molding door.
                  The “MT” constructed door is mitered in the moulded areas and mortised and tenoned on all
                  straight parts. It provides more structural integrity than an applied molding door because the
                  moulding detail is an integral part of the stiles and rails instead of a separate piece. It
                  provides a more traditional look than a formal mitered door while still having the applied
                  moulding look.
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
              <TabPane tabId="7">
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

