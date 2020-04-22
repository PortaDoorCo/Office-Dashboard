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
import { getWoodtypes, getCopeDesigns, getEdges, getProfiles, getPanels, getAppliedMoulds } from '../../../../../../redux/part_list/actions'
import ProductCard from '../../../components/Card'


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
                <ProductCard title={"Woodtype"} img={"https://res.cloudinary.com/porta-door/image/upload/v1586894215/lbkmac7r4oihk6izofeq.jpg"} setPage={setCopePage} page={"woodtypes"} />
              </Col>
              <Col>
                <ProductCard title={"Designs"} img={"https://res.cloudinary.com/porta-door/image/upload/v1586890553/cpvmmmwrbe2bg5bse6et.jpg"} setPage={setCopePage} page={"designs"} />
              </Col>
              <Col>
                <ProductCard title={"Edges"} img={"https://res.cloudinary.com/porta-door/image/upload/v1586891981/pkri4aryt8jeucphntcl.png"} setPage={setCopePage} page={"edges"} />
              </Col>
            </Row>

            <Row>
              <Col>
                <ProductCard title={"Profiles"} img={"https://res.cloudinary.com/porta-door/image/upload/v1586890869/geemwpiuqgvofkkcji5d.png"} setPage={setCopePage} page={"profiles"} />
              </Col>
              <Col>
                <ProductCard title={"Panels"} img={"https://res.cloudinary.com/porta-door/image/upload/v1586894930/a763txikjeuju8a0uluc.png"} setPage={setCopePage} page={"panels"} />
              </Col>
              <Col>
                <ProductCard title={"Applied Profiles"} img={"https://res.cloudinary.com/porta-door/image/upload/v1586890323/fiphjvehfeaiechaefvc.png"} setPage={setCopePage} page={"applied_profiles"} />
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

            <Woodtype getProduct={props.getWoodtypes} woodtypes={props.woodtypes} />


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
      getAppliedMoulds
    },
    dispatch
  );



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cope);

