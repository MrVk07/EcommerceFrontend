import React, { useCallback, useEffect, useMemo, useReducer } from 'react'
import axios from 'axios';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { resolveAPI } from '../config';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true }
        case 'FETCH_SUCCESS':
            return { ...state, products: action.payload, loading: false }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        default:
            return state
    }
}

function HomeScreen() {
    const [{ loading, error, products }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        products: []
    })
    const fetchData = useCallback(async () => {
        dispatch({ type: 'FETCH_REQUEST' });
        try {
            const url = resolveAPI("api/products");
            const result = await axios.get(url);
            dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        } catch (err) {
            dispatch({ type: 'FETCH_FAIL', payload: err.message });
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const productElements = useMemo(() => (
        products.map((product) => (
            <Col sm={6} md={4} lg={3} className="mb-3" key={product.slug}>
                <Product product={product} />
            </Col>
        ))
    ), [products]);

    return (
        <div>
            <Helmet>
                <title>Ecommerce</title>
            </Helmet>
            <title>Featured Products</title>
            <div className="products">
                {loading ? (
                    <LoadingBox />
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                    <Row>{productElements}</Row>
                )}
            </div>
        </div>
    )
}

export default HomeScreen