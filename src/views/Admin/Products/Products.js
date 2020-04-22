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
                <ProductCard title={"Doors"} img={"https://www.portadoor.com/img/bg-img/cope.png"} setPage={setPage} page={"doors"} />
              </Col>
              <Col>
                <ProductCard title={"Drawer Fronts"} img={"https://www.portadoor.com/img/bg-img/df.png"} setPage={setPage} page={"df"} />
              </Col>
              <Col>
                <ProductCard title={"Drawer Boxes"} img={"https://www.portadoor.com/img/bg-img/drawer.png"} setPage={setPage} page={"drawers"} />
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
      <Selection setHome={setPage} />
    )
  }
}

export default Products