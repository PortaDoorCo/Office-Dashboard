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

  const { actions, back } = props;

  return (
    <Col>
      <Button onClick={() => actions.setHome("index")}>Home</Button>
      <Button onClick={() => back("index")}>Back</Button>
    </Col>
  )
}

const Cope = (props) => {
  const [subPage, setSubPage] = useState("index");

  console.log('cope props', props)
  if (subPage === "index") {
    return (
      <div>
        <Row>
          <Navigation actions={props} />
        </Row>
        <Row>
          <Col xs='2' />
          <Col>
            <Row>
              <Col>
                <ProductCard title={"Woodtype"} img={"https://picsum.photos/200"} setPage={setSubPage} page={"woodtypes"} />
              </Col>
              <Col>
                <ProductCard title={"Designs"} img={"https://picsum.photos/200"} setPage={setSubPage} page={"designs"} />
              </Col>
              <Col>
                <ProductCard title={"Edges"} img={"https://picsum.photos/200"} setPage={setSubPage} page={"edges"} />
              </Col>
            </Row>

            <Row>
              <Col>
                <ProductCard title={"Profiles"} img={"https://picsum.photos/200"} setPage={setSubPage} page={"profiles"} />
              </Col>
              <Col>
                <ProductCard title={"Panels"} img={"https://picsum.photos/200"} setPage={setSubPage} page={"panels"} />
              </Col>
              <Col>
                <ProductCard title={"Applied Profiles"} img={"https://picsum.photos/200"} setPage={setSubPage} page={"applied_profiles"} />
              </Col>
            </Row>

          </Col>
          <Col xs='2' />
        </Row>
      </div>

    );
  }
  if (subPage === "woodtypes") {
    return (
      <div>
        <Row>
          <Navigation actions={props} back={setSubPage} />
        </Row>

        <Row>
          <Col>
            <Woodtype getProduct={props.getWoodtypes} />
          </Col>

        </Row>
      </div>
    )
  }

  if (subPage === "designs") {
    return (
      <div>
        <Row>
          <Navigation actions={props} back={setSubPage} />
        </Row>

        <Row>
          <Col>
            <Designs getProduct={props.getCopeDesigns} />
          </Col>
        </Row>
      </div>
    )
  }

  if (subPage === "edges") {
    return (
      <div>
        <Row>
          <Navigation actions={props} back={setSubPage} />
        </Row>

        <Row>
          <Col>
            <Edges getProduct={props.getEdges} />
          </Col>
        </Row>
      </div>
    )
  }

  if (subPage === "profiles") {
    return (
      <div>
        <Row>
          <Navigation actions={props} back={setSubPage} />
        </Row>

        <Row>
          <Col>
            <Profiles getProduct={props.getProfiles} />
          </Col>
        </Row>
      </div>
    )
  }

  if (subPage === "panels") {
    return (
      <div>
        <Row>
          <Navigation actions={props} back={setSubPage} />
        </Row>

        <Row>
          <Col>
            <Panels getProduct={props.getPanels} />
          </Col>
        </Row>
      </div>
    )
  }

  if (subPage === "applied_profiles") {
    return (
      <div>
        <Row>
          <Navigation actions={props} back={setSubPage} />
        </Row>

        <Row>
          <Col>
            <Applied_Profiles getProduct={props.getAppliedMoulds} />
          </Col>
        </Row>
      </div>
    )
  }

  else {
    return (
      <div>
        <Row>
          <Navigation actions={props} />
        </Row>
      </div>
    )
  }


}

const mapStateToProps = state => ({

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

