import React, { Component, useState } from 'react';
import { Row, Col, Button, CardImg, CardSubtitle, Card, CardBody, CardText, CardTitle, TabContent, TabPane, Nav, NavItem, NavLink, Collapse } from 'reactstrap'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Woodtype from './attributes/Woodtypes'
import Designs from './attributes/Designs'
import Edges from './attributes/Edges'
import Profiles from './attributes/Profiles'
import Panels from './attributes/Panels'
import Applied_Profiles from './attributes/Applied_Profiles'
import { getWoodtypes, getCopeDesigns, getEdges, getProfiles, getPanels, getAppliedMoulds, updateProduct } from '../../../../../../redux/part_list/actions'
import ProductCard from '../../../components/Card';
import WoodtypePNG from './img/woodtypes.png';
import DesignPNG from './img/designs.png';
import EdgePNG from './img/edges.png';
import ProfilePNG from './img/profiles.png';
import PanelPNG from './img/panels.png'
import AppliedPNG from './img/applied_profiles.png'
import classnames from 'classnames';
import Editor from './editor/Editor'
import EditorPage from './editor/EditorPage'


const Navigation = (props) => {
  console.log("prop nav ", props)
  const { actions, setCopePage } = props;

  return (
    <Col>
      <Button onClick={() => actions.setHome("index")}>Home</Button>
      <Button onClick={() => actions.back("index")}>Back</Button>
    </Col>
  )
}


const Cope = (props) => {
  const [product, setProduct] = useState("index");
  const [activeTab, setActiveTab] = useState('1');
  const [openEditor, setOpenEditor] = useState(false);

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  const toggleEditor = () => setOpenEditor(!openEditor);


  return (
    <div>
      <Row>
        <Col xs='4'>
          <Card>
            {/* <CardImg top width="100%" src={"https://picsum.photos/1200"} alt="Card image cap" /> */}
            <CardBody>
              <Row className="mt-2">
                <CardTitle>
                  <h1>Mitre Doors</h1>
                </CardTitle>
              </Row>

              <Row className="mt-2 mb-3">
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
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '4' })}
                      onClick={() => { toggle('4'); }}
                    >
                      Applied Profiles
                    </NavLink>
                  </NavItem>
                </Nav>
              </Row>

              <Row>
                <Col>
                  <p>
                    Cope-and-stick joinery produces great-looking frames for cabinet doors, but you need specialized router bits or shaper cutters to do the job the traditional way. Those items don't come cheap. So we found a low-cost, low-tech alternative, based on a simple dovetail bit.</p>

                  <p>First, let's define some terms. "Stick" or "sticking" refers to the molded edge that's cut along the inside edge of the frame; pieces that meet that molding at a right angle must be "coped" to match the profile. Our technique replaces the usual round-over profile with a clean, simple bevel. It produces a subtle effect, not a dramatic one.</p>

                  <p>If you have a router, a router table, a dovetail bit, and a slot cutter, you can do it the way we show here. Begin by cutting the stiles to their final length. Lay out the rails by adding 1" to the final inside width of the frame. That measurement will allow for a 1⁄2 " stub tenon on both ends of each rail.</p>

                  <Button color="primary" onClick={toggleEditor} style={{ marginBottom: '1rem' }}>View Breakdowns</Button>
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
                <Applied_Profiles applied_profiles={props.applied_profiles} />
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
  )


}

const mapStateToProps = (state) => ({
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
      getWoodtypes,
      getCopeDesigns,
      getEdges,
      getProfiles,
      getPanels,
      getAppliedMoulds,
      updateProduct
    },
    dispatch
  );



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cope);

