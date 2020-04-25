import React, { useState } from 'react';
import { Row, Col, Card, CardImg, CardBody, CardTitle, Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap'
import Cookies from "js-cookie";
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';

const cookie = Cookies.get("jwt");



const Woodtype = (props) => {

  const {
    buttonLabel,
    className
  } = props;


  const [modal, setModal] = useState(false);
  const [product, setProduct] = useState({
    id: '',
    NAME: '',
    STANDARD_GRADE: '',
    STANDARD_GRADE_THICK: ''
  });

  const toggle = (e) => {
    setProduct(e)
    setModal(!modal)
  };

  const changePrice = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setProduct((prevState) => {
      return ({
        ...prevState,
        [name]: parseFloat(value)
      })
    })
  }

  const changeName = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setProduct((prevState) => {
      return ({
        ...prevState,
        [name]: value
      })
    })
  }

  const updateProduct = async () => {
    let id = product.id
    let updatedProduct = product
    await props.updateProduct(id, updatedProduct, "woodtypes", cookie)
    await setModal(!modal)
    await props.getWoodtypes(cookie)
  }


  const card = props.woodtypes.map(card => {
    return (
      <div key={card.id} className="mr-1 ml-1 flex-wrap" style={{ width: "200px" }}>
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

      <div>
        <Modal isOpen={modal} toggle={toggle} className={className}>
          <ModalHeader toggle={toggle}>{product.NAME}</ModalHeader>
          <ModalBody>
            <Row className="mb-2">

              <Col>
                <div className="col d-flex align-content-start flex-wrap">
                  {product.photo ? <CardImg top src={product.photo.url} alt="Card image cap" /> : <CardImg top width="200px" src={"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"} alt="Card image cap" />}
                </div>

                <Input type="file" name="file" id="exampleFile" className="mt-2" />
              </Col>
            </Row>
            <Row className="mb-2">
              <Col>
                <Label for="Name">Name</Label>
                <Input value={product.NAME} name="NAME" onChange={(e) => changeName(e)}></Input>
              </Col>
            </Row>
            <Row>
              <Col>
                <Label for="4/4_Price">4/4 Price</Label>
                <Input value={product.STANDARD_GRADE} name="STANDARD_GRADE" onChange={(e) => changePrice(e)}></Input>
              </Col>
              <Col>
                <Label for="5/4_Price">5/4 Price</Label>
                <Input value={product.STANDARD_GRADE_THICK} name="STANDARD_GRADE_THICK" onChange={(e) => changePrice(e)}></Input>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={updateProduct}>Update</Button>{' '}
            <Button color="secondary" onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  )


}

export default Woodtype;
