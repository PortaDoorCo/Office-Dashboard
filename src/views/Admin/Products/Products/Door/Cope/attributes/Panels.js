import React from 'react';
import { Row, Col, Card, CardImg, CardBody, CardTitle, Button, ButtonGroup } from 'reactstrap'
import Cookies from "js-cookie";
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';

const cookie = Cookies.get("jwt");




class Panels extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    console.log(this.props)

    const card = this.props.panels.map(card => {
      console.log("CARD  ", card)
      return (
        <div className="mr-1 ml-1 flex-wrap" style={{width: "200px"}}>
          <Card style={{height:"100%"}}>
            {card.photo ? <CardImg top width="100%" src={card.photo.url} alt="Card image cap" /> : <CardImg top width="100%" src={"https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101065/112815953-stock-vector-no-image-available-icon-flat-vector.jpg?ver=6"} alt="Card image cap" /> }
            <CardBody>
              <CardTitle><strong>{card.NAME}</strong></CardTitle>
              <CardTitle><strong>Price: </strong> ${card.UPCHARGE}</CardTitle>
              <CardTitle><strong>Panel Factor: </strong> {card.PANEL_FACTOR}</CardTitle>
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
export default Panels;
