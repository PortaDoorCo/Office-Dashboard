import React, { Component } from 'react';
import {
  Row,
  Col,
  CardSubtitle,
  FormGroup,
  Label,
} from 'reactstrap';
import { Field, FieldArray, change } from 'redux-form';
import { connect } from 'react-redux';
import {  renderDropdownList, renderDropdownListFilter, renderCheckboxToggle, renderTextField } from '../../../../RenderInputs/renderInputs';
import Cope_Table from '../../../Table/DFs/Glass/Cope_Table';
import Ratio from 'lb-ratio';
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector,
} from '../../../../../selectors/doorPricing';

const required = value => (value ? undefined : 'Required');

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

class CopeDF extends Component {

  onChangeProfile = (p, ind) => {

    const { formState } = this.props;

    const part = formState.part_list[ind];

    if(part.dimensions){
      part.dimensions.forEach((info, index) => {
        if(info){
          this.props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].leftStile`,
              fraction(part.profile ? part.profile.MINIMUM_STILE_WIDTH : 0)
            )
          );

          this.props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].rightStile`,
              fraction(part.profile ? part.profile.MINIMUM_STILE_WIDTH : 0)
            )
          );

          if (info.full_frame) {
            this.props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].topRail`,
                fraction(part.profile ? (part.profile.MINIMUM_STILE_WIDTH) : 0)
              )
            );


            this.props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].bottomRail`,
                fraction(part.profile ? (part.profile.MINIMUM_STILE_WIDTH) : 0)
              )
            );
          } else {
            this.props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].topRail`,
                fraction(part.profile ? (part.profile.DF_Reduction) : 0)
              )
            );


            this.props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].bottomRail`,
                fraction(part.profile ? (part.profile.DF_Reduction) : 0)
              )
            );
          }
        } else {
          return null;
        }
      });
    } else {
      return null;
    }
  }

  onChangeWoodtype = (p, ind) => {
    const { formState } = this.props;
    const part = formState.part_list[ind];
    if(part.woodtype && part.woodtype.VERTICAL_GRAIN){
      this.props.dispatch(
        change(
          'DoorOrder',
          `${p}.VERTICAL_GRAIN`,
          true
        )
      );
    } else {
      this.props.dispatch(
        change(
          'DoorOrder',
          `${p}.VERTICAL_GRAIN`,
          false
        )
      );
    }
  }




  render() {
    const {
      part,
      woodtypes,
      edges,
      profiles,
      cope_designs,
      applied_moulds,
      isValid,
      index,
      part_list,
      formState,
      prices,

      subTotal,
      edit,
    } = this.props;
    return (
      <div>
        <Row>
          <Col xs="12" md='12' lg="4">
            <FormGroup>
              <Label htmlFor="woodtype">Woodtype</Label>
              <Field
                name={`${part}.woodtype`}
                component={renderDropdownListFilter}
                data={woodtypes}
                valueField="value"
                textField="NAME"
                onBlur={() => this.onChangeWoodtype(part, index)}
                validate={required}
                edit={edit}
              />
            </FormGroup>
          </Col>

          <Col xs="12"  md='12' lg='4'>
            <FormGroup>
              <Label htmlFor="design">Design</Label>
              <Field
                name={`${part}.cope_design`}
                component={renderDropdownListFilter}
                data={cope_designs}
                valueField="value"
                textField="NAME"
                validate={required}
                edit={edit}
              />
            </FormGroup>
          </Col>


          <Col xs="12" md='12' lg="4">
            <FormGroup>
              <Label htmlFor="mould">Edge</Label>
              <Field
                name={`${part}.edge`}
                component={renderDropdownListFilter}
                data={edges}
                valueField="value"
                textField="NAME"
                validate={required}
                edit={edit}
              />
            </FormGroup>
          </Col>

        </Row>
        <Row>

          <Col xs="12" md='12' lg="6">
            <FormGroup>
              <Label htmlFor="edge">Profile</Label>
              <Field
                name={`${part}.profile`}
                component={renderDropdownListFilter}
                data={profiles}
                valueField="value"
                textField="NAME"
                onBlur={() => this.onChangeProfile(part, index)}
                validate={required}
                edit={edit}
              />
            </FormGroup>
          </Col>



          <Col xs="12" md='12' lg="6">
            <FormGroup>
              <Label htmlFor="arches">Applied Profiles</Label>
              <Field
                name={`${part}.applied_profile`}
                component={renderDropdownListFilter}
                data={applied_moulds}
                valueField="value"
                textField="NAME"
                validate={required}
                edit={edit}
              />
            </FormGroup>
          </Col>

        </Row>

        <Row>
          <Col xs='12' sm='4' md='4' lg='4'>
            <FormGroup>
              <Label htmlFor="arches"><strong>Grain Direction</strong></Label>
              <Row>
                <Col>
                Horiz
                </Col>
                <Col>
                  <Field
                    name={`${part}.VERTICAL_GRAIN`}
                    component={renderCheckboxToggle}
                    edit={edit}
                  />
                </Col>
                <Col>
                Vertical
                </Col>
              </Row>

            </FormGroup>
          </Col>
        </Row>

        

        <Row className="mt-2">
          <Col xs="12" md='12' lg="4">
            <FormGroup>
              <strong>
                <Label for="jobNotes">Job Notes</Label>
                <Field
                  name={`${part}.notes`}
                  type="textarea"
                  component={renderTextField}
                  edit={edit}
                />
              </strong>
            </FormGroup>
          </Col>
        </Row>

        <div>
          <CardSubtitle className="mt-4 mb-1"><strong>Dimensions</strong></CardSubtitle>
          <div className="mt-1" />
          <FieldArray
            name={`${part}.dimensions`}
            component={Cope_Table}
            i={index}
            prices={prices}
            subTotal={subTotal}
            part_list={part_list}
            formState={formState}
            isValid={isValid}
            part={part}
            dispatch={this.props.dispatch}
            edit={edit}
          // updateSubmit={updateSubmit}
          />
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  woodtypes: state.part_list.woodtypes,
  edges: state.part_list.edges,
  finishes: state.part_list.finish,
  panels: state.part_list.panels,
  profiles: state.part_list.profiles,
  applied_moulds: state.part_list.applied_profiles,
  lites:state.part_list.lites,

  cope_designs: state.part_list.cope_designs,

  prices: linePriceSelector(state),
  itemPrice: itemPriceSelector(state),
  subTotal: subTotalSelector(state),
});


export default connect(
  mapStateToProps,
  null
)(CopeDF);
