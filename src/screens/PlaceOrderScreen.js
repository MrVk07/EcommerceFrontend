import Axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';
import util from '../util';
import { resolveAPI } from '../config';

const reducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return { ...state, loading: true };
        case 'CREATE_SUCCESS':
            return { ...state, loading: false };
        case 'CREATE_FAIL':
            return { ...state, loading: false };
        default:
            return state;
    }
};

export default function PlaceOrderScreen() {
    const navigate = useNavigate();

    const [{ loading }, dispatch] = useReducer(reducer, {
        loading: false,
    });

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
    cart.itemsPrice = round2(
        cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    );
    cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
    cart.taxPrice = round2(0.15 * cart.itemsPrice);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

    const placeOrderHandler = async () => {
        try {
            dispatch({ type: 'CREATE_REQUEST' });
            const url = resolveAPI("api/orders");
            const { data } = await Axios.post(
                url,
                {
                    orderItems: cart.cartItems,
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.paymentMethod,
                    itemsPrice: cart.itemsPrice,
                    shippingPrice: cart.shippingPrice,
                    taxPrice: cart.taxPrice,
                    totalPrice: cart.totalPrice,
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );
            ctxDispatch({ type: 'CART_CLEAR' });
            dispatch({ type: 'CREATE_SUCCESS' });
            localStorage.removeItem('cartItems');
            navigate(`/order/${data.order._id}`);
        } catch (err) {
            dispatch({ type: 'CREATE_FAIL' });
            toast.error(util(err));
        }
    };

    useEffect(() => {
        if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart, navigate]);

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
            <Helmet>
                <title>Preview Order</title>
            </Helmet>
            <h1 className="my-3">Preview Order</h1>
            <Row>
                <Col md={8}>
                    <Card style={{ backgroundColor: "#F8D7DA" }}>
                        <Card.Body>
                            <Card.Title><b>Shipping</b></Card.Title>
                            <Card.Text>
                                <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                                <strong>Address: </strong> {cart.shippingAddress.address},
                                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                                {cart.shippingAddress.country}
                            </Card.Text>
                            <Link to="/shipping" style={{ textDecoration: 'none' }}>Edit</Link>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3" style={{ backgroundColor: "#F8D7DA" }}>
                        <Card.Body>
                            <Card.Title><b>Payment</b></Card.Title>
                            <Card.Text>
                                <strong>Method:</strong> {cart.paymentMethod}
                            </Card.Text>
                            <Link to="/payment" style={{ textDecoration: 'none' }}>Edit</Link>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3" style={{ backgroundColor: "#F8D7DA" }}>
                        <Card.Body>
                            <Card.Title><b>Items</b></Card.Title>
                            <ListGroup variant="flush">
                                {cart.cartItems.map((item) => (
                                    <ListGroup.Item key={item._id} style={{ backgroundColor: "#F8D7DA" }}>
                                        <Row className="align-items-center">
                                            <Col md={6}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="img-fluid rounded img-thumbnail"
                                                ></img>{' '}
                                                <Link to={`/product/${item.slug}`} style={{ textDecoration: 'none', color: "black" }}><b>{item.name}</b></Link>
                                            </Col>
                                            <Col md={3}>
                                                <span><b>{item.quantity}</b></span>
                                            </Col>
                                            <Col md={3}><b>${item.price}</b></Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <Link to="/cart" style={{ textDecoration: 'none' }}>Edit</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card style={{ backgroundColor: "#F8D7DA" }}>
                        <Card.Body>
                            <Card.Title className='text-center'><b>Order Summary</b></Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item variant='danger'>
                                    <Row>
                                        <Col><b>Items</b></Col>
                                        <Col>${cart.itemsPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item variant='danger'>
                                    <Row>
                                        <Col><b>Shipping</b></Col>
                                        <Col>${cart.shippingPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item variant='danger'>
                                    <Row>
                                        <Col><b>Tax</b></Col>
                                        <Col>${cart.taxPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item variant='danger'>
                                    <Row>
                                        <Col>
                                            <b>Order Total</b>
                                        </Col>
                                        <Col>
                                            ${cart.totalPrice.toFixed(2)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item variant='danger'>
                                    <div className="d-grid">
                                        <Button variant='danger' type="button" onClick={placeOrderHandler} disabled={cart.cartItems.length === 0}><b>Place Order</b></Button>
                                    </div>
                                    {loading && <LoadingBox></LoadingBox>}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div >
    );
}