import React, { Component } from "react";
import { connect } from 'react-redux';
import CopeDoor from './Cope/Door'
import MiterDoor from './Miter/Door'
import MTDoor from './MT/Door'
import GlassDoor from './Glass/Glass_Door'
import CopeDF from './Cope/DF'
import MiterDF from './Miter/DF'
import MT_DF from './MT/DF'
import FaceFrame from './Face_Frame/FaceFrame'
import One_Piece_Door from './One_Piece/One_Piece'
import Slab_Door from './Slab_Door/Slab_Door'
import Glass_DF from './Glass/Glass_DF'



class Conditionals extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      formState,
      part,
      index,
      isValid,
      part_list,
      edit
    } = this.props;

    let component;

    if (formState && formState.part_list) {
      switch (formState.part_list[index].orderType.value) {
        case 'Door':
          switch (formState.part_list[index].construction.value) {
            case 'Cope':
              component = <CopeDoor
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
              />
              break;
            case 'M':
              component = <MiterDoor
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
              />
              break;
            case 'MT':
              component = <MTDoor
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
              />
              break;
            case 'Glass':
              component = <GlassDoor
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
              />
              break;
          }
          break;
        case 'DF':
          switch (formState.part_list[index].construction.value) {
            case 'Cope':
              component = <CopeDF
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
              />
              break;
            case 'M':
              component = <MiterDF
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
              />
              break;
            case 'MT':
              component = <MT_DF
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
              />
              break;
            case 'Glass':
              component = <Glass_DF
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
              />
              break;
          }
          break;
        case 'Face_Frame':
          component = <FaceFrame
            part={part}
            index={index}
            isValid={isValid}
            part_list={part_list}
            formState={formState}
          edit={edit}
          />
          break;
        case 'One_Piece':
          component = <One_Piece_Door
            part={part}
            index={index}
            isValid={isValid}
            part_list={part_list}
            formState={formState}
            edit={edit}
          />
          break;
        case 'Slab_Door':
          component = <Slab_Door
            part={part}
            index={index}
            isValid={isValid}
            part_list={part_list}
            formState={formState}
            edit={edit}
          />
          break;
        default:
          component = <div />
      }

      return (
        <div>
          {component}
        </div>
      )
    } else {
      return <div />
    }
  }
}

const mapStateToProps = state => ({

});


export default connect(
  mapStateToProps,
  null
)(Conditionals);
