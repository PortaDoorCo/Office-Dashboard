import React from 'react';
import { Breadcrumb, BreadcrumbItem, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Products from './attributes/Designs';
import { updateProduct } from '../../../../../../redux/part_list/actions';


const Navigation = (props) => {

  return (
    <Col>
      <Breadcrumb>
        <BreadcrumbItem>Mouldings</BreadcrumbItem>
        <BreadcrumbItem active>Solid Crowns</BreadcrumbItem>
      </Breadcrumb>
    </Col>
  );
};

const Product = (props) => {
  return (
    <div>
      <Row>
        <Navigation />
      </Row>
      <Row>
        <Col xs='12'>
          <Card>
            <CardBody>
              <Row className="mt-2">
                <Col>
                  <CardTitle>
                    <h1>Solid Crowns</h1>
                  </CardTitle>
                  <Products product_type="solid-crowns" />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => ({
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
)(Product);

