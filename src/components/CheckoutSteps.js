import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function CheckoutSteps(props) {
    return (
        <Row className="checkout-steps">
            <Col className={props.step1 ? 'active' : ''}><b style={{ color: "black" }}>Sign-In</b></Col>
            <Col className={props.step2 ? 'active' : ''}><b style={{ color: "black" }}>Shipping</b></Col>
            <Col className={props.step3 ? 'active' : ''}><b style={{ color: "black" }}>Payment</b></Col>
            <Col className={props.step4 ? 'active' : ''}><b style={{ color: "black" }}>Place Order</b></Col>
        </Row>
    );
}