import React, { Component } from 'react';
import ScriptTag from 'react-script-tag'
import { Row, Col } from 'reactstrap'

class Catalog extends Component {
    render() {
        return (
            <div>
                <Row>
                    <Col></Col>
                    <Col>
                        <a href="https://online.flippingbook.com/view/506269/" class="fbo-embed" data-fbo-id="506269" data-fbo-lightbox="yes" data-fbo-width="1080px" data-fbo-height="960px" data-fbo-version="1" style={{'max-width': '100%'}}>2020 Catalog</a>
                        <ScriptTag async defer src="https://online.flippingbook.com/EmbedScriptUrl.aspx?m=redir&hid=506269"></ScriptTag >     
                    </Col>
                    <Col></Col>
                </Row>

            </div>
        );
    }
}

export default Catalog;