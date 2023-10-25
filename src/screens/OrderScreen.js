import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import util from '../util';
import { resolveAPI } from '../config';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
}
export default function OrderScreen() {
    const { state } = useContext(Store);
    const { userInfo } = state;

    const params = useParams();
    const { id: orderId } = params;
    const navigate = useNavigate();

    const [{ loading, error, order }, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
    });

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const url = resolveAPI(`api/orders/${orderId}`);
                const { data } = await axios.get(url, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: util(err) });
            }
        };

        if (!userInfo) {
            return navigate('/login');
        }
        if (!order._id || (order._id && order._id !== orderId)) {
            fetchOrder();
        }
    }, [order, userInfo, orderId, navigate]);

    // let a = `.${product.image}`

    return loading ? (<LoadingBox></LoadingBox>)
        : error ? (<MessageBox variant="danger">{error}</MessageBox>)
            : (
                <div>
                    <Helmet>
                        <title>Order Details</title>
                    </Helmet>
                    {/* <h1 className="my-3">Order ID: {" "} {orderId}</h1> */}
                    <Row>
                        <Col md={8}>
                            <Card className="mb-3" style={{ backgroundColor: "#F8D7DA" }}>
                                <Card.Body>
                                    <Card.Title><b>Shipping</b></Card.Title>
                                    <Card.Text>
                                        <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                                        <strong>Address: </strong> {order.shippingAddress.address},
                                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                        ,{order.shippingAddress.country}
                                    </Card.Text>
                                    {order.isDelivered ? (
                                        <MessageBox variant="success">
                                            Delivered at {order.deliveredAt}
                                        </MessageBox>
                                    ) : (
                                        <MessageBox variant="primary">Not Delivered</MessageBox>
                                    )}
                                </Card.Body>
                            </Card>
                            <Card className="mb-3" style={{ backgroundColor: "#F8D7DA" }}>
                                <Card.Body>
                                    <Card.Title><b>Payment</b></Card.Title>
                                    <Card.Text>
                                        <strong>Method:</strong> {order.paymentMethod}
                                    </Card.Text>
                                    {order.isPaid ? (
                                        <MessageBox variant="success">
                                            Paid at {order.paidAt}
                                        </MessageBox>
                                    ) : (
                                        <MessageBox variant="danger">Not Paid</MessageBox>
                                    )}
                                </Card.Body>
                            </Card>

                            <Card className="mb-3" style={{ backgroundColor: "#F8D7DA" }}>
                                <Card.Body>
                                    <Card.Title><b>Items</b></Card.Title>
                                    <ListGroup variant="flush">
                                        {order.orderItems.map((item) => (
                                            <ListGroup.Item key={item._id} style={{ backgroundColor: "#F8D7DA" }}>
                                                <Row className="align-items-center">
                                                    <Col md={6}>
                                                        <img
                                                            src={`.${item.image}`}
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
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="mb-3" style={{ backgroundColor: "#F8D7DA" }}>
                                <Card.Body>
                                    <Card.Title className='text-center'><b>Order Summary</b></Card.Title>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item variant='danger'>
                                            <Row>
                                                <Col><b>Items</b></Col>
                                                <Col>${order.itemsPrice.toFixed(2)}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item variant='danger'>
                                            <Row>
                                                <Col><b>Shipping</b></Col>
                                                <Col>${order.shippingPrice.toFixed(2)}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item variant='danger'>
                                            <Row>
                                                <Col><b>Tax</b></Col>
                                                <Col>${order.taxPrice.toFixed(2)}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item variant='danger'>
                                            <Row>
                                                <Col>
                                                    <b>Order Total</b>
                                                </Col>
                                                <Col>
                                                    <strong>${order.totalPrice.toFixed(2)}</strong>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            );
}