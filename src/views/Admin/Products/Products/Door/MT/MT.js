import React, { Component, useState } from 'react';
import { Row, Col, Button } from 'reactstrap'




const Navigation = (props) => {
    console.log("prop nav ", props)
    const { actions, setCopePage } = props;

    return (
        <Col>
            <Button onClick={() => actions.setHome("index")}>Home</Button>
            <Button onClick={() => actions.back("index")}>Back</Button>
        </Col>
    )
}


const MT = (props) => {
    const [copePage, setCopePage] = useState("index");
    return (
        <div>
            <Row className="mb-2">
                <Navigation actions={props}   />
            </Row>
        </div>
    );

}

export default MT;