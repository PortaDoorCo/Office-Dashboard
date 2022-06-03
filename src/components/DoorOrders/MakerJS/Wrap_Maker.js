import { Blueprint } from 'svg-blueprint';
import makerjs from 'makerjs';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFormValues } from 'redux-form';
import Door from './Panel_Wrap';
import numQty from 'numeric-quantity';

const Maker = (props) => {
  const { i, index, formState } = props;

  const ref = useRef(null);
  const [id, setID] = useState('');
  const [bps, setBps] = useState(null);
  const [pathItem, setPathItem] = useState(null);
  // const [width, setWidth] = useState(0);

  let wrap_width = formState?.part_list[i]?.wrap_width
    ? numQty(formState?.part_list[i]?.wrap_width)
    : 0;

  let face_width = formState?.part_list[i]?.face_width
    ? numQty(formState?.part_list[i]?.face_width)
    : 0;

  let thickness = formState?.part_list[i]?.thickness?.thickness_values
    ? numQty(formState?.part_list[i]?.thickness?.thickness_values)
    : 0;

  let panel_thickness = formState?.part_list[i]?.panel?.Thickness
    ? numQty(formState?.part_list[i]?.panel?.Thickness)
    : 0;

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

    const door = new Door(wrap_width, face_width, thickness, panel_thickness);
    const path = makerjs.exporter.toSVGPathData(door, { origin: [0, 0] });
    setPathItem(bp.append('path', { d: path }));
    // bp.hide('grid');
    bp.hide('statusbar');
    bp.fit();
    //bp.redraw();
    setBps(bp);
  }, [wrap_width, face_width, thickness, panel_thickness]);

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
