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
// import 'react-widgets/dist/css/react-widgets.css';
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
import ordinal from 'ordinal';
import FullFrameModal from '../../../../utils/Modal';

const required = (value) => (value ? undefined : 'Required');
const panelsCount = (value) => {
  return parseInt(value) > 0 ? undefined : 'Must be greater than 0';
};

const trim_val = (value) => (value.trim('') ? undefined : 'Required');

const fraction = (num) => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

const fractionToDecimal = (fraction) => {
  if (!fraction.includes('/')) {
    return parseFloat(fraction);
  }

  const [whole, frac] = fraction.split(' ');
  const [numerator, denominator] = frac.split('/').map(Number);

  const decimal = numerator / denominator;
  const wholeNumber = whole ? parseInt(whole, 10) : 0;
  const result = wholeNumber + decimal;

  return parseFloat(result.toFixed(4));
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
  role,
}) => {
  const [width, setWidth] = useState([]);
  const [height, setHeight] = useState([]);
  const [changeValue, setChangeValue] = useState(null);
  const [modal, setModal] = useState(false);
  const [warningType, setWarningType] = useState(null);
  const [preventItem, setPreventItem] = useState(null);
  const [fullFrameNote, setFullFrameNote] = useState(false);
  const [fullFrameIndex, setFullFrameIndex] = useState(null);
  const toggle = () => setModal(!modal);

  let design = formState?.part_list[i]?.design;

  const index = fields.length - 1;

  const defaultLeftStile = formState?.part_list[i]?.leftStile;
  const defaultRightStile = formState?.part_list[i]?.rightStile;
  const defaultTopRail = formState?.part_list[i]?.topRail;
  const defaultBottomRail = formState?.part_list[i]?.bottomRail;

  const topRailAdd = formState?.part_list[i]?.design?.TOP_RAIL_ADD;
  const bottomRailAdd = formState?.part_list[i]?.design?.BTM_RAIL_ADD;

  const construction = formState?.part_list[i]?.construction?.value;

  useEffect(() => {
    setWidth([]);
    setHeight([]);
    setChangeValue(null);
  }, [updateSubmit]);

  const part = formState?.part_list[i];
  const leftStile = part?.dimensions[index]?.leftStile;
  const rightStile = part?.dimensions[index]?.rightStile;

  const toggleFullFrameNote = () => setFullFrameNote(!fullFrameNote);

  const updateFullFrame = (e) => {
    const part = formState.part_list[i];

    const index = fullFrameIndex;

    let profile_width;
    let df_reduction;

    if (part.construction.value === 'Cope') {
      profile_width = part?.profile?.PROFILE_WIDTH;
      df_reduction = part?.profile?.DF_Reduction;
    }

    if (part.construction.value === 'MT') {
      profile_width = part?.design?.PROFILE_WIDTH;
      df_reduction = part?.design?.DF_REDUCTION;
    }

    if (part.construction.value === 'Miter') {
      profile_width = part?.design?.DF_FULL_FRAME;
      df_reduction = part?.design?.PROFILE_WIDTH;
    }

    if (e) {
      if (leftStile) {
        dispatch(
          change(
            'Order',
            `part_list[${i}].dimensions[${index}].notes`,
            'Full Frame'
          )
        );

        if (part.construction.value === 'Miter') {
          dispatch(
            change(
              'Order',
              `part_list[${i}].dimensions[${index}].topRail`,
              fraction(numQty(profile_width))
            )
          );

          dispatch(
            change(
              'Order',
              `part_list[${i}].dimensions[${index}].bottomRail`,
              fraction(numQty(profile_width))
            )
          );

          dispatch(
            change(
              'Order',
              `part_list[${i}].dimensions[${index}].leftStile`,
              fraction(numQty(profile_width))
            )
          );
          dispatch(
            change(
              'Order',
              `part_list[${i}].dimensions[${index}].rightStile`,
              fraction(numQty(profile_width))
            )
          );
        } else {
          dispatch(
            change(
              'Order',
              `part_list[${i}].dimensions[${index}].topRail`,
              fraction(numQty(leftStile))
            )
          );

          dispatch(
            change(
              'Order',
              `part_list[${i}].dimensions[${index}].bottomRail`,
              fraction(numQty(leftStile))
            )
          );
        }
      } else {
        if (part.construction.value === 'Miter') {
          dispatch(
            change(
              'Order',
              `part_list[${i}].dimensions[${index}].notes`,
              'Full Frame'
            )
          );

          dispatch(
            change(
              'Order',
              `part_list[${i}].dimensions[${index}].leftStile`,
              fraction(profile_width)
            )
          );

          dispatch(
            change(
              'Order',
              `part_list[${i}].dimensions[${index}].rightStile`,
              fraction(profile_width)
            )
          );

          dispatch(
            change(
              'Order',
              `part_list[${i}].dimensions[${index}].topRail`,
              fraction(profile_width)
            )
          );

          dispatch(
            change(
              'Order',
              `part_list[${i}].dimensions[${index}].bottomRail`,
              fraction(profile_width)
            )
          );
        } else {
          dispatch(
            change(
              'Order',
              `part_list[${i}].dimensions[${index}].notes`,
              'Full Frame'
            )
          );

          dispatch(
            change(
              'Order',
              `part_list[${i}].dimensions[${index}].topRail`,
              fraction(profile_width)
            )
          );

          dispatch(
            change(
              'Order',
              `part_list[${i}].dimensions[${index}].bottomRail`,
              fraction(profile_width)
            )
          );
        }
      }
    } else {
      dispatch(
        change('Order', `part_list[${i}].dimensions[${index}].notes`, '')
      );

      if (part.construction.value === 'Miter') {
        dispatch(
          change(
            'Order',
            `part_list[${i}].dimensions[${index}].leftStile`,
            fraction(df_reduction)
          )
        );
        dispatch(
          change(
            'Order',
            `part_list[${i}].dimensions[${index}].rightStile`,
            fraction(df_reduction)
          )
        );
        dispatch(
          change(
            'Order',
            `part_list[${i}].dimensions[${index}].topRail`,
            fraction(df_reduction)
          )
        );
        dispatch(
          change(
            'Order',
            `part_list[${i}].dimensions[${index}].bottomRail`,
            fraction(df_reduction)
          )
        );
      } else {
        dispatch(
          change(
            'Order',
            `part_list[${i}].dimensions[${index}].topRail`,
            fraction(df_reduction)
          )
        );
        dispatch(
          change(
            'Order',
            `part_list[${i}].dimensions[${index}].bottomRail`,
            fraction(df_reduction)
          )
        );
      }
    }
  };

  const addFullFrameNote = (e) => {
    updateFullFrame(e, index);
    toggleFullFrameNote();
    dispatch(
      change('Order', `part_list[${i}].dimensions[${index}].full_frame`, true)
    );
  };

  const w = (e, v, index) => {
    e.preventDefault();
    const part = formState.part_list[i];
    let newWidth = [...width];
    if (width[index]) {
      newWidth.splice(index, 1, v);
    } else {
      newWidth = [...newWidth, v];
    }

    if (
      numQty(v) >= 24 &&
      part?.orderType?.value !== 'DF' &&
      part?.orderType?.value !== 'One_Piece_DF' &&
      part?.orderType?.value !== 'Two_Piece_DF'
    ) {
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

    console.log({
      orderType:
        part?.orderType?.value !== 'DF' &&
        part?.orderType?.value !== 'One_Piece_DF' &&
        part?.orderType?.value !== 'Two_Piece_DF',
    });

    if (
      numQty(v) >= 48 &&
      part?.orderType?.value !== 'DF' &&
      part?.orderType?.value !== 'One_Piece_DF' &&
      part?.orderType?.value !== 'Two_Piece_DF'
    ) {
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

    if (
      part?.orderType?.value === 'DF' ||
      part?.orderType?.value === 'One_Piece_DF' ||
      part?.orderType?.value === 'Two_Piece_DF'
    ) {
      const limit = 7;
      const heightLimit = numQty(v);
      if (heightLimit >= limit) {
        setFullFrameIndex(index);
        toggleFullFrameNote();
      }
    }

    setHeight(newHeight);
  };

  const clearNotes = (index, e) => {
    dispatch(change('Order', `part_list[${i}].dimensions[${index}].notes`, ''));
  };

  const twoHigh = (index, e, v) => {
    const part = formState.part_list[i];
    const dimensions = part?.dimensions[index];
    const { leftStile, rightStile, topRail, bottomRail, panelsH, panelsW } =
      dimensions || {};

    const value = e ? e.target.value : v;

    const currentNotes = part.dimensions[index]?.notes || '';

    const appendNotes = (newNote) => {
      // Split the currentNotes string into an array based on ' | '
      const notesArray = currentNotes.split(' | ').filter(Boolean); // The filter(Boolean) removes empty strings.

      // Find the index of an existing height note, if any.
      const existingNoteIndex = notesArray.findIndex((note) =>
        /\d+H/.test(note)
      );

      // If the newNote is just 'H' (i.e., the input was cleared), we'll simply remove it.
      if (newNote === 'H' && existingNoteIndex !== -1) {
        notesArray.splice(existingNoteIndex, 1);
      } else if (existingNoteIndex !== -1) {
        // If the note exists, replace it with the new value.
        notesArray[existingNoteIndex] = newNote;
      } else if (newNote !== 'H') {
        // If the note doesn't exist and it's not just 'H', append the new value.
        notesArray.push(newNote);
      }

      // Join the array back into a string using ' | '
      const updatedNotes = notesArray.join(' | ');

      dispatch(
        change(
          'Order',
          `part_list[${i}].dimensions[${index}].notes`,
          updatedNotes
        )
      );
    };

    const updateNotes = () => {
      const notes = `${value}H`;
      appendNotes(notes);
    };

    const updatePanelsHAndNotes = () => {
      dispatch(
        change('Order', `part_list[${i}].dimensions[${index}].panelsH`, value)
      );

      appendNotes(`${value}H`);
    };

    if (e) {
      updateNotes();
    } else {
      updatePanelsHAndNotes();
    }

    // Function for updating the horizontalMidRailSize
    const updateHorizontalMidRailSize = () => {
      let railWidth =
        part.construction?.value === 'Cope'
          ? part.profile?.Mid_Rail_Width || part.profile?.PROFILE_WIDTH
          : part.design?.Mid_Rail_Width || part.design?.PROFILE_WIDTH;

      let lipFactor = part.edge ? part.edge?.LIP_FACTOR / 2 : 0;

      // console.log({ default: numQty(defaultTopRail), railWidth: railWidth });
      // console.log({ lipFactor });
      // console.log({ dimensions: dimensions });

      if (
        fractionToDecimal(defaultTopRail) !== railWidth ||
        fractionToDecimal(defaultBottomRail) !== railWidth ||
        fractionToDecimal(defaultLeftStile) !== railWidth ||
        fractionToDecimal(defaultRightStile) !== railWidth
      ) {
        console.log('Here');
        const midRailSize = railWidth ? railWidth - lipFactor : 0;
        railWidth = midRailSize
          ? numQty(midRailSize)
          : numQty(defaultLeftStile);
        // lipFactor = 0;
      }

      const horizontalMidRailSize = railWidth ? railWidth + lipFactor : 0;

      // console.log({ horizontalMidRailSize });

      if (parseFloat(dimensions?.horizontalMidRailSize) < 1) {
        dispatch(
          change(
            'Order',
            `part_list[${i}].dimensions[${index}].horizontalMidRailSize`,
            fraction(horizontalMidRailSize)
          )
        );
      }
    };

    // Function for updating the glass checks
    const updateGlassChecks = () => {
      if (part.panel?.glass) {
        for (let j = 0; j < value; j++) {
          dispatch(
            change(
              'Order',
              `part_list[${i}].dimensions[${index}].glass_check_${j}`,
              true
            )
          );
        }
      }
    };

    if (value > 1) {
      updateHorizontalMidRailSize();
      updateGlassChecks();
    } else {
      dispatch(
        change(
          'Order',
          `part_list[${i}].dimensions[${index}].horizontalMidRailSize`,
          0
        )
      );

      dispatch(
        change(
          'Order',
          `part_list[${i}].dimensions[${index}].unevenCheck`,
          false
        )
      );

      dispatch(
        change(
          'Order',
          `part_list[${i}].dimensions[${index}].unequalMidRails`,
          false
        )
      );
    }
  };

  const getPanelNotes = (
    height,
    width,
    panelsH,
    value,
    defaultValues,
    stilesAndRails
  ) => {
    return `${value}W`;
  };

  const updatePanelNotes = (dispatch, i, index, notes) => {
    dispatch(
      change('Order', `part_list[${i}].dimensions[${index}].notes`, notes)
    );
  };

  const twoWide = (index, e, v) => {
    const part = formState.part_list[i];
    const dimensions = part?.dimensions[index];
    const currentNotes = dimensions?.notes || '';

    const defaultValues = {
      leftStile: defaultLeftStile,
      rightStile: defaultRightStile,
      topRail: defaultTopRail,
      bottomRail: defaultBottomRail,
    };

    const {
      leftStile = null,
      rightStile = null,
      topRail = null,
      bottomRail = null,
      panelsH,
      panelsW,
    } = dimensions || {};

    const stilesAndRails =
      leftStile !== defaultValues.leftStile ||
      rightStile !== defaultValues.rightStile ||
      topRail !== defaultValues.topRail ||
      bottomRail !== defaultValues.bottomRail;

    let value = e ? e.target.value : v;

    const appendNotes = (newNote) => {
      // Split the currentNotes string into an array based on ' | '
      const notesArray = currentNotes.split(' | ').filter(Boolean); // This filters out any empty strings.

      // Find the index of an existing width note, if any.
      const existingNoteIndex = notesArray.findIndex((note) =>
        /\d+W/.test(note)
      );

      // If the newNote is just 'W' (i.e., the input was cleared), we'll simply remove it.
      if (newNote === 'W' && existingNoteIndex !== -1) {
        notesArray.splice(existingNoteIndex, 1);
      } else if (existingNoteIndex !== -1) {
        // If the note exists, replace it with the new value.
        notesArray[existingNoteIndex] = newNote;
      } else if (newNote !== 'W') {
        // If the note doesn't exist and it's not just 'W', append the new value.
        notesArray.push(newNote);
      }

      // Join the array back into a string using ' | '
      const updatedNotes = notesArray.join(' | ');

      updatePanelNotes(dispatch, i, index, updatedNotes);
    };

    const notes = getPanelNotes(
      part.height,
      part.width,
      panelsH,
      value,
      defaultValues,
      stilesAndRails
    );

    appendNotes(notes);

    if (e) {
      dispatch(
        change('Order', `part_list[${i}].dimensions[${index}].panelsW`, value)
      );
    }

    if (value > 1) {
      let railWidth =
        part.construction?.value === 'Cope'
          ? part.profile?.Mid_Rail_Width || part.profile?.PROFILE_WIDTH
          : part.design?.Mid_Rail_Width || part.design?.PROFILE_WIDTH;

      let lipFactor = part.edge ? part.edge?.LIP_FACTOR / 2 : 0;

      console.log({ defaultBottomRail, railWidth });

      const changePanelsW = (panelsWValue) => {
        dispatch(
          change(
            'Order',
            `part_list[${i}].dimensions[${index}].panelsW`,
            panelsWValue
          )
        );
      };

      changePanelsW(value);

      if (
        fractionToDecimal(defaultTopRail) !== railWidth ||
        fractionToDecimal(defaultBottomRail) !== railWidth ||
        fractionToDecimal(defaultLeftStile) !== railWidth ||
        fractionToDecimal(defaultRightStile) !== railWidth
      ) {
        console.log('Here');
        const midRailSize = railWidth ? railWidth - lipFactor : 0;
        railWidth = midRailSize
          ? numQty(midRailSize)
          : numQty(defaultLeftStile);

        // lipFactor = 0;
      }

      const midRailSize = railWidth ? railWidth + lipFactor : 0;

      dispatch(
        change(
          'Order',
          `part_list[${i}].dimensions[${index}].verticalMidRailSize`,
          fraction(midRailSize || 0)
        )
      );
    } else {
      dispatch(
        change(
          'Order',
          `part_list[${i}].dimensions[${index}].verticalMidRailSize`,
          0
        )
      );
    }
  };

  const registerChange = (index, e, label) => {
    const value = e.target.value.trim(); // Trim spaces from the start and end.

    // Get the current notes value.
    const currentNotes =
      formState?.part_list[i]?.dimensions[index]?.notes || '';

    // Format the new value to be appended.
    const formattedValue = value ? `${label}: ${value}"` : '';

    // This regex will match digit sequences, potential spaces, potential fractions, and potential quotes.
    const existingNoteRegex = new RegExp(`${label}: [\\d\\s\\/]+"`);
    let updatedNotes;

    if (existingNoteRegex.test(currentNotes)) {
      // If the note exists and the new value is not empty, replace it.
      // Otherwise, remove the note.
      updatedNotes = value
        ? currentNotes.replace(existingNoteRegex, formattedValue)
        : currentNotes.replace(existingNoteRegex, '').replace(/ \|\s*$/, ''); // This regex removes trailing " |" if exists.
    } else if (currentNotes && value) {
      // If the note doesn't exist, and there are other notes, append the new value.
      updatedNotes = `${currentNotes} | ${formattedValue}`;
    } else {
      // If there are no other notes or the input value is empty, just set the new value.
      updatedNotes = formattedValue;
    }

    // Update the state for the changeValue.
    setChangeValue(value);

    // Dispatch the change to update the notes field with the concatenated value.
    dispatch(
      change(
        'Order',
        `part_list[${i}].dimensions[${index}].notes`,
        updatedNotes.trim() // This ensures no leading or trailing spaces.
      )
    );
  };

  const changeFraming = (e, index) => {
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
    const panelsH = formState?.part_list[i]?.dimensions[index]?.panelsH;
    const panelsW = formState?.part_list[i]?.dimensions[index]?.panelsW;

    if (e.target.name === 'update_framing') {
      if (changeValue) {
        const newVal = fraction(numQty(changeValue));

        dispatch(
          change(
            'Order',
            `part_list[${i}].dimensions[${index}].leftStile`,
            fraction(numQty(changeValue))
          )
        );

        dispatch(
          change(
            'Order',
            `part_list[${i}].dimensions[${index}].rightStile`,
            fraction(numQty(changeValue))
          )
        );

        dispatch(
          change(
            'Order',
            `part_list[${i}].dimensions[${index}].topRail`,
            fraction(numQty(changeValue))
          )
        );

        dispatch(
          change(
            'Order',
            `part_list[${i}].dimensions[${index}].bottomRail`,
            fraction(numQty(changeValue))
          )
        );
      }
    }

    if (e.target.name === 'default_framing') {
      if (panelsH > 1 || panelsW > 1) {
        dispatch(
          change(
            'Order',
            `part_list[${i}].dimensions[${index}].notes`,
            `${panelsH}H ${panelsW}W`
          )
        );
      } else {
        if (height >= 48 || width >= 24) {
          dispatch(
            change(
              'Order',
              `part_list[${i}].dimensions[${index}].notes`,
              'SINGLE - NO GUARANTEE'
            )
          );
        } else {
          dispatch(
            change('Order', `part_list[${i}].dimensions[${index}].notes`, '')
          );
        }
      }

      dispatch(
        change(
          'Order',
          `part_list[${i}].dimensions[${index}].leftStile`,
          fraction(numQty(defaultLeftStile))
        )
      );

      dispatch(
        change(
          'Order',
          `part_list[${i}].dimensions[${index}].rightStile`,
          fraction(numQty(defaultRightStile))
        )
      );

      dispatch(
        change(
          'Order',
          `part_list[${i}].dimensions[${index}].topRail`,
          fraction(numQty(defaultTopRail))
        )
      );

      dispatch(
        change(
          'Order',
          `part_list[${i}].dimensions[${index}].bottomRail`,
          fraction(numQty(defaultBottomRail))
        )
      );
    }
  };

  const validateGlass = (i, index) => {
    dispatch(touch('Order', `part_list[${i}].dimensions[${index}].notes`));
    dispatch(touch('Order', `part_list[${i}].dimensions[${index}].width`));
    dispatch(touch('Order', `part_list[${i}].dimensions[${index}].height`));
    dispatch(startAsyncValidation('Order'));
  };

  const addFields = (i) => {
    const construction = formState?.part_list[i]?.construction?.value;
    // const profile = formState?.part_list[i]?.profile?.PROFILE_WIDTH;
    // const design = formState?.part_list[i]?.design?.PROFILE_WIDTH;

    if (fields.length >= 0) {
      dispatch(touch('Order', `part_list[${i}].dimensions[${index}].notes`));
      dispatch(touch('Order', `part_list[${i}].dimensions[${index}].width`));
      dispatch(touch('Order', `part_list[${i}].dimensions[${index}].height`));
    }

    dispatch(touch('Order', `part_list[${i}].woodtype`));
    dispatch(touch('Order', `part_list[${i}].design`));

    if (construction !== 'Miter') {
      dispatch(touch('Order', `part_list[${i}].edge`));
    }

    if (construction === 'Cope') {
      dispatch(touch('Order', `part_list[${i}].profile`));
    }

    dispatch(touch('Order', `part_list[${i}].applied_profile`));
    dispatch(touch('Order', `part_list[${i}].panel`));

    dispatch(touch('Order', `part_list[${i}].leftStile`));
    dispatch(touch('Order', `part_list[${i}].rightStile`));
    dispatch(touch('Order', `part_list[${i}].topRail`));
    dispatch(touch('Order', `part_list[${i}].bottomRail`));

    dispatch(startAsyncValidation('Order'));

    // const notes = [];

    // if (
    //   construction === 'Cope' ||
    //   (construction === 'MT' && part.design?.NAME?.includes('PRP 15')) ||
    //   part.design?.NAME?.includes('PRP15')
    // ) {
    //   if (
    //     defaultLeftStile !== formState?.part_list[i]?.profile?.PROFILE_WIDTH
    //   ) {
    //     console.log('here');
    //     notes.push(`LS: ${fraction(defaultLeftStile)}"`);
    //   }

    //   if (
    //     defaultRightStile !== formState?.part_list[i]?.profile?.PROFILE_WIDTH
    //   ) {
    //     console.log('here');
    //     notes.push(`RS: ${fraction(defaultRightStile)}"`);
    //   }

    //   if (defaultTopRail !== formState?.part_list[i]?.profile?.PROFILE_WIDTH) {
    //     console.log('here');
    //     notes.push(`TR: ${fraction(defaultTopRail)}"`);
    //   }

    //   if (
    //     defaultBottomRail !== formState?.part_list[i]?.profile?.PROFILE_WIDTH
    //   ) {
    //     console.log('here');
    //     notes.push(`BR: ${fraction(defaultBottomRail)}"`);
    //   }
    // } else {
    //   if (defaultLeftStile !== formState?.part_list[i]?.design?.PROFILE_WIDTH) {
    //     console.log('here');
    //     notes.push(`LS: ${fraction(defaultLeftStile)}"`);
    //   }

    //   if (
    //     defaultRightStile !== formState?.part_list[i]?.design?.PROFILE_WIDTH
    //   ) {
    //     console.log('here');
    //     notes.push(`RS: ${fraction(defaultRightStile)}"`);
    //   }

    //   if (defaultTopRail !== formState?.part_list[i]?.design?.PROFILE_WIDTH) {
    //     console.log('here');
    //     notes.push(`TR: ${fraction(defaultTopRail)}"`);
    //   }

    //   if (
    //     defaultBottomRail !== formState?.part_list[i]?.design?.PROFILE_WIDTH
    //   ) {
    //     console.log('here');
    //     notes.push(`BR: ${fraction(defaultBottomRail)}"`);
    //   }
    // }

    fields.push({
      qty: 1,
      panelsH: 1,
      panelsW: 1,
      leftStile: defaultLeftStile,
      rightStile: defaultRightStile,
      topRail: defaultTopRail,
      bottomRail: defaultBottomRail,
      horizontalMidRailSize: 0,
      verticalMidRailSize: 0,
      unevenSplitInput: '0',
      showBuilder: false,
      unevenCheck: false,
      unevenSplit: false,
      notes: '',
      glass_check_0: formState.part_list[i]?.panel?.glass ? true : false,
    });
  };

  const glass_note_check = (index) => {
    const obj_names = Object.entries(
      formState?.part_list[i]?.dimensions[index]
        ? formState?.part_list[i]?.dimensions[index]
        : []
    );

    const filter_obj = obj_names.filter((n) => n[0].includes('glass_check'));

    const check_if_glass = filter_obj
      .filter((n) => n[1])
      .map((k) => k.includes(true))
      .includes(true);

    return check_if_glass;
  };

  let itemNum = 0;

  const itemNumCounter = {
    ...formState,
    part_list: formState?.part_list?.map((i) => {
      return {
        ...i,
        dimensions: i?.dimensions?.map((j) => {
          itemNum += 1;
          return {
            ...j,
            item: itemNum,
          };
        }),
      };
    }),
  };

  const unEvenCheckReminder = async (e, index) => {
    const part = formState.part_list[i];
    if (
      parseInt(formState.part_list[i]?.dimensions[index]?.panelsH) > 2 &&
      parseInt(formState.part_list[i]?.dimensions[index]?.panelsW) === 1
    ) {
      await dispatch(
        change('Order', `part_list[${i}].dimensions[${index}].extraCost`, 100)
      );

      e.preventDefault();
    }
  };

  return (
    <div>
      {modal ? (
        <WarningModal
          formState={formState}
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
      <FullFrameModal
        toggle={toggleFullFrameNote}
        modal={fullFrameNote}
        message={
          'Based On Your Sizes, We Suggest Making The Framing Full Frame'
        }
        title={'Do you want a full frame?'}
        actionButton={'Update to Full Frame'}
        action={(e) => {
          addFullFrameNote(e);
        }}
      />
      {fields.map((table, index) => (
        <Fragment key={index}>
          <hr />
          <Row>
            <Col>
              <FormGroup>
                <Label htmlFor="panel">
                  <strong>
                    Line #{' '}
                    {itemNumCounter?.part_list[i]?.dimensions[index]?.item}
                  </strong>
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
                        formState.part_list[i]?.dimensions[index]?.width,
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
                        formState.part_list[i]?.dimensions[index]?.height,
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
                    validate={panelsCount}
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
                    validate={panelsCount}
                    onChange={(e) => twoWide(index, e)}
                  />
                </td>
                <td>
                  {prices[i] ? (
                    <Input
                      type="text"
                      className="form-control"
                      disabled={true}
                      placeholder={
                        '$' + prices[i][index]?.toFixed(2)
                          ? prices[i][index]?.toFixed(2)
                          : 0
                      }
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
                  {edit ? (
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
                    edit={
                      construction === 'Miter' && !design?.square ? false : edit
                    }
                    validate={required}
                    onChange={(e) => registerChange(index, e, 'TR')}
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
                    edit={
                      construction === 'Miter' && !design?.square ? false : edit
                    }
                    validate={required}
                    onChange={(e) => registerChange(index, e, 'BR')}
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
                    edit={
                      construction === 'Miter' && !design?.square ? false : edit
                    }
                    validate={required}
                    onChange={(e) => registerChange(index, e, 'LS')}
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
                    edit={
                      construction === 'Miter' && !design?.square ? false : edit
                    }
                    validate={required}
                    onChange={(e) => registerChange(index, e, 'RS')}
                  />
                </td>

                <td>
                  <strong>
                    <p>Hori. Mid Rail</p>
                  </strong>
                  {formState.part_list[i]?.dimensions[index]
                    ?.unequalMidRails ? (
                    Array.from(
                      Array(
                        parseInt(
                          formState.part_list[i]?.dimensions[index]?.panelsH
                        )
                          ? parseInt(
                              formState.part_list[i]?.dimensions[index]?.panelsH
                            )
                          : 0
                      ).keys()
                    )
                      .slice(1)
                      .map((i, index) => {
                        if (index === 0) {
                          return (
                            <Field
                              name={`${table}.horizontalMidRailSize`}
                              type="text"
                              component={renderNumber}
                              label="horizontalMidRail"
                              edit={edit}
                            />
                          );
                        } else {
                          return (
                            <div>
                              <p>
                                <strong>Hori. Mid Rail #{index + 1}</strong>
                              </p>
                              <Field
                                name={`${table}.horizontalMidRailSize${index}`}
                                type="text"
                                component={renderNumber}
                                label="horizontalMidRail"
                                edit={edit}
                              />
                            </div>
                          );
                        }
                      })
                  ) : (
                    <Field
                      name={`${table}.horizontalMidRailSize`}
                      type="text"
                      component={renderNumber}
                      label="horizontalMidRail"
                      edit={edit}
                    />
                  )}
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
                    edit={edit}
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

              {edit ? (
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
            <Col xl="1" lg="3" md="3" sm="3">
              <FormGroup>
                <strong>Show Builder</strong>
                <Field
                  name={`${table}.showBuilder`}
                  component={renderCheckboxToggle}
                  edit={true}
                />
              </FormGroup>
            </Col>

            {part?.orderType?.value === 'DF' ? (
              <Col xl="1" lg="3" md="3" sm="3">
                <FormGroup>
                  <strong>Full Frame</strong>
                  <Field
                    name={`${table}.full_frame`}
                    component={renderCheckboxToggle}
                    onChange={(e) => updateFullFrame(e, index)}
                    edit={edit}
                  />
                </FormGroup>
              </Col>
            ) : null}

            {(parseInt(formState.part_list[i]?.dimensions[index]?.panelsH) >
              1 &&
              parseInt(formState.part_list[i]?.dimensions[index]?.panelsW) ===
                1) ||
            (parseInt(formState.part_list[i]?.dimensions[index]?.panelsW) > 1 &&
              parseInt(formState.part_list[i]?.dimensions[index]?.panelsH) ===
                1) ? (
              <Col xl="1" lg="3" md="3" sm="3">
                <FormGroup>
                  <strong>Uneven Split</strong>
                  <Field
                    name={`${table}.unevenCheck`}
                    component={renderCheckboxToggle}
                    edit={edit}
                    onClick={(e) => unEvenCheckReminder(e, index)}
                  />
                </FormGroup>
              </Col>
            ) : null}

            {parseInt(formState.part_list[i]?.dimensions[index]?.panelsH) >
            1 ? (
              <Col xl="1" lg="3" md="3" sm="3">
                <FormGroup>
                  <strong>Full Mid Stile</strong>
                  <Field
                    name={`${table}.fullMidStile`}
                    component={renderCheckboxToggle}
                    edit={edit}
                    onClick={(e) => unEvenCheckReminder(e, index)}
                  />
                </FormGroup>
              </Col>
            ) : null}

            {parseInt(formState.part_list[i]?.dimensions[index]?.panelsH) >
            2 ? (
              <Col>
                <FormGroup>
                  <strong>Unequal Mid Rails</strong>
                  <Field
                    name={`${table}.unequalMidRails`}
                    component={renderCheckboxToggle}
                    edit={edit}
                  />
                </FormGroup>
              </Col>
            ) : null}
          </Row>

          <Row>
            <Col>
              {formState.part_list[i]?.dimensions[index]?.showBuilder ? (
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
                    parseInt(
                      formState.part_list[i]?.dimensions[index]?.panelsH
                    ) > 1 &&
                      parseInt(
                        formState.part_list[i]?.dimensions[index]?.panelsW
                      ) === 1
                      ? parseInt(
                          formState.part_list[i]?.dimensions[index]?.panelsH
                        )
                      : parseInt(
                          formState.part_list[i]?.dimensions[index]?.panelsW
                        ) > 1 &&
                        parseInt(
                          formState.part_list[i]?.dimensions[index]?.panelsH
                        ) === 1
                      ? parseInt(
                          formState.part_list[i]?.dimensions[index]?.panelsW
                        )
                      : 0
                  ).keys()
                )
                  .slice(1)
                  .map((_, p) => {
                    return (
                      <div>
                        <Col />
                        <Col>
                          <div
                            style={{ textAlign: 'center', marginTop: '10px' }}
                          >
                            <strong>Panel Opening {p + 1}</strong>
                            {p === 0 ? (
                              <p>
                                {parseInt(
                                  formState.part_list[i]?.dimensions[index]
                                    ?.panelsH
                                ) > 1 &&
                                parseInt(
                                  formState.part_list[i]?.dimensions[index]
                                    ?.panelsW
                                ) === 1
                                  ? 'From Top of Door to Top of Mullion'
                                  : parseInt(
                                      formState.part_list[i]?.dimensions[index]
                                        ?.panelsW
                                    ) > 1 &&
                                    parseInt(
                                      formState.part_list[i]?.dimensions[index]
                                        ?.panelsH
                                    ) === 1
                                  ? 'From Left of Door to Top of Mullion'
                                  : null}
                              </p>
                            ) : (
                              <p>
                                {parseInt(
                                  formState.part_list[i]?.dimensions[index]
                                    ?.panelsH
                                ) >
                                parseInt(
                                  formState.part_list[i]?.dimensions[index]
                                    ?.panelsW
                                ) ? (
                                  <p>
                                    From Top of Door <br /> to Top of{' '}
                                    {ordinal(p + 1)} Mid Rail
                                  </p>
                                ) : parseInt(
                                    formState.part_list[i]?.dimensions[index]
                                      ?.panelsH
                                  ) <
                                  parseInt(
                                    formState.part_list[i]?.dimensions[index]
                                      ?.panelsW
                                  ) ? (
                                  <p>
                                    From Left of Door <br /> to Top of{' '}
                                    {ordinal(p + 1)} Mid Rail
                                  </p>
                                ) : null}
                              </p>
                            )}
                          </div>

                          <Field
                            name={`${table}.unevenSplitInput${p}`}
                            component={renderNumber}
                            edit={edit}
                            validate={required}
                          />

                          <div
                            style={{ textAlign: 'center', marginTop: '0px' }}
                          >
                            <p>In Inches</p>
                          </div>
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
                formState.part_list[i]?.dimensions[index]?.panelsH || 0
                  ? Array(
                      parseInt(
                        formState.part_list[i]?.dimensions[index]?.panelsH || 0
                      )
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
                formState.part_list[i]?.dimensions[index]?.panelsH
                  ? Array(
                      parseInt(
                        formState.part_list[i]?.dimensions[index]?.panelsH
                      )
                    ).keys()
                  : 0
              ).map((l, k) => {
                return eval(
                  `formState.part_list[i]?.dimensions[index]?.glass_check_${k}`
                ) ? (
                  <Col lg="2">
                    <FormGroup>
                      <strong>Opening {k + 1} Options</strong>
                      <Field
                        name={`${table}.lite_${k}`}
                        component={renderDropdownList}
                        data={lites}
                        dataKey="value"
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
                  {parseInt(
                    formState.part_list[i]?.dimensions[index]?.panelsH
                  ) > 1 &&
                  parseInt(formState.part_list[i]?.dimensions[index]?.panelsH) <
                    3 &&
                  parseInt(
                    formState.part_list[i]?.dimensions[index]?.panelsW
                  ) === 1 ? null : (
                    <strong>Please Specify in Notes if Uneven</strong>
                  )}
                </Col>

                <Col lg="2">
                  {edit ? (
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
            <Col lg="4" />
            {role?.type === 'authenticated' ||
            role?.type === 'owner' ||
            role?.type === 'administrator' ||
            role?.type === 'management' ||
            role?.type === 'office' ? (
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
            ) : null}
          </Row>
          <br />
        </Fragment>
      ))}
      <Row>
        <Col>
          {edit ? (
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
  role: state?.users?.user?.role,
  formSyncErrors: getFormSyncErrors('Order')(state),
});

export default connect(mapStateToProps, null)(DoorTable);
