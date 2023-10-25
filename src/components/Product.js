import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Rating from './Rating';
import axios from 'axios';
import { Store } from '../Store';
import { resolveAPI } from '../config';

function Product(props) {
    const { state, dispatch: ctxDispatch } = useContext(Store)
    const {
        cart: { cartItems },
    } = state

    const addCartHandler = async (item) => {
        const existItem = cartItems.find((x) => x._id === props.product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const url = resolveAPI(`api/products/${item._id}`);
        const { data } = await axios.get(url);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return 0;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity }
        })
        return 1
    }

    return (
        <div>
            <Card style={{ backgroundColor: "#EEA47F" }} border="dark">
                <Link to={`/product/${props.product.slug}`}>
                    <img src={props.product.image} className="card-img-top" alt={props.product.name} />
                </Link>
                <Card.Body>
                    <Link to={`/product/${props.product.slug}`} style={{ textDecoration: 'none', color: "black" }}>
                        <Card.Title>{props.product.name}</Card.Title>
                    </Link>
                    <Rating rating={props.product.rating} numReviews={props.product.numReviews} />
                    <Card.Text style={{ color: "black" }}><strong>Price: {props.product.price}</strong></Card.Text>
                    {props.product.countInStock === ((cartItems.find((x) => x._id === props.product._id)) ? (cartItems.find((x) => x._id === props.product._id)).quantity : 1) ?
                        <Button variant="danger" disabled>Out of stock</Button> :
                        <Button className="" style={{ backgroundColor: "#EE4E34", border: "none" }} onClick={() => addCartHandler(props.product)} >Add to cart</Button>
                    }
                </Card.Body>
            </Card>
        </div >
    )
}

export default Product