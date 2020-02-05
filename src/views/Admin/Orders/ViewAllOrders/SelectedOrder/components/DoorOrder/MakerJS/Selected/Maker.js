import { Blueprint } from 'svg-blueprint'
import makerjs from 'makerjs'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    getFormValues,
} from 'redux-form';
import Door from './Door'
import numQty from 'numeric-quantity';

const Maker = props => {

    const { i, index, formState, width, height, leftStile, rightStile, topRail, bottomRail, horizontalMidRailSize, verticalMidRailSize, panelsH, panelsW, unevenInput1,unevenInput2,unevenInput3,unevenInput4,unevenInput5, unevenCheck } = props;

    const ref = useRef(null);
    const [id, setID] = useState('');
    const [bps, setBps] = useState(null);
    const [pathItem, setPathItem] = useState(null);

    useEffect(() => {

        setID(ref.current.id)
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
                gridColor: "#000000",
                backgroundColor: "#FFFFFF",
                stroke: "#000000",
                axisOpacity: 0.0001,
            })
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
            0);
        const path = makerjs.exporter.toSVGPathData(door, { origin: [0, 0] });
        setPathItem(bp.append('path', { d: path }));
        bp.hide('grid')
        bp.hide('statusbar')
        bp.fit()
        //bp.redraw();
        setBps(bp);
    }, [props.height,
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
    ]);



    const onMouseOver = () => {
        disableBodyScroll(id);
    }

    const onMouseLeave = () => {
        clearAllBodyScrollLocks();
    }

    return (
        <span
            id={`selected-makerJS${props.index}`}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            ref={ref}
            style={{ width: '100%', height: '300px' }}
        />
    );

}

const mapStateToProps = state => ({
    formState: getFormValues('DoorOrder')(state),
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {

        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Maker);

