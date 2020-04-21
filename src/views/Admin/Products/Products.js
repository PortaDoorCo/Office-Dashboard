import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ProductCard from './components/Card'
import Selection from './Products/Door/Selection'




const Products = (props) => {

  const [page, setPage] = useState("index");

  if (page === "index") {
    return (
      <div>
        <Row>
          <Col xs='2' />
          <Col>
            <Row>
              <Col>
                <ProductCard title={"Doors"} img={"https://picsum.photos/200"} setPage={setPage} page={"doors"} />
              </Col>
              <Col>
                <ProductCard title={"Drawer Boxes"} img={"https://picsum.photos/200"} setPage={setPage} page={"drawers"} />
              </Col>
            </Row>
          </Col>
          <Col xs='2' />
        </Row>
      </div>
    );
  }

  if(page === "doors"){
    return (
      <Selection setPage={setPage} />
    )
  }
}

export default Products