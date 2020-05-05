import React, { useState } from 'react';
import { Row, Col, Card, CardImg, CardBody, CardTitle, Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap'
import Cookies from "js-cookie";
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';
import { FileUploader } from 'devextreme-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


const cookie = Cookies.get("jwt");
const header = { 'Authorization': 'Bearer ' + cookie };



const Users = (props) => {

  const {
    buttonLabel,
    className,
    role
  } = props;

  const [modal, setModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [product, setProduct] = useState({
    id: '',
    NAME: '',
    UPCHARGE: '',
    UPCHARGE_THICK: '',
    TOP_RAIL_ADD: '',
    BTM_RAIL_ADD: '',
    photo: null
  });
  const [newProduct, setNewProduct] = useState(false)

  const toggle = () => {
    setModal(!modal)
  };

  const toggleWarningModal = () => {
    setWarningModal(!warningModal)
  };


  const setCard = card => {
    setNewProduct(false)
    setProduct(card)
    toggle()
  }


  const change = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setProduct((prevState) => {
      return ({
        ...prevState,
        [name]: value
      })
    })
  }


  const card = props.users.map(card => {
    return (
      <div key={card.id} className="mr-1 ml-1 flex-wrap" style={{ width: "200px" }}>
        <Card style={{ height: "100%" }} onClick={() => setCard(card)}>
          {card.profile_picture ? <CardImg top width="100%" src={card.profile_picture.url} alt="Card image cap" /> : <CardImg top width="100%" src={"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"} alt="Card image cap" />}
          <CardBody>
            <CardTitle><strong>First Name:</strong> {card.FirstName}</CardTitle>
            <CardTitle><strong>Last Name:</strong> {card.LastName}</CardTitle>
            <CardTitle><strong>Role:</strong> {card.role.name}</CardTitle>
            <CardTitle><strong>Username:</strong> {card.username}</CardTitle>
            <CardTitle><strong>Email:</strong> {card.email}</CardTitle>
          </CardBody>
        </Card>
      </div>
    );
  })

  return (
    <div className="container">


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


              </Col>
            </Row>
            <Row className="mb-2">
              <Col>
                <Label for="Name">Name</Label>
                <Input value={product.NAME} name="NAME" onChange={(e) => change(e)}></Input>
              </Col>
            </Row>

            <Row>
              <Col>
                <Label for="4/4_Price">4/4 Price</Label>
                <Input value={product.UPCHARGE} name="UPCHARGE" onChange={(e) => change(e)}></Input>
              </Col>
              <Col>
                <Label for="5/4_Price">5/4 Price</Label>
                <Input value={product.UPCHARGE_THICK} name="UPCHARGE_THICK" onChange={(e) => change(e)}></Input>
              </Col>
            </Row>
            <Row>
              <Col>
                <Label for="4/4_Price">Top Rail Arch</Label>
                <Input value={product.TOP_RAIL_ADD} name="TOP_RAIL_ADD" onChange={(e) => change(e)}></Input>
              </Col>
              <Col>
                <Label for="5/4_Price">Bottom Rail Arch</Label>
                <Input value={product.BTM_RAIL_ADD} name="BTM_RAIL_ADD" onChange={(e) => change(e)}></Input>
              </Col>
            </Row>


            <Row className="mt-5">

              <Col>
                {newProduct ?
                  <div />
                  :
                  <div>
                    <Button color="danger" onClick={toggleWarningModal}>Delete</Button>
                  </div>
                }
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>

      <Modal isOpen={warningModal} toggle={toggleWarningModal} className={className}>
        <ModalHeader toggle={warningModal}>Are You Sure?</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this item?
            </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={warningModal}>No</Button>
        </ModalFooter>
      </Modal>
    </div>
  )





}

const mapStateToProps = (state) => ({
  designs: state.part_list.cope_designs,
  role: state.users.user.role,
  users: state.users.registeredUsers
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {

    },
    dispatch
  );



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);
