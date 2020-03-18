import React, { useState, Fragment, useEffect } from "react";
import {
    Label,
    Table,
    Input,
    Row,
    Col,
    Button
} from "reactstrap";

import 'semantic-ui-css/semantic.min.css';
import { Field } from "redux-form";
import { renderField, renderFieldDisabled } from '../RenderInputs/renderInputs'
import CopeDoor from './Cope/Door'
import MiterDoor from './Miter/Door'
import MTDoor from './MT/Door'

import CopeDF from './Cope/DF'

const Conditionals = ({ formState, part, index }) => {

    if(formState && formState.part_list){

        if (formState.part_list[index].orderType.value === "Door") {
            if (formState.part_list[index].construction.value === "Cope") {
                return (
                    <CopeDoor
                        part={part}
                        index={index}
                    />
                )
            }
        
            if(formState.part_list[index].construction.value === "M"){
                return (
                    <MiterDoor
                    part={part}
                    index={index}
                  />
                )
            }
        
            if(formState.part_list[index].construction.value === "MT"){
                return (
                    <MTDoor
                    part={part}
                    index={index}
                  />
                )
            }
        }

       
    } else {
        return null
    }
    

}

export default Conditionals;