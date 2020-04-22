import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ProductCard from './components/Card'
import Selection from './Products/Door/Selection'

import DoorPNG from './img/door.png'
import df_PNG from './img/df.png'
import drawerBoxPNG from './img/DrawerBox.png'




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
                <ProductCard title={"Doors"} img={DoorPNG} setPage={setPage} page={"doors"} />
              </Col>
              <Col>
                <ProductCard title={"Drawer Fronts"} img={df_PNG} setPage={setPage} page={"df"} />
              </Col>
              <Col>
                <ProductCard title={"Drawer Boxes"} img={drawerBoxPNG} setPage={setPage} page={"drawers"} />
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

  else {
    return <div />
  }
}

export default Products