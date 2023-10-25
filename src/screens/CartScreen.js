import React, { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import MessageBox from '../components/MessageBox'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup'
import { Store } from '../Store'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { resolveAPI } from '../config'

function CartScreen() {
    const navigate = useNavigate()
    const { state, dispatch: ctxDispatch } = useContext(Store)
    const {
        cart: { cartItems },
    } = state

    const updateCartHandler = async (item, quantity) => {
        const url = resolveAPI(`api/products/${item._id}`);
        const { data } = await axios.get(url);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity }
        })
    }

    const removeItemHandler = (item) => {
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item })
    }

    const checkoutHandler = () => {
        navigate('/signin?redirect=/shipping')
    }


    return (
        <div>
            <Helmet>
                <title>Cart</title>
            </Helmet>
            <h1 className='my-4 text-white'>Shopping Cart</h1>
            <Row>
                <Col md={8}>
                    {cartItems.length === 0 ? (
                        <MessageBox>
                            Cart is empty. <Link to="/" className='text-white'>Go Shopping</Link>
                        </MessageBox>)
                        : (<ListGroup>
                            {cartItems.map((item) => (
                                <ListGroup.Item key={item._id}>
                                    <Row className="align-items-center">
                                        <Col md={4}>
                                            <img src={item.image} alt={item.name} className="img-fluid rounded img-thumbnail border border-dark"></img>{' '}
                                            <Link to={`/product/${item.slug}`} style={{ textDecoration: 'none', color: "#EE4E34" }}><b>{item.name}</b></Link>
                                        </Col>
                                        <Col md={3} className=''>
                                            <Button style={{ backgroundColor: "#EE4E34", border: "black" }} onClick={() => updateCartHandler(item, item.quantity - 1)} disabled={item.quantity === 1}>
                                                <i className="fas fa-minus-circle"></i>
                                            </Button>{' '}
                                            <span><b>{item.quantity}</b></span>{' '}
                                            <Button style={{ backgroundColor: "#EE4E34", border: "black" }} onClick={() => updateCartHandler(item, item.quantity + 1)} disabled={item.quantity === item.countInStock}>
                                                <i className="fas fa-plus-circle"></i>
                                            </Button>
                                        </Col>
                                        <Col md={3}><strong>${item.price}</strong></Col>
                                        <Col md={2}>
                                            <Button style={{ backgroundColor: "#EE4E34", border: "black" }} onClick={() => removeItemHandler(item)} ><i className="fas fa-trash"></i></Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        )}
                </Col>
                <Col md={4}>
                    {/* <Card style={{ backgroundColor: "#F8D7DA" }}> */}
                    <Card.Body className='px-6' >
                        <ListGroup >
                            <ListGroup.Item >
                                <h3>Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}items)
                                    :<b> ${cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}</b>
                                </h3>
                            </ListGroup.Item>
                            <ListGroup.Item >
                                <div className="d-grid">
                                    <Button onClick={checkoutHandler} type="button" style={{ backgroundColor: "#EE4E34", border: "black" }} disabled={cartItems.length === 0}>
                                        <b>Proceed to Checkout</b>
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                    {/* </Card> */}
                </Col>
            </Row>
        </div>
    );
}

export default CartScreen