import React from 'react';
<<<<<<< HEAD
import { Card, CardImg} from 'reactstrap';
=======
import { Card, CardImg } from 'reactstrap';
>>>>>>> staging

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