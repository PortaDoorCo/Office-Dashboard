import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  FormGroup,
} from 'reactstrap';
import Cookies from 'js-cookie';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  updateMiscItem,
  addMiscItem,
  deleteMiscItem,
} from '../../../../../../redux/misc_items/actions';
import FileUploader from '../../../../../../components/FileUploader/FileUploader';
import { AppSwitch } from '@coreui/react';
import Select from 'react-select';

const cookie = Cookies.get('jwt');

const Designs = (props) => {
  const { className, role, product_type, categories } = props;

  const [modal, setModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [product, setProduct] = useState({
    id: '',
    NAME: '',
    Price: '',
    count_items: false,
    categories: [],
    photo: null,
    product: product_type,
  });
  const [newProduct, setNewProduct] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(props.designs);

  const handleChange = (selectedOption) => {
    setProduct((prevState) => {
      return {
        ...prevState,
        categories: selectedOption,
      };
    });
  };

  useEffect(() => {
    setFilteredProducts(props.designs);
  }, [props.designs]);

  const toggle = () => {
    setModal(!modal);
  };

  const toggleWarningModal = () => {
    setWarningModal(!warningModal);
  };

  const setCard = (card) => {
    setNewProduct(false);
    setProduct(card);
    toggle();
  };

  const addProd = () => {
    const p = {
      NAME: '',
      Price: '',
      count_items: false,
      categories: [],
      photo: null,
    };
    setNewProduct(true);
    setProduct(p);
    toggle();
  };

  const change = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setProduct((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const onUploaded = (e) => {
    setProduct((prevState) => {
      return {
        ...prevState,
        photo: e[0],
      };
    });
    return;
  };

  const updateProduct = async () => {
    let id = product.id;
    let updatedProduct = product;
    await props.updateMiscItem(id, updatedProduct, cookie);
    await setModal(!modal);
  };

  const deleteProduct = async () => {
    let id = product.id;

    await props.deleteMiscItem(id, cookie);
    await toggleWarningModal();
    await toggle();
  };

  const submitProduct = async () => {
    const item = props.designs.length + 1;
    const submittedProduct = {
      NAME: product.NAME,
      Price: product.Price,
      count_items: product.count_items,
      categories: product.categories.map((i) => i),
      photo: product.photo ? product.photo.id : '',
      Item: item,
    };
    await props.addMiscItem(submittedProduct, cookie);
    await setModal(!modal);
  };

  const changeFilterValue = (e) => {
    setFilteredProducts(
      props.designs.filter((i) =>
        i.NAME.split(' ')
          .join('')
          .toLowerCase()
          .includes(e.target.value.split(' ').join(''))
      )
    );
  };

  const card = filteredProducts.map((card) => {
    return (
      <div
        key={card.id}
        className="mr-1 ml-1 flex-wrap"
        style={{ width: '200px' }}
      >
        <Card style={{ height: '100%' }} onClick={() => setCard(card)}>
          {card.photo ? (
            <CardImg
              top
              width="100%"
              src={card.photo.url}
              alt="Card image cap"
            />
          ) : (
            <CardImg
              top
              width="100%"
              src={
                'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png'
              }
              alt="Card image cap"
            />
          )}
          <CardBody>
            <CardTitle>
              <strong>{card.NAME}</strong>
            </CardTitle>
            <CardTitle>
              <strong>Price:</strong> ${card.Price}
            </CardTitle>
            <CardTitle>
              <strong>Count Items:</strong>{' '}
              {card.count_items ? 'True' : 'False'}
            </CardTitle>
            <CardTitle>
              <strong>Categories:</strong>{' '}
              {card.categories.map((i) => (
                <li>{i.NAME}</li>
              ))}
            </CardTitle>
          </CardBody>
        </Card>
      </div>
    );
  });

  if (
    role &&
    (role.type === 'management' ||
      role.type === 'authenticated' ||
      role.type === 'owner' ||
      role.type === 'administrator')
  ) {
    return (
      <div>
        <Row className="mb-2">
          <Col>
            <FormGroup>
              <Label htmlFor="search">Search</Label>
              <Input onChange={(e) => changeFilterValue(e)} />
            </FormGroup>
          </Col>
          <Col xs="9" />
        </Row>

        <Row className="mb-2">
          <Col>
            <Button color="primary" onClick={addProd}>
              Add New
            </Button>
          </Col>
        </Row>

        <Row style={{ height: '600px' }}>
          <PerfectScrollbar>
            <div className="col d-flex align-content-start flex-wrap">
              {card}
            </div>
          </PerfectScrollbar>
        </Row>

        <div>
          <Modal isOpen={modal} toggle={toggle} className={className}>
            <ModalHeader toggle={toggle}>{product.NAME}</ModalHeader>
            <ModalBody>
              <Row className="mb-2">
                <Col>
                  <div className="col d-flex align-content-start flex-wrap">
                    {product.photo ? (
                      <CardImg
                        top
                        src={product.photo.url}
                        alt="Card image cap"
                      />
                    ) : (
                      <CardImg
                        top
                        width="200px"
                        src={
                          'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png'
                        }
                        alt="Card image cap"
                      />
                    )}
                  </div>

                  <FileUploader onUploaded={onUploaded} multi={false} />
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <Label for="Name">Name</Label>
                  <Input
                    value={product.NAME}
                    name="NAME"
                    onChange={(e) => change(e)}
                  ></Input>
                </Col>
                <Col>
                  <Label for="Moulding_Width">Price</Label>
                  <Input
                    type="number"
                    value={product.Price}
                    name="Price"
                    onChange={(e) => change(e)}
                  ></Input>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label for="categories">Categories</Label>
                  <Select
                    value={product.categories}
                    onChange={handleChange}
                    options={categories}
                    isMulti={true}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col>
                      <Label for="5/4_Price">Count Items</Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <AppSwitch
                        className={'mx-1'}
                        variant={'pill'}
                        color={'primary'}
                        onChange={() =>
                          setProduct((prevState) => {
                            return {
                              ...prevState,
                              count_items: !prevState.count_items,
                            };
                          })
                        }
                        checked={product.count_items}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="mt-5">
                <Col>
                  {newProduct ? (
                    <div />
                  ) : (
                    <div>
                      <Button color="danger" onClick={toggleWarningModal}>
                        Delete
                      </Button>
                    </div>
                  )}
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              {newProduct ? (
                <div>
                  <Button color="primary" onClick={submitProduct}>
                    Submit
                  </Button>
                </div>
              ) : (
                <div>
                  <Button color="primary" onClick={updateProduct}>
                    Update
                  </Button>
                </div>
              )}

              <Button color="secondary" onClick={toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>

        <Modal
          isOpen={warningModal}
          toggle={toggleWarningModal}
          className={className}
        >
          <ModalHeader toggle={warningModal}>Are You Sure?</ModalHeader>
          <ModalBody>Are you sure you want to delete this item?</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={deleteProduct}>
              Yes
            </Button>
            <Button color="primary" onClick={warningModal}>
              No
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  } else {
    return (
      <div>
        <Row className="mb-2">
          <Col>
            <FormGroup>
              <Label htmlFor="search">Search</Label>
              <Input onChange={(e) => changeFilterValue(e)} />
            </FormGroup>
          </Col>
          <Col xs="9" />
        </Row>

        <Row style={{ height: '600px' }}>
          <PerfectScrollbar>
            <div className="col d-flex align-content-start flex-wrap">
              {card}
            </div>
          </PerfectScrollbar>
        </Row>

        <div>
          <Modal isOpen={modal} toggle={toggle} className={className}>
            <ModalHeader toggle={toggle}>{product.NAME}</ModalHeader>
            <ModalBody>
              <Row className="mb-2">
                <Col>
                  <div className="col d-flex align-content-start flex-wrap">
                    {product.photo ? (
                      <CardImg
                        top
                        src={product.photo.url}
                        alt="Card image cap"
                      />
                    ) : (
                      <CardImg
                        top
                        width="200px"
                        src={
                          'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png'
                        }
                        alt="Card image cap"
                      />
                    )}
                  </div>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <Label for="Name">Name</Label>
                  <Input
                    value={product.NAME}
                    name="NAME"
                    disabled
                    onChange={(e) => change(e)}
                  ></Input>
                </Col>
                <Col>
                  <Label for="4/4_Price">Price</Label>
                  <Input
                    type="number"
                    value={product.Price}
                    disabled
                    name="Price"
                    onChange={(e) => change(e)}
                  ></Input>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label for="Moulding_Width">Categories</Label>
                  <Select
                    disabled
                    value={product.categories}
                    onChange={handleChange}
                    options={categories}
                    isMulti={true}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col>
                      <Label for="5/4_Price">Count Items</Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <AppSwitch
                        className={'mx-1'}
                        variant={'pill'}
                        color={'primary'}
                        disabled
                        onChange={() =>
                          setProduct((prevState) => {
                            return {
                              ...prevState,
                              count_items: !prevState.count_items,
                            };
                          })
                        }
                        checked={product.count_items}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>

        <Modal
          isOpen={warningModal}
          toggle={toggleWarningModal}
          className={className}
        >
          <ModalHeader toggle={warningModal}>Are You Sure?</ModalHeader>
          <ModalBody>Are you sure you want to delete this item?</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={deleteProduct}>
              Yes
            </Button>
            <Button color="primary" onClick={warningModal}>
              No
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  designs: state.misc_items.misc_items,
  categories: state.misc_items.categories,
  role: state.users.user.role,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateMiscItem,
      addMiscItem,
      deleteMiscItem,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Designs);
