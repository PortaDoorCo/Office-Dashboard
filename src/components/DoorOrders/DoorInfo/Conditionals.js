import React, { Component } from 'react';
import { connect } from 'react-redux';
import CopeDoor from './Cope/Door';
import MiterDoor from './Miter/Door';
import MTDoor from './MT/Door';
import GlassDoor from './Glass/Glass_Door';
import CopeDF from './Cope/DF';
import MiterDF from './Miter/DF';
import MT_DF from './MT/DF';
import FaceFrame from './Face_Frame/FaceFrame';
import SlabDoor from './Slab_Door/Slab_Door';
import SlabDF from './Slab_Door/Slab_DF';
import GlassDF from './Glass/Glass_DF';

import GlassCopeDoor from './Glass/Cope/Door';
import GlassCopeDF from './Glass/Cope/DF';

import GlassMTDoor from './Glass/MT/Door';
import GlassMTDF from './Glass/MT/DF';

import GlassMitreDoor from './Glass/Mitre/Door';
import GlassMitreDF from './Glass/Mitre/DF';





class Conditionals extends Component {

  render() {
    const {
      formState,
      part,
      index,
      isValid,
      part_list,
      edit,
      updateSubmit,
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
                one_piece={false}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'M':
              component = <MiterDoor
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={false}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'MT':
              component = <MTDoor
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={false}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'Glass':
              component = <GlassDoor
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={false}
                updateSubmit={updateSubmit}
              />;
              break;
            default:
              return;
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
                one_piece={false}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'M':
              component = <MiterDF
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={false}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'MT':
              component = <MT_DF
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={false}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'Glass':
              component = <GlassDF
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={false}
                updateSubmit={updateSubmit}
              />;
              break;
            default:
              return;
          }
          break;
        case 'Glass':
          switch (formState.part_list[index].construction.value) {
            case 'Cope':
              component = <GlassCopeDoor
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={false}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'M':
              component = <GlassMitreDoor
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={false}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'MT':
              component = <GlassMTDoor
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={false}
                updateSubmit={updateSubmit}
              />;
              break;
            default:
              return;
          }
          break;
        case 'Glass_DF':
          switch (formState.part_list[index].construction.value) {
            case 'Cope':
              component = <GlassCopeDF
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={false}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'M':
              component = <GlassMitreDF
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={false}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'MT':
              component = <GlassMTDF
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={false}
                updateSubmit={updateSubmit}
              />;
              break;
            default:
              return;
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
            one_piece={false}
            updateSubmit={updateSubmit}
          />;
          break;
        case 'One_Piece':
          switch (formState.part_list[index].construction.value) {
            case 'Cope':
              component = <CopeDoor
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={true}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'M':
              component = <MiterDoor
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={true}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'MT':
              component = <MTDoor
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={true}
                updateSubmit={updateSubmit}
              />;
              break;
            default:
              return;
          }
          break;
        case 'One_Piece_DF':
          switch (formState.part_list[index].construction.value) {
            case 'Cope':
              component = <CopeDF
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={true}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'M':
              component = <MiterDF
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={true}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'MT':
              component = <MT_DF
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={true}
                updateSubmit={updateSubmit}
              />;
              break;
            default:
              return;
          }
          break;
        case 'Two_Piece':
          switch (formState.part_list[index].construction.value) {
            case 'Cope':
              component = <CopeDoor
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={true}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'M':
              component = <MiterDoor
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={true}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'MT':
              component = <MTDoor
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={true}
                updateSubmit={updateSubmit}
              />;
              break;
            default:
              return;
          }
          break;
        case 'Two_Piece_DF':
          switch (formState.part_list[index].construction.value) {
            case 'Cope':
              component = <CopeDF
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={true}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'M':
              component = <MiterDF
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={true}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'MT':
              component = <MT_DF
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={true}
                updateSubmit={updateSubmit}
              />;
              break;
            default:
              return;
          }
          break;
        case 'MultiPanel':
          switch (formState.part_list[index].construction.value) {
            case 'Cope':
              component = <GlassCopeDoor
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={false}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'M':
              component = <GlassMitreDoor
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={false}
                updateSubmit={updateSubmit}
              />;
              break;
            case 'MT':
              component = <GlassMTDoor
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
                edit={edit}
                one_piece={false}
                updateSubmit={updateSubmit}
              />;
              break;
            default:
              return;
          }
          break;
        case 'Slab_Door':
          component = <SlabDoor
            part={part}
            index={index}
            isValid={isValid}
            part_list={part_list}
            formState={formState}
            edit={edit}
            one_piece={false}
            updateSubmit={updateSubmit}
          />;
          break;
        case 'Slab_DF':
          component = <SlabDF
            part={part}
            index={index}
            isValid={isValid}
            part_list={part_list}
            formState={formState}
            edit={edit}
            one_piece={false}
            updateSubmit={updateSubmit}
          />;
          break;
        default:
          component = <div />;
      }

      return (
        <div>
          {component}
        </div>
      );
    } else {
      return <div />;
    }
  }
}

const mapStateToProps = state => ({

});


export default connect(
  mapStateToProps,
  null
)(Conditionals);
