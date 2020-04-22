import React, { Component } from 'react';
import { Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Button} from 'reactstrap'

const ProductCard = (props) => {
  return (
    <div>
      <Card height="100%">
        <CardImg top width="100%" src={props.img} alt="Card image cap" />
        <CardBody>
          <CardTitle>{props.title}</CardTitle>
          <Button onClick={()=> props.setPage(props.page)}>Button</Button>
        </CardBody>
      </Card>
    </div>
  );
}


export default ProductCard;