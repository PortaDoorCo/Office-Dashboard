import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap';

const style = {
  margin: 'auto',
  width: '100%',
  height: 'auto'
};

const comingSoon =
  'https://res.cloudinary.com/porta-door/image/upload/v1567619819/d4apmwwcrqmpe3tilboe.png';

class SideBar extends Component {
  render() {

    const { part } = this.props;

    return (
      <div className="animated">
        <Card>
          <CardHeader>
            <h4>Item #{this.props.i + 1}</h4>
          </CardHeader>
          <CardBody>
            <Row style={{ marginBottom: '10px' }}>
              <Col>
                <h4 style={{ textAlign: 'center' }}>Woodtype</h4>
                <div
                  style={{ width: '100px', height: '100px', margin: 'auto' }}
                >
                  {(part.woodtype && part.woodtype.photo) ? (
                    <img src={part.woodtype.photo.url} style={style} alt="" />
                  ) : (
                      <img src={comingSoon} style={style} alt="" />
                    )}
                </div>
              </Col>
              <Col>
                <h4 style={{ textAlign: 'center' }}>Design</h4>
                <div
                  style={{ width: '100px', height: '100px', margin: 'auto' }}
                >
                  {(part.design && part.design.photo) ? (
                    <img src={part.design.photo.url} style={style} alt="" />
                  ) : (
                      <img src={comingSoon} style={style} alt="" />
                    )}
                </div>
              </Col>





            </Row>
            <Row>

            <Col>
                <h4 style={{ textAlign: 'center' }}>Edge</h4>
                <div
                  style={{ width: '100px', height: '100px', margin: 'auto' }}
                >
                  {(part.edge && part.edge.photo) ? (
                    <img src={part.edge.photo.url} style={style} alt="" />
                  ) : (
                      <img src={comingSoon} style={style} alt="" />
                    )}
                </div>
              </Col>

              <Col>
                <h4 style={{ textAlign: 'center' }}>Panel</h4>
                <div
                  style={{ width: '100px', height: '100px', margin: 'auto' }}
                >
                  {(part.panel && part.panel.photo) ? (
                    <img src={part.panel.photo.url} style={style} alt="" />
                  ) : (
                      <img src={comingSoon} style={style} alt="" />
                    )}
                </div>
              </Col>

            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default SideBar;
