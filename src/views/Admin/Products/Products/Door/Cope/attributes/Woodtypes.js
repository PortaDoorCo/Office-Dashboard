import React, { useState } from 'react';
import { Card, CardImg, CardBody, CardTitle, Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Cookies from "js-cookie";

const cookie = Cookies.get("jwt");



const Woodtype = (props) => {

  const {
    buttonLabel,
    className
  } = props;


  const [modal, setModal] = useState(false);
  const [product, setProduct] = useState({
    NAME: '',
    STANDARD_GRADE: '',
    STANDARD_GRADE_THICK: ''

  });

  const toggle = (e) => {
    setProduct(e)
    setModal(!modal)
  };

  const card = props.woodtypes.map(card => {
    return (
      <div className="mr-1 ml-1 flex-wrap" style={{ width: "200px" }}>
        <Card style={{ height: "100%" }} onClick={() => toggle(card)}>
          {card.photo ? <CardImg top width="100%" height="100%" src={card.photo.url} alt="Card image cap" /> : <CardImg top width="100%" src={"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"} alt="Card image cap" />}
          <CardBody>
            <CardTitle><strong>{card.NAME}</strong></CardTitle>
            <CardTitle><strong>4/4 Price:</strong> ${card.STANDARD_GRADE}</CardTitle>
            <CardTitle><strong>5/4 Price:</strong> ${card.STANDARD_GRADE_THICK}</CardTitle>
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

      <div>
        <Button color="danger" onClick={toggle}>{buttonLabel}</Button>
        <Modal isOpen={modal} toggle={toggle} className={className}>
          <ModalHeader toggle={toggle}>{product.NAME}</ModalHeader>
          <ModalBody>
            <p>${product.STANDARD_GRADE}</p>
            <p>${product.STANDARD_GRADE_THICK}</p>
        </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
            <Button color="secondary" onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>

    </div>
  )


}

export default Woodtype;
