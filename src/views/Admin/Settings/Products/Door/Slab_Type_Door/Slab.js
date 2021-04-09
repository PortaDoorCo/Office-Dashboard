import React, { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, Row, Col, Card, CardBody, CardTitle, TabContent, TabPane, Nav, NavItem, NavLink, Collapse } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Woodtype from '../Attributes/Woodtypes';
import Designs from './attributes/Designs';
import Edges from '../Attributes/Edges';
import AppliedProfiles from '../Attributes/Applied_Profiles';
import { updateProduct } from '../../../../../../redux/part_list/actions';
import classnames from 'classnames';
import EditorPage from './editor/EditorPage';


const Navigation = (props) => {
  return (
    <Col>
      <Breadcrumb>
        <BreadcrumbItem>Doors</BreadcrumbItem>
        <BreadcrumbItem active>Slab Type DF</BreadcrumbItem>
      </Breadcrumb>
    </Col>
  );
};


const Cope = (props) => {
  const [activeTab, setActiveTab] = useState('1');
  const [openEditor] = useState(false);

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };


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
                    <h1>Slab Type DF</h1>
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
                        Applied Profiles
                      </NavLink>
                    </NavItem>
                  </Nav>
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
  designs: state.part_list.cope_designs,
  edges: state.part_list.edges,
  panels: state.part_list.panels,
  profiles: state.part_list.profiles,
  applied_profiles: state.part_list.applied_profiles
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

