import React from 'react';
import { Card, CardImg, CardBody, CardTitle, Button, ButtonGroup } from 'reactstrap'
import Cookies from "js-cookie";

const cookie = Cookies.get("jwt");




class Profiles extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    console.log(this.props)

    const card = this.props.profiles.map(card => {
      console.log("CARD  ", card)
      return (
        <div className="mr-1 ml-1 flex-wrap" style={{width: "200px"}}>
          <Card style={{height:"100%"}}>
            {card.photo ? <CardImg top width="100%" src={card.photo.url} alt="Card image cap" /> : <CardImg top width="100%" src={"https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101065/112815953-stock-vector-no-image-available-icon-flat-vector.jpg?ver=6"} alt="Card image cap" /> }
            <CardBody>
              <CardTitle><strong>{card.NAME}</strong></CardTitle>
              <CardTitle><strong>Inset: </strong> {card.INSET}</CardTitle>
              <CardTitle><strong>Stile/Rail Width: </strong> {card.MINIMUM_STILE_WIDTH}</CardTitle>
              <CardTitle><strong>Mid Rail Width: </strong> {card.MID_RAIL_MINIMUMS}</CardTitle>
            </CardBody>
          </Card>
        </div>
      );
    })

    return (
      <div>
        <div className="row">
          <div className="col d-flex align-content-start flex-wrap">{card}</div>
        </div>
      </div>
    )

  }
}
export default Profiles;
