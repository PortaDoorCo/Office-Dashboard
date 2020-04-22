import React from 'react';
import { Card, CardImg, CardBody, CardTitle, Button, ButtonGroup } from 'reactstrap'
import Cookies from "js-cookie";

const cookie = Cookies.get("jwt");




class Woodtype extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    console.log(this.props)

    const card = this.props.woodtypes.map(card => {
      console.log("CARD  ", card)
      return (
        <div className="mr-1 ml-1 flex-wrap" style={{width: "200px"}}>
          <Card style={{height:"100%"}}>
            {card.photo? <CardImg top width="100%" height="100%" src={card.photo.url} alt="Card image cap" /> : <CardImg top width="100%" src={"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"} alt="Card image cap" /> }
            <CardBody>
              <CardTitle><strong>{card.NAME}</strong></CardTitle>
              <CardTitle><strong>4/4 Price:</strong> ${card.STANDARD_GRADE}</CardTitle>
              <CardTitle><strong>5/4 Price:</strong> ${card.STANDARD_GRADE_THICK}</CardTitle>
              <Button color="primary">Edit</Button>
            </CardBody>
          </Card>
        </div>
      );
    })

    return (
      <div className="container">
        <div className="row">
          <div className="col d-flex align-content-start flex-wrap">{card}</div>
        </div>
      </div>
    )

  }
}
export default Woodtype;
