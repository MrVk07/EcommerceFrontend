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

function CartScreen() {
    const navigate = useNavigate()
    const { state, dispatch: ctxDispatch } = useContext(Store)
    const {
        cart: { cartItems },
    } = state

    const updateCartHandler = async (item, quantity) => {
        const { data } = await axios.get(`https://ecommercebackend-9imt.onrender.com/api/products/${item._id}`)
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
                <title>Shopping Cart</title>
            </Helmet>
            <h1>Shopping Cart</h1>
            <Row>
                <Col md={8}>
                    {cartItems.length === 0 ? (
                        <MessageBox>
                            Cart is empty. <Link to="/">Go Shopping</Link>
                        </MessageBox>)
                        : (<ListGroup>
                            {cartItems.map((item) => (
                                <ListGroup.Item key={item._id} variant="danger">
                                    <Row className="align-items-center">
                                        <Col md={4}>
                                            <img src={item.image} alt={item.name} className="img-fluid rounded img-thumbnail"></img>{' '}
                                            <Link to={`/product/${item.slug}`} style={{ textDecoration: 'none', color: "red" }}><b>{item.name}</b></Link>
                                        </Col>
                                        <Col md={3}>
                                            <Button variant="danger" onClick={() => updateCartHandler(item, item.quantity - 1)} disabled={item.quantity === 1}>
                                                <i className="fas fa-minus-circle"></i>
                                            </Button>{' '}
                                            <span><b>{item.quantity}</b></span>{' '}
                                            <Button variant="danger" onClick={() => updateCartHandler(item, item.quantity + 1)} disabled={item.quantity === item.countInStock}>
                                                <i className="fas fa-plus-circle"></i>
                                            </Button>
                                        </Col>
                                        <Col md={3}>${item.price}</Col>
                                        <Col md={2}>
                                            <Button variant="danger" onClick={() => removeItemHandler(item)} ><i className="fas fa-trash"></i></Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        )}
                </Col>
                <Col md={4}>
                    <Card style={{ backgroundColor: "#F8D7DA" }}>
                        <Card.Body >
                            <ListGroup variant="flush">
                                <ListGroup.Item variant='danger'>
                                    <h3>Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}items)
                                        :<b> ${cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}</b>
                                    </h3>
                                </ListGroup.Item>
                                <ListGroup.Item variant='danger'>
                                    <div className="d-grid">
                                        <Button onClick={checkoutHandler} type="button" variant="danger" disabled={cartItems.length === 0}>
                                            <b>Proceed to Checkout</b>
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default CartScreen