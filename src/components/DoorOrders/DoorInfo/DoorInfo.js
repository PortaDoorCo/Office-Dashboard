import React, { Component } from 'react';
import { Row, Col, CardSubtitle, Button, ButtonGroup } from 'reactstrap';
import DoorFilter from '../DoorInfo/Filter/Filter';
import Conditionals from './Conditionals';
import CopyModal from './CopyModal';
import thickness from './thickness';
import orderType from './orderType';
import construction from './construction';
import fraction from '../../../utils/fraction';

class DoorInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      designFilter: [],
      mouldFilter: [],
      test: [],
      modal: false,
      type: null,
    };
  }

  toggle = (type) => {
    this.setState({
      modal: !this.state.modal,
    });
    this.setState({
      type: type,
    });
  };

  copy = (type) => {
    const { fields, formState } = this.props;
    const lastItem = formState.part_list[formState?.part_list?.length - 1];
    switch (type) {
      case 'Door':
        fields.push({
          orderType: lastItem.orderType.value === 'One_Piece'
            ? orderType[3]
            : lastItem.orderType.value === 'Two_Piece'
              ? orderType[5]
              : orderType[0],
          construction: lastItem.construction,
          thickness: lastItem.thickness,
          woodtype: lastItem.woodtype,
          panel: lastItem.panel,
          edge: lastItem.edge,
          profile: lastItem.profile,
          leftStile: lastItem.leftStile ? fraction(lastItem.leftStile) : '2 5/16',
          rightStile: lastItem.rightStile ? fraction(lastItem.rightStile)  : '2 5/16',
          topRail: lastItem.topRail ? fraction(lastItem.topRail)  : '2 5/16',
          bottomRail: lastItem.bottomRail ? fraction(lastItem.bottomRail) : '2 5/16',
          applied_profile: lastItem.applied_profile,
          dimensions: [],
          addPrice: 0,
          notes: lastItem.notes ? lastItem.notes : '',
          files: [],
        });
        break;
      case 'DF':
        fields.push({
          orderType:
            lastItem.orderType.value === 'One_Piece'
              ? orderType[3]
              : lastItem.orderType.value === 'Two_Piece'
                ? orderType[5]
                : orderType[1],
          construction: lastItem.construction,
          thickness: lastItem.thickness,
          woodtype: lastItem.woodtype,
          panel: lastItem.panel,
          edge: lastItem.edge,
          profile: lastItem.profile,
          leftStile: lastItem.profile ? fraction(lastItem.profile.PROFILE_WIDTH) : '2 5/16',
          rightStile: lastItem.profile ? fraction(lastItem.profile.PROFILE_WIDTH)  : '2 5/16',
          topRail: lastItem.profile ? fraction(lastItem.profile.DF_Reduction)  : '1 1/2',
          bottomRail: lastItem.profile ? fraction(lastItem.profile.DF_Reduction) : '1 1/2',
          notes: `Left Stile: ${lastItem.profile ? fraction(lastItem.profile.PROFILE_WIDTH) : '2 5/16'}" Right Stile: ${lastItem.profile ? fraction(lastItem.profile.PROFILE_WIDTH)  : '2 5/16'}" \nTop Rail: ${lastItem.profile ? fraction(lastItem.profile.DF_Reduction)  : '1 1/2'}" Bottom Rail: ${lastItem.profile ? fraction(lastItem.profile.DF_Reduction) : '1 1/2'}"`,
          applied_profile: lastItem.applied_profile,
          dimensions: [],
          addPrice: 0,
          files: [],
        });
        break;
      default:
        switch (this.state.type) {
          case 'Door':
            fields.push({
              orderType: orderType[0],
              construction: construction[0],
              thickness: thickness[0],
              dimensions: [],
              addPrice: 0,
              files: [],
            });
            break;
          case 'DF':
            fields.push({
              orderType: orderType[1],
              construction: construction[0],
              thickness: thickness[0],
              dimensions: [],
              addPrice: 0,
              files: [],
            });
            break;
          default:
            fields.push({
              orderType: orderType[0],
              construction: construction[0],
              thickness: thickness[0],
              dimensions: [],
              addPrice: 0,
              files: [],
            });
        }
    }
    this.toggle();
  };

  render() {
    const { fields, formState, isValid, edit, updateSubmit } = this.props;

    return (
      <div>
        <div>
          <CopyModal
            modal={this.state.modal}
            toggle={this.toggle}
            copy={this.copy}
            type={this.state.type}
          />
        </div>
        
        {fields.map((part, index) => {
          return (
            <div id={`item-${index}`} key={index} >
              
              <hr />
              <CardSubtitle className="mt-4">
                
                <Row>
                  <Col lg="11">
                    <div>
                      <h2>
                        Item #{index + 1} -{' '}
                        {formState &&
                          formState.part_list &&
                          formState.part_list[index] &&
                          formState.part_list[index].orderType &&
                          formState.part_list[index].orderType.name}
                      </h2>
                    </div>
                  </Col>
                  <Col>
                    {!edit ? (
                      fields.length > 1 ? (
                        <Button
                          color="danger"
                          onClick={() => fields.remove(index)}
                        >
                          x
                        </Button>
                      ) : null
                    ) : null}
                  </Col>
                </Row>
              </CardSubtitle>

              <DoorFilter
                formState={formState}
                part={part}
                index={index}
                edit={edit}
                orderType={orderType}
                construction={construction}
                thickness={thickness}
                updateSubmit={updateSubmit}
              />

              <Conditionals
                formState={formState}
                part={part}
                index={index}
                edit={edit}
                isValid={isValid}
                updateSubmit={updateSubmit}
              />
            </div>
          );
        })}
    
        {!edit && formState?.part_list && formState?.part_list[0]?.dimensions.length > 0  ? (
          
          <div>
            <ButtonGroup>
              <Button
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  this.toggle('Door');
                  e.target.blur();
                }}
              >
                Add Door
              </Button>
              <Button
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  this.toggle('DF');
                  e.target.blur();
                }}
              >
                Add Drawer Front
              </Button>
            </ButtonGroup>
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default DoorInfo;
