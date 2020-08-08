import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap';


class SideBar extends Component {
  render() {
    return (
      <div className="animated">
        <Card>
          <CardHeader>
            <h4>Item #{this.props.i + 1}</h4>
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                <img src="https://www.portadoor.com/img/bg-img/drawer.png" height="100%" width="100%" alt="DrawerBox" />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default SideBar;
