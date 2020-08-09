import React, { Component } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
  Input
} from 'reactstrap';
import { deleteProduct } from '../../../redux/part_list/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


class DeleteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      matchPassword: 'honest',
      errorMessage: false
    };
  }

  deleteItem = async (url) => {
    if (this.state.password === this.state.matchPassword) {
      const data = this.props.deleteKey;
     
      await this.props.deleteProduct(data.id, this.props.url);
      alert('here');
      await this.clearChanges();
    }
    else {
      this.setState({
        errorMessage: true
      });
    }

  }

  handleChange = (event) => {
    this.setState({ password: event.target.value });
  }

  clearChanges = async () => {
    await this.props.toggle();
    await this.setState({
      password: '',
      errorMessage: false
    });
  }



  render() {
    const props = this.props;
    
    return (
      <div className="animated noPrint">
        <Modal
          isOpen={props.modal}
          toggle={props.toggle}
          className="modal-md"
        >
          <ModalHeader toggle={props.toggle}>Are You Sure?</ModalHeader>
          <ModalBody>
            <Row>
              <Col>
                <p>Are You Sure You Want To Delete This Item?</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <Input type="password" placeholder="Enter Password" value={this.state.password} onChange={this.handleChange} />
              </Col>
              <Col />
            </Row>
            {this.state.errorMessage ?
              <Row>
                <Col>
                  <p style={{ color: 'red' }}>Wrong Password</p>
                </Col>
              </Row>
              : null
            }
          </ModalBody>
          <ModalFooter>
            <Row>
              <Col>
                <Button color="danger" onClick={this.clearChanges}>No</Button>
                <Button color="primary" onClick={this.deleteItem}>Yes</Button>
              </Col>
            </Row>
          </ModalFooter>
        </Modal>
      </div>
    );

  }
}

const mapStateToProps = (state, prop) => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deleteProduct
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteModal);
