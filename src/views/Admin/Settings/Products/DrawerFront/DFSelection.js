import React, { Component, useState } from 'react';
import { Row, Col,Button } from 'reactstrap'
import ProductCard from '../../components/Card'
import Cope from './Cope/Cope'
import MT from './MT/MT'
import Mitre from './Mitre/Mitre'
import CopePNG from './img/cope.png'
import mt_PNG from './img/MT_Doors.png'
import mitre_PNG from './img/Mitre.png'

const Selection = (props) => {

    const [subPage, setSubPage] = useState("index");


    if (subPage === "index") {
        return (
            <div>
                <Row>
                    <Col>
                        <Button onClick={(e) => props.setHome("index")}>Home</Button>
                    </Col>
                </Row>

                <Row>
                    <Col xs='2' />
                    <Col>
                        <Row>
                            <Col>
                                <ProductCard title={"Cope and Stick"} img={CopePNG} setPage={setSubPage} page={"cope"} />
                            </Col>
                            <Col>
                                <ProductCard title={"MT Doors"} img={mt_PNG} setPage={setSubPage} page={"mt"} />
                            </Col>
                            <Col>
                                <ProductCard title={"Mitre Doors"} img={mitre_PNG} setPage={setSubPage} page={"m"} />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='2' />
                </Row>
            </div>

        );
    }

    if (subPage === "cope") {
        return <Cope setHome={props.setHome} back={setSubPage} />
    }

    if (subPage === "mt") {
        return <MT setHome={props.setHome} back={setSubPage} />
    }

    if (subPage === "m") {
        return <Mitre setHome={props.setHome} back={setSubPage} />
    }

    else {
        return (
            <div />
        )
    }



}

export default Selection;