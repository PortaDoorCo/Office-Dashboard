import React from 'react';
import { Card, CardImg} from 'reactstrap';

const ProductCard = (props) => {
  return (
    <div>
      <Card height="100%"  onClick={()=> props.setPage(props.page)}>
        <CardImg top width="100%" src={props.img} alt="Card image cap" />
      </Card>
    </div>
  );
};


export default ProductCard;