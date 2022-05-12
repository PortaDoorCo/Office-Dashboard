import { Blueprint } from 'svg-blueprint';
import makerjs from 'makerjs';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFormValues } from 'redux-form';
import Door from './Door';
import numQty from 'numeric-quantity';

const Maker = (props) => {
  const { i, index, formState } = props;

  const ref = useRef(null);
  const [id, setID] = useState('');
  const [bps, setBps] = useState(null);
  const [pathItem, setPathItem] = useState(null);
  // const [width, setWidth] = useState(0);

  let width = formState?.part_list[i]?.dimensions[index]?.width
    ? numQty(formState?.part_list[i]?.dimensions[index]?.width)
    : 0;
  let height = formState?.part_list[i]?.dimensions[index]?.height
    ? numQty(formState?.part_list[i]?.dimensions[index]?.height)
    : 0;
  let leftStile = formState?.part_list[i]?.dimensions[index]?.leftStile
    ? numQty(formState?.part_list[i]?.dimensions[index]?.leftStile)
    : 0;
  let rightStile = formState?.part_list[i]?.dimensions[index]?.rightStile
    ? numQty(formState?.part_list[i]?.dimensions[index]?.rightStile)
    : 0;
  let topRail = formState?.part_list[i]?.dimensions[index]?.topRail
    ? numQty(formState?.part_list[i]?.dimensions[index]?.topRail)
    : 0;
  let bottomRail = formState?.part_list[i]?.dimensions[index]?.bottomRail
    ? numQty(formState?.part_list[i]?.dimensions[index]?.bottomRail)
    : 0;
  let panelsH = formState?.part_list[i]?.dimensions[index]?.panelsH
    ? parseInt(formState?.part_list[i]?.dimensions[index]?.panelsH)
    : 0;
  let panelsW = formState?.part_list[i]?.dimensions[index]?.panelsW
    ? parseInt(formState?.part_list[i]?.dimensions[index]?.panelsW)
    : 0;
  let horizontalMidRailSize = formState?.part_list[i]?.dimensions[index]
    ?.horizontalMidRailSize
    ? numQty(formState?.part_list[i]?.dimensions[index]?.horizontalMidRailSize)
    : 0;
  let verticalMidRailSize = formState?.part_list[i]?.dimensions[index]
    ?.verticalMidRailSize
    ? numQty(formState?.part_list[i]?.dimensions[index]?.verticalMidRailSize)
    : 0;
  let unevenInput1 = formState?.part_list[i]?.dimensions[index]
    ?.unevenSplitInput0
    ? numQty(formState?.part_list[i]?.dimensions[index]?.unevenSplitInput0)
    : 0;
  let unevenInput2 = formState?.part_list[i]?.dimensions[index]
    ?.unevenSplitInput1
    ? numQty(formState?.part_list[i]?.dimensions[index]?.unevenSplitInput1)
    : 0;
  let unevenInput3 = formState?.part_list[i]?.dimensions[index]
    ?.unevenSplitInput2
    ? numQty(formState?.part_list[i]?.dimensions[index]?.unevenSplitInput2)
    : 0;
  let unevenInput4 = formState?.part_list[i]?.dimensions[index]
    ?.unevenSplitInput3
    ? numQty(formState?.part_list[i]?.dimensions[index]?.unevenSplitInput3)
    : 0;
  let unevenInput5 = formState?.part_list[i]?.dimensions[index]
    ?.unevenSplitInput4
    ? numQty(formState?.part_list[i]?.dimensions[index]?.unevenSplitInput4)
    : 0;
  let unevenCheck = formState?.part_list[i]?.dimensions[index]?.unevenCheck
    ? formState?.part_list[i]?.dimensions[index]?.unevenCheck
    : false;

  let unequalMidRails = formState?.part_list[i]?.dimensions[index]
    ?.unequalMidRails
    ? formState?.part_list[i]?.dimensions[index]?.unequalMidRails
    : false;

  let horizontalMidRailSize1 = formState?.part_list[i]?.dimensions[index]
    ?.horizontalMidRailSize1
    ? numQty(formState?.part_list[i]?.dimensions[index]?.horizontalMidRailSize1)
    : 0;

  let horizontalMidRailSize2 = formState?.part_list[i]?.dimensions[index]
    ?.horizontalMidRailSize2
    ? numQty(formState?.part_list[i]?.dimensions[index]?.horizontalMidRailSize2)
    : 0;

  let horizontalMidRailSize3 = formState?.part_list[i]?.dimensions[index]
    ?.horizontalMidRailSize3
    ? numQty(formState?.part_list[i]?.dimensions[index]?.horizontalMidRailSize3)
    : 0;

  let horizontalMidRailSize4 = formState?.part_list[i]?.dimensions[index]
    ?.horizontalMidRailSize4
    ? numQty(formState?.part_list[i]?.dimensions[index]?.horizontalMidRailSize4)
    : 0;

  let horizontalMidRailSize5 = formState?.part_list[i]?.dimensions[index]
    ?.horizontalMidRailSize5
    ? numQty(formState?.part_list[i]?.dimensions[index]?.horizontalMidRailSize5)
    : 0;

  let horizontalMidRailSize6 = formState?.part_list[i]?.dimensions[index]
    ?.horizontalMidRailSize6
    ? numQty(formState?.part_list[i]?.dimensions[index]?.horizontalMidRailSize6)
    : 0;

  let horizontalMidRailSize7 = formState?.part_list[i]?.dimensions[index]
    ?.horizontalMidRailSize7
    ? numQty(formState?.part_list[i]?.dimensions[index]?.horizontalMidRailSize7)
    : 0;

  let horizontalMidRailSize8 = formState?.part_list[i]?.dimensions[index]
    ?.horizontalMidRailSize8
    ? numQty(formState?.part_list[i]?.dimensions[index]?.horizontalMidRailSize8)
    : 0;

  let horizontalMidRailSize9 = formState?.part_list[i]?.dimensions[index]
    ?.horizontalMidRailSize9
    ? numQty(formState?.part_list[i]?.dimensions[index]?.horizontalMidRailSize9)
    : 0;

  let horizontalMidRailSize10 = formState?.part_list[i]?.dimensions[index]
    ?.horizontalMidRailSize10
    ? numQty(
        formState?.part_list[i]?.dimensions[index]?.horizontalMidRailSize10
      )
    : 0;

  let fullMidStile = formState?.part_list[i]?.dimensions[index]?.fullMidStile
    ? formState?.part_list[i]?.dimensions[index]?.fullMidStile
    : false;

  useEffect(() => {
    setID(ref.current.id);
    let bp;
    if (bps) {
      bps.remove(pathItem);
      bp = bps;
    } else {
      bp = new Blueprint({
        parentElement: ref.current,
        className: `svg-${props.index}`,
        width: '100%',
        height: '100%',
        gridOpacity: 0.3,
        gridColor: '#000000',
        backgroundColor: '#FFFFFF',
        stroke: '#000000',
        axisOpacity: 0.0001,
      });
    }

    const door = new Door(
      width,
      height,
      leftStile,
      rightStile,
      topRail,
      bottomRail,
      panelsH,
      panelsW,
      horizontalMidRailSize,
      verticalMidRailSize,
      unevenCheck,
      unevenInput1,
      unevenInput2,
      unevenInput3,
      unevenInput4,
      unevenInput5,
      0,
      unequalMidRails,
      horizontalMidRailSize1,
      horizontalMidRailSize2,
      horizontalMidRailSize3,
      horizontalMidRailSize4,
      horizontalMidRailSize5,
      horizontalMidRailSize6,
      horizontalMidRailSize7,
      horizontalMidRailSize8,
      horizontalMidRailSize9,
      horizontalMidRailSize10,
      fullMidStile
    );
    const path = makerjs.exporter.toSVGPathData(door, { origin: [0, 0] });
    setPathItem(bp.append('path', { d: path }));
    bp.hide('grid');
    bp.hide('statusbar');
    bp.fit();
    //bp.redraw();
    setBps(bp);
  }, [
    props.height,
    props.width,
    leftStile,
    rightStile,
    topRail,
    bottomRail,
    panelsH,
    panelsW,
    horizontalMidRailSize,
    verticalMidRailSize,
    unevenInput1,
    unevenInput2,
    unevenInput3,
    unevenInput4,
    unevenInput5,
    unequalMidRails,
    horizontalMidRailSize1,
    horizontalMidRailSize2,
    horizontalMidRailSize3,
    horizontalMidRailSize4,
    horizontalMidRailSize5,
    horizontalMidRailSize6,
    horizontalMidRailSize7,
    horizontalMidRailSize8,
    horizontalMidRailSize9,
    horizontalMidRailSize10,
    fullMidStile,
  ]);

  const onMouseOver = () => {
    disableBodyScroll(id);
  };

  const onMouseLeave = () => {
    clearAllBodyScrollLocks();
  };

  return (
    <span
      id={`makerJS${props.index}`}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      ref={ref}
      style={{ width: '100%', height: '300px' }}
    />
  );
};

const mapStateToProps = (state) => ({
  formState: getFormValues('Order')(state),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Maker);
