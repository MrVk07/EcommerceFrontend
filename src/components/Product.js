import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Rating from './Rating';
import axios from 'axios';
import { Store } from '../Store';

function Product(props) {
    const { state, dispatch: ctxDispatch } = useContext(Store)
    const {
        cart: { cartItems },
    } = state

    const addCartHandler = async (item) => {
        const existItem = cartItems.find((x) => x._id === props.product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`https://ecommercebackend-9imt.onrender.com/api/products/${item._id}`)
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
            <Card bg="danger" border="dark">
                <Link to={`/product/${props.product.slug}`}>
                    <img src={props.product.image} className="card-img-top" alt={props.product.name} />
                </Link>
                <Card.Body>
                    <Link to={`/product/${props.product.slug}`} style={{ textDecoration: 'none' }}>
                        <Card.Title style={{ color: "yellow" }}>{props.product.name}</Card.Title>
                    </Link>
                    <Rating rating={props.product.rating} numReviews={props.product.numReviews} />
                    <Card.Text style={{ color: "black" }}>Price:<strong style={{ color: "yellow" }}>{props.product.price}</strong></Card.Text>
                    {props.product.countInStock === ((cartItems.find((x) => x._id === props.product._id)) ? (cartItems.find((x) => x._id === props.product._id)).quantity : 1) ?
                        <Button variant="danger" disabled>Out of stock</Button> :
                        <Button className="btn btn-warning" onClick={() => addCartHandler(props.product)} >Add to cart</Button>
                    }
                </Card.Body>
            </Card>
        </div >
    )
}

export default Product