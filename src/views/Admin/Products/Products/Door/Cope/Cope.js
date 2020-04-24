import React, { Component, useState } from 'react';
import { Row, Col, Button } from 'reactstrap'
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
  const [copePage, setCopePage] = useState("index");

  console.log('cope props', props)
  if (copePage === "index") {
    return (
      <div>
        <Row className="mb-2">
          <Navigation actions={props} setCopePage={setCopePage} />
        </Row>
        <Row>
          <Col xs='2' />
          <Col>
            <Row>
              <Col>
                <ProductCard title={"Woodtype"} img={WoodtypePNG} setPage={setCopePage} page={"woodtypes"} />
              </Col>
              <Col>
                <ProductCard title={"Designs"} img={DesignPNG} setPage={setCopePage} page={"designs"} />
              </Col>
              <Col>
                <ProductCard title={"Edges"} img={EdgePNG} setPage={setCopePage} page={"edges"} />
              </Col>
            </Row>

            <Row>
              <Col>
                <ProductCard title={"Profiles"} img={ProfilePNG} setPage={setCopePage} page={"profiles"} />
              </Col>
              <Col>
                <ProductCard title={"Panels"} img={PanelPNG} setPage={setCopePage} page={"panels"} />
              </Col>
              <Col>
                <ProductCard title={"Applied Profiles"} img={AppliedPNG} setPage={setCopePage} page={"applied_profiles"} />
              </Col>
            </Row>

          </Col>
          <Col xs='2' />
        </Row>
      </div>
    );
  }
  if (copePage === "woodtypes") {
    return (
      <div>
        <Row className="mb-2">
          <Navigation  actions={props} setCopePage={setCopePage}   />
        </Row>

        <Row>
            <Woodtype getWoodtypes={props.getWoodtypes} woodtypes={props.woodtypes} updateProduct={props.updateProduct} />
        </Row>
      </div>
    )
  }

  if (copePage === "designs") {
    return (
      <div>
        <Row className="mb-2">
          <Navigation actions={props} setCopePage={setCopePage} />
        </Row>

        <Row>
          <Col>
            <Designs designs={props.designs} />
          </Col>
        </Row>
      </div>
    )
  }

  if (copePage === "edges") {
    return (
      <div>
        <Row className="mb-2">
          <Navigation actions={props} setCopePage={setCopePage} />
        </Row>

        <Row>
          <Col>
            <Edges edges={props.edges} />
          </Col>
        </Row>
      </div>
    )
  }

  if (copePage === "profiles") {
    return (
      <div>
        <Row className="mb-2">
          <Navigation actions={props} setCopePage={setCopePage} />
        </Row>

        <Row>
          <Col>
            <Profiles profiles={props.profiles} />
          </Col>
        </Row>
      </div>
    )
  }

  if (copePage === "panels") {
    return (
      <div>
        <Row className="mb-2">
          <Navigation actions={props} setCopePage={setCopePage} />
        </Row>

        <Row>
          <Col>
            <Panels panels={props.panels} />
          </Col>
        </Row>
      </div>
    )
  }

  if (copePage === "applied_profiles") {
    return (
      <div>
        <Row className="mb-2">
          <Navigation actions={props} setCopePage={setCopePage} />
        </Row>

        <Row>
          <Col>
            <Applied_Profiles applied_profiles={props.applied_profiles} />
          </Col>
        </Row>
      </div>
    )
  }

  else {
    return (
      <div>
        <Row>
          <Navigation actions={props} setCopePage={setCopePage} />
        </Row>
      </div>
    )
  }


}

const mapStateToProps = state => ({
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

