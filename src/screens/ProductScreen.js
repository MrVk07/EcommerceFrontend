import React, { useContext, useEffect, useReducer } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import Rating from '../components/Rating'
import Card from 'react-bootstrap/esm/Card'
import Badge from 'react-bootstrap/esm/Badge'
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem'
import Button from 'react-bootstrap/esm/Button'
import { Helmet } from 'react-helmet-async'
import MessageBox from '../components/MessageBox'
import LoadingBox from '../components/LoadingBox'
import util from '../util'
import { Store } from '../Store'
import { resolveAPI } from '../config'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

function ProductScreen() {
  const navigate = useNavigate()
  const params = useParams()
  const { slug } = params

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    product: []
  })
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      try {
        const url = resolveAPI(`api/products/slug/${slug}`);
        const result = await axios.get(url);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: util(err) })
      }
    }
    fetchData()
  }, [slug])

  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { cart } = state

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const url = resolveAPI(`api/products/${product._id}`)
    const { data } = await axios.get(url);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity }
    })
    navigate('/cart')
  }

  return (
    loading ? (<LoadingBox />) :
      error ? (<MessageBox variant="danger">{error}</MessageBox>) :
        <div>
          <Helmet>
            <title>{product.name}</title>
          </Helmet>
          <Row>
            <Col md={6}>
              <img className='img-large' src={`.${product.image}`} alt={product.name} />
            </Col>
            <Col md={6}>
              <Card bg="danger">
                <Card.Body style={{ border: "1px solid black" }}>
                  <ListGroup variant="flush">
                    <ListGroup.Item variant='danger'>
                      <h1>{product.name}</h1>
                    </ListGroup.Item>
                    <ListGroup.Item variant='danger'>
                      <Row>
                        <Col>Review:</Col>
                        <Col><b><Rating rating={product.rating} numReviews={product.numReviews}></Rating></b></Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item variant="danger">
                      <Row>
                        <Col>Description:</Col>
                        <Col><b>{product.desc}</b></Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item variant="danger">
                      <Row>
                        <Col>Price:</Col>
                        <Col><b>${product.price}</b></Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item variant="danger">
                      <Row>
                        <Col>Status:</Col>
                        <Col>{product.countInStock !== ((cart.cartItems.find((x) => x._id === product._id)) ? (cart.cartItems.find((x) => x._id === product._id)).quantity : 1) ?
                          <Badge bg="success">In Stock</Badge> :
                          <Badge bg="danger">Unavailable</Badge>
                        }</Col>
                      </Row>
                    </ListGroup.Item>
                    {product.countInStock !== ((cart.cartItems.find((x) => x._id === product._id)) ? (cart.cartItems.find((x) => x._id === product._id)).quantity : 1) ? (
                      <ListGroupItem variant="danger">
                        <div className="d-grid">
                          <Button onClick={addToCartHandler} variant="danger"><b>Add to Cart</b></Button>
                        </div>
                      </ListGroupItem>) :
                      <Button variant='light' disabled>Out of stock</Button>
                    }

                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div >
  )
}

export default ProductScreen