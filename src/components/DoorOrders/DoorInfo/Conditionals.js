import React, { Component } from 'react';
import { connect } from 'react-redux';
import Door from './Door/Door';
import DF from './DF/DF';
import FaceFrame from './Face_Frame/FaceFrame';
import SlabDoor from './Slab_Door/Slab_Door';
import SlabDF from './Slab_Door/Slab_DF';
import WrappedDoor from './Door/Wrapped_Panel';

class Conditionals extends Component {
  render() {
    const { formState, part, index, isValid, part_list, edit, updateSubmit } =
      this.props;

    let component;

    if (formState && formState.part_list) {
      switch (formState.part_list[index]?.orderType?.value) {
        case 'Door':
          switch (formState.part_list[index].construction.value) {
            case 'Slab':
              component = (
                <SlabDoor
                  part={part}
                  index={index}
                  isValid={isValid}
                  part_list={part_list}
                  formState={formState}
                  edit={edit}
                  one_piece={true}
                  updateSubmit={updateSubmit}
                />
              );
              break;
            case 'Wrapped':
              component = (
                <WrappedDoor
                  part={part}
                  index={index}
                  isValid={isValid}
                  part_list={part_list}
                  formState={formState}
                  edit={edit}
                  one_piece={true}
                  updateSubmit={updateSubmit}
                />
              );
              break;
            default:
              component = (
                <Door
                  part={part}
                  index={index}
                  isValid={isValid}
                  part_list={part_list}
                  formState={formState}
                  edit={edit}
                  one_piece={false}
                  updateSubmit={updateSubmit}
                />
              );
              break;
          }
          break;
        case 'Custom':
          switch (formState.part_list[index].construction.value) {
            default:
              component = (
                <Door
                  part={part}
                  index={index}
                  isValid={isValid}
                  part_list={part_list}
                  formState={formState}
                  edit={edit}
                  one_piece={false}
                  updateSubmit={updateSubmit}
                />
              );
              break;
          }
          break;

        case 'DF':
          switch (formState.part_list[index].construction.value) {
            case 'Slab':
              component = (
                <SlabDF
                  part={part}
                  index={index}
                  isValid={isValid}
                  part_list={part_list}
                  formState={formState}
                  edit={edit}
                  one_piece={true}
                  updateSubmit={updateSubmit}
                />
              );
              break;
            default:
              component = (
                <DF
                  part={part}
                  index={index}
                  isValid={isValid}
                  part_list={part_list}
                  formState={formState}
                  edit={edit}
                  one_piece={false}
                  updateSubmit={updateSubmit}
                />
              );
              break;
          }
          break;

        case 'One_Piece':
          switch (formState.part_list[index].construction.value) {
            case 'Slab':
              component = (
                <SlabDoor
                  part={part}
                  index={index}
                  isValid={isValid}
                  part_list={part_list}
                  formState={formState}
                  edit={edit}
                  one_piece={true}
                  updateSubmit={updateSubmit}
                />
              );
              break;
            default:
              component = (
                <Door
                  part={part}
                  index={index}
                  isValid={isValid}
                  part_list={part_list}
                  formState={formState}
                  edit={edit}
                  one_piece={false}
                  updateSubmit={updateSubmit}
                />
              );
              break;
          }
          break;

        case 'Two_Piece':
          switch (formState.part_list[index].construction.value) {
            case 'Slab':
              component = (
                <SlabDoor
                  part={part}
                  index={index}
                  isValid={isValid}
                  part_list={part_list}
                  formState={formState}
                  edit={edit}
                  one_piece={true}
                  updateSubmit={updateSubmit}
                />
              );
              break;
            default:
              component = (
                <Door
                  part={part}
                  index={index}
                  isValid={isValid}
                  part_list={part_list}
                  formState={formState}
                  edit={edit}
                  one_piece={false}
                  updateSubmit={updateSubmit}
                />
              );
              break;
          }
          break;

        case 'Face_Frame':
          component = (
            <FaceFrame
              part={part}
              index={index}
              isValid={isValid}
              part_list={part_list}
              formState={formState}
              edit={edit}
              one_piece={false}
              updateSubmit={updateSubmit}
            />
          );
          break;

        case 'One_Piece_DF':
          component = (
            <DF
              part={part}
              index={index}
              isValid={isValid}
              part_list={part_list}
              formState={formState}
              edit={edit}
              one_piece={false}
              updateSubmit={updateSubmit}
            />
          );
          break;

        case 'Two_Piece_DF':
          component = (
            <DF
              part={part}
              index={index}
              isValid={isValid}
              part_list={part_list}
              formState={formState}
              edit={edit}
              one_piece={false}
              updateSubmit={updateSubmit}
            />
          );
          break;
        default:
          component = <div />;
      }

      return <div>{component}</div>;
    } else {
      return <div />;
    }
  }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, null)(Conditionals);
