import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import Axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import util from '../util'
import { resolveAPI } from '../config';

function SigninScreen() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { userInfo } = state
    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const url = resolveAPI("api/users/signin");
            const { data } = await Axios.post(url, {
                email,
                password,
            })
            ctxDispatch({ type: 'USER_SIGNIN', payload: data })
            localStorage.setItem('userInfo', JSON.stringify(data))
            navigate(redirect || '/')
        } catch (error) {
            toast.error(util(error))
        }
    }

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])


    return (
        <Container className="small-container" style={{ color: "black" }}>
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <h1 className="my-3">Sign In</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control onChange={(e) => setEmail(e.target.value)} type="email" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" required />
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit" variant='danger'><b>Sign In</b></Button>
                </div>
                <div className="mb-3">
                    New customer?{' '}
                    <Link to={`/signup?redirect=${redirect}`} className='text-white'>Create your account</Link>
                </div>
            </Form>
        </Container>
    );
}

export default SigninScreen