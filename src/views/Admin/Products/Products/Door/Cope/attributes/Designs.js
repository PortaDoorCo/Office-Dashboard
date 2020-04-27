import React from 'react';
import { Row, Col, Card, CardImg, CardBody, CardTitle, Button, ButtonGroup } from 'reactstrap'
import Cookies from "js-cookie";
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';

const cookie = Cookies.get("jwt");




class Designs extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {


    const card = this.props.designs.map(card => {
 
      return (
        <div className="mr-1 ml-1 flex-wrap" style={{width: "200px"}}>
          <Card style={{height:"100%"}}>
            {card.photo ? <CardImg top width="100%" height="100%" src={card.photo.url} alt="Card image cap" /> : <CardImg top width="100%" src={"https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101065/112815953-stock-vector-no-image-available-icon-flat-vector.jpg?ver=6"} alt="Card image cap" /> }
            <CardBody>
              <CardTitle><strong>{card.NAME}</strong></CardTitle>
              <CardTitle><strong>4/4 Price:</strong> ${card.UPCHARGE}</CardTitle>
              <CardTitle><strong>5/4 Price:</strong> ${card.UPCHARGE_THICK}</CardTitle>
              <CardTitle><strong>Top Rail Arch:</strong> {card.TOP_RAIL_ADD}</CardTitle>
              <CardTitle><strong>Bottom Rail Arch:</strong> {card.BTM_RAIL_ADD}</CardTitle>
            </CardBody>
          </Card>
        </div>
      );
    })

    return (
      <div>
        <Row className="mb-2">
          <Col>
            <Button color="primary" >Add New</Button>
          </Col>
        </Row>

        <Row style={{ height: "600px" }}>
          <PerfectScrollbar>
            <div className="col d-flex align-content-start flex-wrap">{card}</div>
          </PerfectScrollbar>
        </Row>
      </div>
    )

  }
}
export default Designs;
