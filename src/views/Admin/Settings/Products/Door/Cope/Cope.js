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
import GlassOptions from '../Attributes/Glass_Options';
import { updateProduct } from '../../../../../../redux/part_list/actions';
import classnames from 'classnames';

import EditorPage from './editor/EditorPage';


const Navigation = (props) => {

  return (
    <Col>
      <Breadcrumb>
        <BreadcrumbItem>Doors</BreadcrumbItem>
        <BreadcrumbItem active>Cope and Stick</BreadcrumbItem>
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
                    <h1>Cope and Stick</h1>
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
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === '7' })}
                        onClick={() => { toggle('7'); }}
                      >
                        Glass Options
                      </NavLink>
                    </NavItem>
                  </Nav>
                </Col>
              </Row>

              <Row>
                <Col>
                  <p>
                  Cope and stick is a construction technique that is used to join pieces of wood in cabinetry
                  construction. It may also be referred to as stile-and-rail. The cope and the stick are the
                  names assigned to the two pieces of wood that are cut using a machinery so that a
                  smooth joint is created. This technique is most commonly used in making large frames
                  for wood or glass panels. When used in cabinetry, this technique can be applied to
                  intricate glass doors that exhibit a pattern. This is an advanced technique of construction
                  that can require the application of advanced skills like executing a climb cut against the
                  grain, so only journeyman woodworkers will undertake this type of work. When done
                  well, this can make a project much stronger than other construction methods </p>
                  
                  <p>The stick is a term used by woodworkers to refer to the molded edge that is along the
                  inside of a door or window frame. This type of edge is much more appealing than a
                  square edge, but it creates a technical problem that requires joining molded profiles at
                  the corners. This is where the cope comes into play. The cope is the recessed mirror cut
                  that is put into the opposite edge so the stick can be seamlessly joined. The result is a
                  much more ornate design, but the greatest advantage is the strength and tight-fitting
                  durability that this technique achieves. </p>

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

