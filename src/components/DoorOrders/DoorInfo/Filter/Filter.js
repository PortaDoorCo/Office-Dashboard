import React, { Component, Fragment } from 'react';
import { Row, Col, FormGroup, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { Field, untouch, autofill } from 'redux-form';
import { renderDropdownList } from '../../../RenderInputs/renderInputs';
import ModalUtil from '../../../../utils/Modal';

const faceFrameOrderType = [
  {
    name: 'Face Frame',
    value: 'Face_Frame',
  },
];

const construction_one_piece = [
  {
    name: 'Cope And Stick',
    value: 'Cope',
  },
  {
    name: 'Mitered Construction',
    value: 'Miter',
  },
  {
    name: 'MT Construction',
    value: 'MT',
  },
];

const thickness_one_piece = [
  {
    name: '4/4 Standard Grade',
    value: 1,
  },
  {
    name: '5/4 Standard Grade',
    value: 3,
  },
];

const required = (value) => (value ? undefined : 'Required');

class DoorFilter extends Component {

  state = {
    title: 'Are You Sure?',
    message: <div>
      <center>
        <p>Are You Sure That This For A <strong>Door</strong>?</p>
        <p>If you meant to select a <strong>Slab Drawer Front</strong></p>
        <p>Please Change the Order Type to Drawer Front</p>
      </center>
    </div>,
    modal: false
  };

  toggle = () => {
    this.setState({modal: !this.state.modal});
  }


  onChangeType = (index) => {
    if (this.props.formState) {
      this.props.formState.part_list.forEach((part, i) => {

        console.log({part});

        if(part.orderType.value === 'Door' && part.construction.value === 'Slab'){
          this.toggle();
        }

        if(part.orderType.value === 'DF' && part.construction.value === 'Slab'){
          // this.setState({
          //   message: <div>
          //     <center>
          //       <p>Are You Sure That This For A <strong>Drawer Front</strong>?</p>
          //       <p>If you meant to select a <strong>Slab Door</strong></p>
          //       <p>Please Change the Order Type to Door</p>
          //     </center>
          //   </div>
          // });
          this.toggle();
        }



        if (index === i && part.design !== undefined) {
          this.props.dispatch(
            autofill('Order', `part_list[${i}].design`, undefined)
          );

          this.props.dispatch(
            untouch('Order', `part_list[${i}].cope_design`)
          );
        }

        if (index === i && part.woodtype !== undefined) {
          this.props.dispatch(
            autofill('Order', `part_list[${i}].woodtype`, undefined)
          );

          this.props.dispatch(untouch('Order', `part_list[${i}].woodtype`));
        }

        if (index === i && part.edge !== undefined) {
          this.props.dispatch(
            autofill('Order', `part_list[${i}].edge`, undefined)
          );
          this.props.dispatch(untouch('Order', `part_list[${i}].edge`));
        }

        if (index === i && part.panel !== undefined) {
          this.props.dispatch(
            autofill('Order', `part_list[${i}].panel`, undefined)
          );
          this.props.dispatch(untouch('Order', `part_list[${i}].panel`));
        }

        if (index === i && part.profile !== undefined) {
          this.props.dispatch(
            autofill('Order', `part_list[${i}].profile`, undefined)
          );
          this.props.dispatch(untouch('Order', `part_list[${i}].profile`));
        }

        if (index === i && part.applied_profile !== undefined) {
          this.props.dispatch(
            autofill('Order', `part_list[${i}].applied_profile`, undefined)
          );
          this.props.dispatch(
            untouch('Order', `part_list[${i}].applied_profile`)
          );
        }

        if (index === i && part.finish !== undefined) {
          this.props.dispatch(
            autofill('Order', `part_list[${i}].finish`, undefined)
          );
          this.props.dispatch(untouch('Order', `part_list[${i}].finish`));
        }

        if (index === i && part.face_frame_top_rail !== undefined) {
          this.props.dispatch(
            autofill(
              'Order',
              `part_list[${i}].face_frame_top_rail`,
              undefined
            )
          );
          this.props.dispatch(
            untouch('Order', `part_list[${i}].face_frame_top_rail`)
          );
        }

        if (index === i && part.furniture_feet !== undefined) {
          this.props.dispatch(
            autofill('Order', `part_list[${i}].furniture_feet`, undefined)
          );
          this.props.dispatch(
            untouch('Order', `part_list[${i}].furniture_feet`)
          );
        }
      });
    }
  };

  render() {
    const {
      formState,
      index,
      part,
      construction,
      thickness,
      ff_thickness,
      orderType,
      edit,
    } = this.props;

    if (formState && formState.part_list) {
      if (formState.part_list[index]?.orderType?.value === 'Face_Frame') {
        return (
          <Fragment>
            <Row>
              <Col xs="6">
                <FormGroup>
                  <Label for="orderType">Order Type</Label>
                  <Field
                    name={`${part}.orderType`}
                    component={renderDropdownList}
                    data={faceFrameOrderType}
                    onBlur={() => this.onChangeType(index)}
                    dataKey="value"
                    textField="name"
                    edit={edit}
                    validate={required}
                  />
                </FormGroup>
              </Col>

              <Col xs="6">
                <FormGroup>
                  <Label for="construction">Thickness</Label>
                  <Field
                    name={`${part}.thickness`}
                    component={renderDropdownList}
                    data={thickness}
                    dataKey="value"
                    textField="name"
                    edit={edit}
                    validate={required}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Fragment>
        );
      } else {
        if (
          formState.part_list[index]?.orderType?.value === 'One_Piece' ||
          formState.part_list[index]?.orderType?.value === 'One_Piece_DF' ||
          formState.part_list[index]?.orderType?.value === 'Two_Piece' ||
          formState.part_list[index]?.orderType?.value === 'Two_Piece_DF' 
        ) {
          return (
            <Fragment>
              <ModalUtil
                toggle={this.toggle}
                title={this.state.title}
                message={this.state.message}
                modal={this.state.modal}
              />
              <Row>
                <Col xs="4">
                  <FormGroup>
                    <Label for="orderType">Order Type</Label>
                    <Field
                      name={`${part}.orderType`}
                      component={renderDropdownList}
                      data={orderType}
                      onBlur={() => this.onChangeType(index)}
                      dataKey="value"
                      textField="name"
                      edit={edit}
                      validate={required}
                    />
                  </FormGroup>
                </Col>

                <Col xs="4">
                  <FormGroup>
                    <Label for="construction">Construction</Label>
                    <Field
                      name={`${part}.construction`}
                      component={renderDropdownList}
                      data={construction_one_piece}
                      onBlur={() => this.onChangeType(index)}
                      dataKey="value"
                      textField="name"
                      edit={edit}
                      validate={required}
                    />
                  </FormGroup>
                </Col>

                <Col xs="4">
                  <FormGroup>
                    <Label for="construction">Thickness / Grade</Label>
                    <Field
                      name={`${part}.thickness`}
                      component={renderDropdownList}
                      data={thickness_one_piece}
                      dataKey="value"
                      textField="name"
                      edit={edit}
                      validate={required}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Fragment>
          );
        } else {
          return (
            <Fragment>
              <ModalUtil
                toggle={this.toggle}
                title={this.state.title}
                message={this.state.message}
                modal={this.state.modal}
              />
              <Row>
                <Col xs="4">
                  <FormGroup>
                    <Label for="orderType">Order Type</Label>
                    <Field
                      name={`${part}.orderType`}
                      component={renderDropdownList}
                      data={orderType}
                      onBlur={() => this.onChangeType(index)}
                      dataKey="value"
                      textField="name"
                      edit={edit}
                      validate={required}
                    />
                  </FormGroup>
                </Col>

                <Col xs="4">
                  <FormGroup>
                    <Label for="construction">Construction</Label>
                    <Field
                      name={`${part}.construction`}
                      component={renderDropdownList}
                      data={construction}
                      onBlur={() => this.onChangeType(index)}
                      dataKey="value"
                      textField="name"
                      edit={edit}
                      validate={required}
                    />
                  </FormGroup>
                </Col>

                <Col xs="4">
                  <FormGroup>
                    <Label for="construction">Thickness / Grade</Label>
                    <Field
                      name={`${part}.thickness`}
                      component={renderDropdownList}
                      data={thickness}
                      dataKey="value"
                      textField="name"
                      edit={edit}
                      validate={required}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Fragment>
          );
        }
      }
    } else {
      return null;
    }
  }
}

export default connect()(DoorFilter);
