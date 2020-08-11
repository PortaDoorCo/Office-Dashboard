import React, { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, Row, Col, Card, CardBody, Collapse } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getWoodtypes, getCopeDesigns, getEdges, getProfiles, getPanels, getAppliedMoulds, updateProduct } from '../../../../../redux/part_list/actions';
import EditorPage from './editor/EditorPage';


const Navigation = (props) => {

  return (
    <Col>
      <Breadcrumb>
        <BreadcrumbItem>Pricing</BreadcrumbItem>
        <BreadcrumbItem active>Door Pricing</BreadcrumbItem>
      </Breadcrumb>
    </Col>
  );
};


const DoorPricing = (props) => {
  const [openEditor] = useState(true);
  return (
    <div>
      <Row>
        <Navigation />
      </Row>
      <Row>
        <Col xs='8'>
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
)(DoorPricing);

