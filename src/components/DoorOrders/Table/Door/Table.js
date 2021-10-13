import React, { useState, Fragment, useEffect } from 'react';
import {
  Table,
  Input,
  Row,
  Col,
  Button,
  FormGroup,
  Label,
  ButtonGroup,
} from 'reactstrap';
import 'semantic-ui-css/semantic.min.css';
import {
  Field,
  change,
  startAsyncValidation,
  touch,
  getFormSyncErrors,
} from 'redux-form';
import Ratio from 'lb-ratio';
import Maker from '../../MakerJS/Maker';
import 'react-widgets/dist/css/react-widgets.css';
import {
  renderField,
  renderNumber,
  renderInt,
  renderDropdownList,
  renderCheckboxToggle,
  renderPrice,
  renderTextField,
} from '../../../RenderInputs/renderInputs';
import RenderPriceHolder from '../../../RenderInputs/RenderPriceHolder';
import { connect } from 'react-redux';
import numQty from 'numeric-quantity';
import WarningModal from '../Warnings/Modal';
import currencyMask from '../../../../utils/currencyMask';

const required = (value) => (value ? undefined : 'Required');
const trim_val = (value) => (value.trim('') ? undefined : 'Required');

const fraction = (num) => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

const DoorTable = ({
  props,
  fields,
  formState,
  i,
  prices,
  subTotal,
  updateSubmit,
  edit,
  dispatch,
  addPrice,
  lites,
  formError,
  formSyncErrors,
}) => {
  const [width, setWidth] = useState([]);
  const [height, setHeight] = useState([]);
  const [changeValue, setChangeValue] = useState(null);
  const [modal, setModal] = useState(false);
  const [warningType, setWarningType] = useState(null);
  const toggle = () => setModal(!modal);

  const index = fields.length - 1;

  const leftStile =
    index >= 0 ? formState?.part_list[i]?.dimensions[index]?.leftStile : null;
  const rightStile =
    index >= 0
      ? formState?.part_list[i]?.dimensions[index]?.rightStile
      : null;
  const topRail =
    index >= 0 ? formState?.part_list[i]?.dimensions[index]?.topRail : null;
  const bottomRail =
    index >= 0
      ? formState?.part_list[i]?.dimensions[index]?.bottomRail
      : null;
  const defaultLeftStile = formState?.part_list[i]?.leftStile;
  const defaultRightStile = formState?.part_list[i]?.rightStile;
  const defaultTopRail = formState?.part_list[i]?.topRail;
  const defaultBottomRail = formState?.part_list[i]?.bottomRail;
  const panelsH = formState?.part_list[i]?.dimensions[index]?.panelsH;
  const panelsW = formState?.part_list[i]?.dimensions[index]?.panelsW;

  const topRailAdd = formState?.part_list[i]?.design?.TOP_RAIL_ADD;
  const bottomRailAdd = formState?.part_list[i]?.design?.BTM_RAIL_ADD;

  const construction = formState?.part_list[i]?.construction?.value;

  useEffect(() => {
    setWidth([]);
    setHeight([]);
    setChangeValue(null);
  }, [updateSubmit]);

  const w = (e, v, index) => {
    e.preventDefault();
    const part = formState.part_list[i];
    let newWidth = [...width];
    if (width[index]) {
      newWidth.splice(index, 1, v);
    } else {
      newWidth = [...newWidth, v];
    }

    if (numQty(v) >= 24) {
      setWarningType({
        value: v,
        index: index,
        i: i,
        part: part,
        tag: 'width',
        sub_tag: 'width_greater_than',
        title: 'Width Greater Than 24 Inches',
        message:
          'Your Width is Greater than 24 inches.  Do you want to add a panel? We cannot guarantee your products warranty if width is greater than 24 inches',
        action: 'Add Panel',
        deny: 'No Thanks',
      });
      toggle();
    }

    setWidth(newWidth);
  };

  const h = (e, v, index) => {
    e.preventDefault();
    const part = formState.part_list[i];
    let newHeight = [...height];
    if (height[index]) {
      newHeight.splice(index, 1, v);
    } else {
      newHeight = [...newHeight, v];
    }

    if (numQty(v) >= 48) {
      setWarningType({
        value: v,
        index: index,
        i: i,
        part: part,
        tag: 'height',
        sub_tag: 'height_greater_than',
        title: 'Height Greater Than 48 Inches',
        message:
          'Your Height is Greater than 48 inches.  Do you want to add a panel? We cannot guarantee your products warranty if height is greater than 48 inches',
        action: 'Add Panel',
        deny: 'No Thanks',
      });
      toggle();
    }
    setHeight(newHeight);
  };

  const clearNotes = (index, e) => {
    dispatch(
      change('DoorOrder', `part_list[${i}].dimensions[${index}].notes`, '')
    );
  };

  const twoHigh = (index, e, v) => {
    let value;
    const part = formState.part_list[i];


    if (e) {
      value = e.target.value;
      if (part.dimensions[index].notes !== '' && parseInt(e.target.value) > 1) {
        if (
          leftStile === defaultLeftStile ||
          rightStile === defaultRightStile ||
          topRail === defaultTopRail ||
          bottomRail === defaultBottomRail
        ) {
          if ((height >= 48 && value < 2) || (width >= 24 && panelsW < 2)) {
            dispatch(
              change(
                'DoorOrder',
                `part_list[${i}].dimensions[${index}].notes`,
                `${value}H ${panelsW}W \nSINGLE - NO GUARANTEE`
              )
            );
          } else {
            dispatch(
              change(
                'DoorOrder',
                `part_list[${i}].dimensions[${index}].notes`,
                `${value}H ${panelsW}W`
              )
            );
          }
        } else {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions[${index}].notes`,
              `${value}H ${panelsW}W \nLeft Stile: ${leftStile}" Right Stile: ${rightStile}" \nTop Rail: ${topRail}" Bottom Rail: ${bottomRail}"`
            )
          );
        }
      } else {
        if (
          leftStile === defaultLeftStile ||
          rightStile === defaultRightStile ||
          topRail === defaultTopRail ||
          bottomRail === defaultBottomRail
        ) {
          if ((height >= 48 && value < 2) || (width >= 24 && panelsW < 2)) {
            dispatch(
              change(
                'DoorOrder',
                `part_list[${i}].dimensions[${index}].notes`,
                'SINGLEW - NO GUARANTEE'
              )
            );
          } else {
            if (panelsW > 1) {
              dispatch(
                change(
                  'DoorOrder',
                  `part_list[${i}].dimensions[${index}].notes`,
                  `${value}H ${panelsW}W`
                )
              );
            } else {
              dispatch(
                change(
                  'DoorOrder',
                  `part_list[${i}].dimensions[${index}].notes`,
                  ''
                )
              );
            }
          }
        } else {
          if ((height >= 48 && value < 2) || (width >= 24 && panelsW < 2)) {
            dispatch(
              change(
                'DoorOrder',
                `part_list[${i}].dimensions[${index}].notes`,
                `${value}H ${panelsW}W \nLeft Stile: ${leftStile}" Right Stile: ${rightStile}" \nTop Rail: ${topRail}" Bottom Rail: ${bottomRail}"`
              )
            );
          } else {
            dispatch(
              change(
                'DoorOrder',
                `part_list[${i}].dimensions[${index}].notes`,
                `${value}H ${panelsW}W \nLeft Stile: ${leftStile}" Right Stile: ${rightStile}" \nTop Rail: ${topRail}" Bottom Rail: ${bottomRail}" \nSINGLE - NO GUARANTEE`
              )
            );
          }
        }
      }
    } else {
      value = v;
      if (parseInt(panelsW) > 1 && parseInt(v) > 1) {
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].notes`,
            `${v}H ${panelsW}W`
          )
        );
        dispatch(
          change('DoorOrder', `part_list[${i}].dimensions[${index}].panelsH`, v)
        );
      } else {
        dispatch(
          change('DoorOrder', `part_list[${i}].dimensions[${index}].panelsH`, v)
        );
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].notes`,
            `${v}H`
          )
        );
      }
    }

    if (value > 1) {
      if (part.construction?.value === 'Cope') {
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].horizontalMidRailSize`,
            fraction(part.profile ? part.profile?.PROFILE_WIDTH : 0)
          )
        );
      } else {
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].horizontalMidRailSize`,
            fraction(part.design ? part.design?.PROFILE_WIDTH : 0)
          )
        );
      }

      if (part.panel?.NAME === 'Glass') {
        for (let j = 0; j < value; j++) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions[${index}].glass_check_${j}`,
              true
            )
          );
        }
      }
    } else {
      dispatch(
        change(
          'DoorOrder',
          `part_list[${i}].dimensions[${index}].horizontalMidRailSize`,
          0
        )
      );
    }
  };

  const twoWide = (index, e, v) => {
    const part = formState.part_list[i];

    let value;
    if (e) {
      value = e.target.value;
      if (
        parseInt(part.dimensions[index].panelsH) > 1 &&
        parseInt(e.target.value) > 1
      ) {
        if (
          leftStile === defaultLeftStile ||
          rightStile === defaultRightStile ||
          topRail === defaultTopRail ||
          bottomRail === defaultBottomRail
        ) {
          if ((height >= 48 && panelsH < 2) || (width >= 24 && value < 2)) {
            dispatch(
              change(
                'DoorOrder',
                `part_list[${i}].dimensions[${index}].notes`,
                `${panelsH}H ${value}W \nSINGLE - NO GUARANTEE`
              )
            );
          } else {
            dispatch(
              change(
                'DoorOrder',
                `part_list[${i}].dimensions[${index}].notes`,
                `${panelsH}H ${value}W`
              )
            );
          }
        } else {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions[${index}].notes`,
              `${panelsH}H ${value}W \nLeft Stile: ${leftStile}" Right Stile: ${rightStile}" \nTop Rail: ${topRail}" Bottom Rail: ${bottomRail}"`
            )
          );
        }
      } else {
        if (
          leftStile === defaultLeftStile ||
          rightStile === defaultRightStile ||
          topRail === defaultTopRail ||
          bottomRail === defaultBottomRail
        ) {
          if ((height >= 48 && panelsH < 2) || (width >= 24 && value < 2)) {
            dispatch(
              change(
                'DoorOrder',
                `part_list[${i}].dimensions[${index}].notes`,
                'SINGLE - NO GUARANTEE'
              )
            );
          } else {
            if (value > 1) {
              dispatch(
                change(
                  'DoorOrder',
                  `part_list[${i}].dimensions[${index}].notes`,
                  `${panelsH}H ${value}W`
                )
              );
            } else {
              dispatch(
                change(
                  'DoorOrder',
                  `part_list[${i}].dimensions[${index}].notes`,
                  ''
                )
              );
            }
          }
        } else {
          if ((height >= 48 && panelsH < 2) || (width >= 24 && value < 2)) {
            dispatch(
              change(
                'DoorOrder',
                `part_list[${i}].dimensions[${index}].notes`,
                `${panelsH}H ${value}W \nLeft Stile: ${leftStile}" Right Stile: ${rightStile}" \nTop Rail: ${topRail}" Bottom Rail: ${bottomRail}"`
              )
            );
          } else {
            dispatch(
              change(
                'DoorOrder',
                `part_list[${i}].dimensions[${index}].notes`,
                `${panelsH}H ${value}W \nLeft Stile: ${leftStile}" Right Stile: ${rightStile}" \nTop Rail: ${topRail}" Bottom Rail: ${bottomRail}" \nSINGLE - NO GUARANTEE`
              )
            );
          }
        }
      }
    } else {
      value = v;
      if (
        part.dimensions[index].notes !== '' &&
        parseInt(part.dimensions[index].panelsH) > 1 &&
        parseInt(v) > 1
      ) {
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].notes`,
            `${panelsH}H ${v}W`
          )
        );
        dispatch(
          change('DoorOrder', `part_list[${i}].dimensions[${index}].panelsW`, v)
        );
      } else {
        dispatch(
          change('DoorOrder', `part_list[${i}].dimensions[${index}].panelsW`, v)
        );
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].notes`,
            `${v}W`
          )
        );
      }
    }

    if (value > 1) {
      if (part.construction?.value === 'Cope') {
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].verticalMidRailSize`,
            fraction(part.profile ? part.profile?.PROFILE_WIDTH : 0)
          )
        );
      } else {
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].verticalMidRailSize`,
            fraction(part.profile ? part.design?.PROFILE_WIDTH : 0)
          )
        );
      }
    } else {
      dispatch(
        change(
          'DoorOrder',
          `part_list[${i}].dimensions[${index}].verticalMidRailSize`,
          0
        )
      );
    }
  };

  const onStileOrRailChange = (e, index) => {

    const value = e.target.value;
    console.log({ e });

    if ((height >= 48 && panelsH > 1) || (width >= 24 && panelsW > 1)) {
      if (e.target.name.includes('leftStile')) {
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].notes`,
            `${panelsH}H ${panelsW}W \nLeft Stile: ${value}" Right Stile: ${rightStile}" \nTop Rail: ${topRail}" Bottom Rail: ${bottomRail}"`
          )
        );
      }
      if (e.target.name.includes('rightStile')) {
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].notes`,
            `${panelsH}H ${panelsW}W \nLeft Stile: ${leftStile}" Right Stile: ${value}" \nTop Rail: ${topRail}" Bottom Rail: ${bottomRail}"`
          )
        );
      }
      if (e.target.name.includes('topRail')) {
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].notes`,
            `${panelsH}H ${panelsW}W \nLeft Stile: ${leftStile}" Right Stile: ${rightStile}" \nTop Rail: ${value}" Bottom Rail: ${bottomRail}"`
          )
        );
      }
      if (e.target.name.includes('bottomRail')) {
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].notes`,
            `${panelsH}H ${panelsW}W \nLeft Stile: ${leftStile}" Right Stile: ${rightStile}" \nTop Rail: ${topRail}" Bottom Rail: ${value}"`
          )
        );
      }
    } else {
      if ((height >= 48 && panelsH < 2) || (width >= 24 && panelsW < 2)) {
        if (e.target.name.includes('leftStile')) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions[${index}].notes`,
              `Left Stile: ${value}" Right Stile: ${rightStile}" \nTop Rail: ${topRail}" Bottom Rail: ${bottomRail}\nSINGLE - NO GUARANTEE"`
            )
          );
        }
        if (e.target.name.includes('rightStile')) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions[${index}].notes`,
              `Left Stile: ${leftStile}" Right Stile: ${value}" \nTop Rail: ${topRail}" Bottom Rail: ${bottomRail}\nSINGLE - NO GUARANTEE"`
            )
          );
        }
        if (e.target.name.includes('topRail')) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions[${index}].notes`,
              `Left Stile: ${leftStile}" Right Stile: ${rightStile}" \nTop Rail: ${value}" Bottom Rail: ${bottomRail}\nSINGLE - NO GUARANTEE"`
            )
          );
        }
        if (e.target.name.includes('bottomRail')) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions[${index}].notes`,
              `Left Stile: ${leftStile}" Right Stile: ${rightStile}" \nTop Rail: ${topRail}" Bottom Rail: ${value}\nSINGLE - NO GUARANTEE"`
            )
          );
        }
      } else {
        if (e.target.name.includes('leftStile')) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions[${index}].notes`,
              `Left Stile: ${value}" Right Stile: ${rightStile}" \nTop Rail: ${topRail}" Bottom Rail: ${bottomRail}"`
            )
          );
        }
        if (e.target.name.includes('rightStile')) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions[${index}].notes`,
              `Left Stile: ${leftStile}" Right Stile: ${value}" \nTop Rail: ${topRail}" Bottom Rail: ${bottomRail}"`
            )
          );
        }
        if (e.target.name.includes('topRail')) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions[${index}].notes`,
              `Left Stile: ${leftStile}" Right Stile: ${rightStile}" \nTop Rail: ${value}" Bottom Rail: ${bottomRail}"`
            )
          );
        }
        if (e.target.name.includes('bottomRail')) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions[${index}].notes`,
              `Left Stile: ${leftStile}" Right Stile: ${rightStile}" \nTop Rail: ${topRail}" Bottom Rail: ${value}"`
            )
          );
        }
      }
    }
  };

  const registerChange = (index, e) => {
    const value = e.target.value;
    setChangeValue(value);
  };

  const changeFraming = (e, index) => {

    console.log({ e });

    if (e.target.name === 'update_framing') {
      if (changeValue) {
        const newVal = fraction(numQty(changeValue));

        if (panelsH > 1 || panelsW > 1) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions[${index}].notes`,
              `${panelsH}H ${panelsW}W \nLeft Stile: ${newVal}" Right Stile: ${newVal}" \nTop Rail: ${newVal}" Bottom Rail: ${newVal}"`
            )
          );
        } else {
          if ((height >= 48 && panelsH < 2) || (width >= 24 && panelsW < 2)) {
            dispatch(
              change(
                'DoorOrder',
                `part_list[${i}].dimensions[${index}].notes`,
                `Left Stile: ${newVal}" Right Stile: ${newVal}" \nTop Rail: ${newVal}" Bottom Rail: ${newVal}" \nSINGLE - NO GUARANTEE`
              )
            );
          } else {
            dispatch(
              change(
                'DoorOrder',
                `part_list[${i}].dimensions[${index}].notes`,
                `Left Stile: ${newVal}" Right Stile: ${newVal}" \nTop Rail: ${newVal}" Bottom Rail: ${newVal}"`
              )
            );
          }
        }

        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].leftStile`,
            fraction(numQty(changeValue))
          )
        );

        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].rightStile`,
            fraction(numQty(changeValue))
          )
        );

        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].topRail`,
            fraction(numQty(changeValue))
          )
        );

        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].bottomRail`,
            fraction(numQty(changeValue))
          )
        );
      }
    }

    if (e.target.name === 'default_framing') {
      if (changeValue) {
        if (panelsH > 1 || panelsW > 1) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions[${index}].notes`,
              `${panelsH}H ${panelsW}W`
            )
          );
        } else {
          if (height >= 48 || width >= 24) {
            dispatch(
              change(
                'DoorOrder',
                `part_list[${i}].dimensions[${index}].notes`,
                'SINGLE - NO GUARANTEE'
              )
            );
          } else {
            dispatch(
              change(
                'DoorOrder',
                `part_list[${i}].dimensions[${index}].notes`,
                ''
              )
            );
          }
        }

        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].leftStile`,
            fraction(numQty(defaultLeftStile))
          )
        );

        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].rightStile`,
            fraction(numQty(defaultRightStile))
          )
        );

        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].topRail`,
            fraction(numQty(defaultTopRail))
          )
        );

        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].bottomRail`,
            fraction(numQty(defaultBottomRail))
          )
        );
      }
    }
  };

  const validateGlass = (i, index) => {
    dispatch(touch('DoorOrder', `part_list[${i}].dimensions[${index}].notes`));
    dispatch(touch('DoorOrder', `part_list[${i}].dimensions[${index}].width`));
    dispatch(touch('DoorOrder', `part_list[${i}].dimensions[${index}].height`));
    dispatch(startAsyncValidation('DoorOrder'));
  };

  const addFields = (i) => {


    const construction = formState?.part_list[i]?.construction?.value;
    // const profile = formState?.part_list[i]?.profile?.PROFILE_WIDTH;
    // const design = formState?.part_list[i]?.design?.PROFILE_WIDTH;


    if (fields.length >= 0) {
      dispatch(
        touch('DoorOrder', `part_list[${i}].dimensions[${index}].notes`)
      );
      dispatch(
        touch('DoorOrder', `part_list[${i}].dimensions[${index}].width`)
      );
      dispatch(
        touch('DoorOrder', `part_list[${i}].dimensions[${index}].height`)
      );
    }

    dispatch(touch('DoorOrder', `part_list[${i}].woodtype`));
    dispatch(touch('DoorOrder', `part_list[${i}].design`));

    if (construction !== 'Miter') {
      dispatch(touch('DoorOrder', `part_list[${i}].edge`));
    }

    if (construction === 'Cope') {
      dispatch(touch('DoorOrder', `part_list[${i}].profile`));
    }

    dispatch(touch('DoorOrder', `part_list[${i}].applied_profile`));
    dispatch(touch('DoorOrder', `part_list[${i}].panel`));
    
    dispatch(touch('DoorOrder', `part_list[${i}].leftStile`));
    dispatch(touch('DoorOrder', `part_list[${i}].rightStile`));
    dispatch(touch('DoorOrder', `part_list[${i}].topRail`));
    dispatch(touch('DoorOrder', `part_list[${i}].bottomRail`));


    dispatch(startAsyncValidation('DoorOrder'));

    fields.push({
      qty: 1,
      panelsH: 1,
      panelsW: 1,
      leftStile: leftStile ? leftStile : defaultLeftStile,
      rightStile: rightStile ? rightStile : defaultRightStile,
      topRail: topRail ? topRail : defaultTopRail,
      bottomRail: bottomRail ? bottomRail : defaultBottomRail,
      horizontalMidRailSize: 0,
      verticalMidRailSize: 0,
      unevenSplitInput: '0',
      showBuilder: false,
      unevenCheck: false,
      unevenSplit: false,
      notes:
        index >= 0 &&
        (leftStile !== defaultLeftStile ||
          rightStile !== defaultRightStile ||
          topRail !== defaultTopRail ||
          bottomRail !== defaultBottomRail)
          ? `Left Stile: ${leftStile}" Right Stile: ${rightStile}" \nTop Rail: ${topRail}" Bottom Rail: ${bottomRail}"`
          : '',
      glass_check_0:
        formState.part_list[i]?.panel?.NAME === 'Glass' ? true : false,
    });
  };

  const glass_note_check = (index) => {
    const obj_names = Object.entries(
      formState?.part_list[i]?.dimensions[index]
    );

    const filter_obj = obj_names.filter((n) => n[0].includes('glass_check'));

    const check_if_glass = filter_obj
      .filter((n) => n[1])
      .map((k) => k.includes(true))
      .includes(true);

    return check_if_glass;
  };

  return (
    <div>
      {modal ? (
        <WarningModal
          toggle={toggle}
          modal={modal}
          warningType={warningType}
          twoHigh={twoHigh}
          twoWide={twoWide}
          dispatch={dispatch}
          change={change}
          prices={prices}
        />
      ) : null}
      {fields.map((table, index) => (
        <Fragment key={index}>
          <hr />
          <Row>
            <Col>
              <FormGroup>
                <Label htmlFor="panel">
                  <strong>Line # {index + 1}</strong>
                </Label>
              </FormGroup>
            </Col>
            <Col xs="10" />
          </Row>
          <Table>
            <thead>
              <tr>
                <th>Qty</th>
                <th>Width</th>
                <th>Height</th>
                <th>Panel High</th>
                <th>Panels Wide</th>
                <th>Price</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Field
                    name={`${table}.qty`}
                    type="text"
                    component={renderInt}
                    label="qty"
                    validate={required}
                    edit={edit}
                  />
                </td>
                <td>
                  <Field
                    name={`${table}.width`}
                    type="text"
                    component={renderNumber}
                    onBlur={(e) =>
                      w(
                        e,
                        formState.part_list[i].dimensions[index].width,
                        index
                      )
                    }
                    label="width"
                    validate={[required]}
                    edit={edit}
                  />
                </td>

                <td>
                  <Field
                    name={`${table}.height`}
                    type="text"
                    component={renderNumber}
                    onBlur={(e) =>
                      h(
                        e,
                        formState.part_list[i].dimensions[index].height,
                        index
                      )
                    }
                    label="height"
                    validate={required}
                    edit={edit}
                  />
                </td>

                <td>
                  <Field
                    name={`${table}.panelsH`}
                    type="text"
                    component={renderNumber}
                    label="horizontalMidRail"
                    edit={edit}
                    onChange={(e) => twoHigh(index, e)}
                  />
                </td>
                <td>
                  <Field
                    name={`${table}.panelsW`}
                    type="text"
                    component={renderNumber}
                    label="verticalMidRail"
                    edit={edit}
                    onChange={(e) => twoWide(index, e)}
                  />
                </td>
                <td>
                  {prices[i] ? (
                    <Input
                      type="text"
                      className="form-control"
                      disabled={true}
                      placeholder={'$' + prices[i][index].toFixed(2) || 0}
                    />
                  ) : (
                    <Input
                      type="text"
                      className="form-control"
                      disabled={true}
                      placeholder={'$0.00'}
                    />
                  )}
                </td>
                <td>
                  {!edit ? (
                    <Button
                      color="danger"
                      className="btn-circle"
                      onClick={() => fields.remove(index)}
                    >
                      X
                    </Button>
                  ) : (
                    <div />
                  )}
                </td>
              </tr>

              <tr>
                <td>
                  <strong>
                    <p>Top Rail {topRailAdd > 0 ? '+ Arch' : null}</p>
                  </strong>
                  <Field
                    name={`${table}.topRail`}
                    type="text"
                    component={renderNumber}
                    label="topRail"
                    edit={construction === 'Miter' ? true : edit}
                    validate={required}
                    onChange={(e) => (
                      registerChange(index, e),
                      onStileOrRailChange(e, index)
                    )}
                  />
                </td>
                <td>
                  <strong>
                    <p>Bottom Rail {bottomRailAdd > 0 ? '+ Arch' : null}</p>
                  </strong>
                  <Field
                    name={`${table}.bottomRail`}
                    type="text"
                    component={renderNumber}
                    label="bottomRail"
                    edit={construction === 'Miter' ? true : edit}
                    validate={required}
                    onChange={(e) => (
                      registerChange(index, e),
                      onStileOrRailChange(e, index)
                    )}
                  />
                </td>

                <td>
                  <strong>
                    <p>Left Stile</p>
                  </strong>
                  <Field
                    name={`${table}.leftStile`}
                    type="text"
                    component={renderNumber}
                    label="leftStile"
                    edit={construction === 'Miter' ? true : edit}
                    validate={required}
                    onChange={(e) => (
                      registerChange(index, e),
                      onStileOrRailChange(e, index)
                    )}
                  />
                </td>
                <td>
                  <strong>
                    <p>Right Stile</p>
                  </strong>
                  <Field
                    name={`${table}.rightStile`}
                    type="text"
                    component={renderNumber}
                    label="rightStile"
                    edit={construction === 'Miter' ? true : edit}
                    validate={required}
                    onChange={(e) => (
                      registerChange(index, e),
                      onStileOrRailChange(e, index)
                    )}
                  />
                </td>

                <td>
                  <strong>
                    <p>Hori. Mid Rail</p>
                  </strong>
                  <Field
                    name={`${table}.horizontalMidRailSize`}
                    type="text"
                    component={renderNumber}
                    label="horizontalMidRail"
                    edit={construction === 'Miter' ? true : edit}
                  />
                </td>
                <td>
                  <strong>
                    <p>Vert. Mid Rail</p>
                  </strong>
                  <Field
                    name={`${table}.verticalMidRailSize`}
                    type="text"
                    component={renderNumber}
                    label="verticalMidRail"
                    edit={construction === 'Miter' ? true : edit}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <strong>
                    <p>Cab#</p>
                  </strong>
                  <Field
                    name={`${table}.cab_number`}
                    type="text"
                    component={renderField}
                    label="cab"
                    edit={edit}
                  />
                </td>
              </tr>

              {!edit ? (
                <tr>
                  <td>
                    <ButtonGroup vertical>
                      <Button
                        onClick={(e) => changeFraming(e, index)}
                        color="primary"
                        name="update_framing"
                      >
                        Update Framing
                      </Button>
                      <Button
                        onClick={(e) => changeFraming(e, index)}
                        color="primary"
                        name="default_framing"
                      >
                        Default Framing
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ) : null}

              <Row>
                <p className="ml-3">*Finish Stile/Rail Sizes*</p>
              </Row>
              <tr />
            </tbody>
          </Table>

          <Row>
            <Col lg="2">
              <FormGroup>
                <strong>Show Builder</strong>
                <Field
                  name={`${table}.showBuilder`}
                  component={renderCheckboxToggle}
                />
              </FormGroup>
            </Col>
            <Col>
              {parseInt(formState.part_list[i].dimensions[index].panelsH) > 1 &&
              parseInt(formState.part_list[i].dimensions[index].panelsW) ===
                1 ? (
                  <FormGroup>
                    <strong>Uneven Split</strong>
                    <Field
                      name={`${table}.unevenCheck`}
                      component={renderCheckboxToggle}
                      edit={edit}
                    />
                  </FormGroup>
                ) : null}
            </Col>
          </Row>

          <Row>
            <Col>
              {formState.part_list[i].dimensions[index].showBuilder ? (
                <div
                  id={`makerJS${index}`}
                  style={{ width: '100%', height: '300px' }}
                >
                  <Maker
                    width={width[index]}
                    height={height[index]}
                    i={i}
                    index={index}
                    style={{ width: '100%', height: '300px' }}
                  />
                </div>
              ) : (
                <div />
              )}
            </Col>
          </Row>

          {formState?.part_list[i]?.dimensions[index]?.unevenCheck ? (
            <div className="mb-3">
              <Row>
                {Array.from(
                  Array(
                    parseInt(formState.part_list[i]?.dimensions[index]?.panelsH)
                      ? parseInt(
                          formState.part_list[i]?.dimensions[index]?.panelsH
                      )
                      : 0
                  ).keys()
                )
                  .slice(1)
                  .map((i, index) => {
                    return (
                      <div>
                        <Col />
                        <Col>
                          <p style={{ textAlign: 'center', marginTop: '10px' }}>
                            <strong>Panel Opening {index + 1}</strong>
                          </p>
                          <Field
                            name={`${table}.unevenSplitInput${index}`}
                            component={renderField}
                            edit={edit}
                            validate={required}
                          />
                        </Col>
                        <Col />
                      </div>
                    );
                  })}
              </Row>
            </div>
          ) : null}

          <div>
            <Row>
              {Array.from(
                formState.part_list[i].dimensions[index].panelsH
                  ? Array(
                    parseInt(formState.part_list[i].dimensions[index].panelsH)
                  ).keys()
                  : 0
              ).map((i, k) => {
                return (
                  <Col lg="2">
                    <FormGroup>
                      <strong>Glass Opening {k + 1}</strong>
                      <Field
                        name={`${table}.glass_check_${k}`}
                        component={renderCheckboxToggle}
                        edit={edit}
                        onClick={() => validateGlass(i, index)}
                      />
                    </FormGroup>
                  </Col>
                );
              })}
            </Row>
            <Row>
              {Array.from(
                formState.part_list[i].dimensions[index].panelsH
                  ? Array(
                    parseInt(formState.part_list[i].dimensions[index].panelsH)
                  ).keys()
                  : 0
              ).map((l, k) => {
                return eval(
                  `formState.part_list[i].dimensions[index].glass_check_${k}`
                ) ? (
                    <Col lg="2">
                      <FormGroup>
                        <strong>Opening {k + 1} Options</strong>
                        <Field
                          name={`${table}.lite_${k}`}
                          component={renderDropdownList}
                          data={lites}
                          valueField="value"
                          textField="NAME"
                          validate={required}
                          edit={edit}
                        />
                      </FormGroup>
                    </Col>
                  ) : null;
              })}
            </Row>
          </div>

          <Row>
            <Col xs="5">
              <strong>Notes</strong>
              <Row>
                <Col lg="10">
                  <Field
                    name={`${table}.notes`}
                    type="textarea"
                    component={renderTextField}
                    edit={edit}
                    label="notes"
                    validate={
                      glass_note_check(index) ? [required, trim_val] : null
                    }
                  />
                </Col>
                
                <Col lg="2">
                  {!edit ? (
                    <Button
                      color="danger"
                      className="btn-circle"
                      onClick={(e) => clearNotes(index, e)}
                    >
                      X
                    </Button>
                  ) : null}
                </Col>
              </Row>
            </Col>
            <Col lg='4' />
            <Col xs="3">
              <strong>Extra Design Cost</strong>
              <Field
                name={`${table}.extraCost`}
                type="text"
                component={renderPrice}
                edit={edit}
                label="extraCost"
                {...currencyMask}
              />
            </Col>
          </Row>
          <br />
        </Fragment>
      ))}
      <Row>
        <Col>
          {!edit ? (
            <div>
              <Button
                color="primary"
                className="btn-circle add-item-tour"
                onClick={(e) => addFields(i)}
              >
                +
              </Button>
            </div>
          ) : (
            <div />
          )}
        </Col>
      </Row>

      <Row>
        <Col xs="9" />
        <Col xs="3">
          <strong>Sub Total: </strong>
          {subTotal[i] ? (
            <RenderPriceHolder input={subTotal[i].toFixed(2)} edit={true} />
          ) : (
            <RenderPriceHolder input={'0.00'} edit={true} />
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lites: state.part_list.lites,
  formSyncErrors: getFormSyncErrors('DoorOrder')(state),
});

export default connect(mapStateToProps, null)(DoorTable);
