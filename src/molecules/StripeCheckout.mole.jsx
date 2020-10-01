import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import CheckoutForm from '../components/CheckoutForm.component';
import { useFetch } from '../customHooks';
import { alertSnackbarState } from '../recoil/atoms';
import { userCartState } from '../recoil/user/user.atoms';
import { updateOrder } from '../request/order.request';
import { checkoutRequest } from '../request/product.request';
import { catchAsync, checkStatus } from '../utils';
import Hide from './Hide.mole';


const stripe_promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

export default function StripeCheckout({ getData }) {

    const fetch = useFetch();
    const [clientSecret, setClientSecret] = useState(null);
    const orderIdRef = useRef(null);
    const setAlert = useSetRecoilState(alertSnackbarState);
    const setUserCart = useSetRecoilState(userCartState);
    const history = useHistory();


    useEffect(() => {
        catchAsync(async () => {
            const data = {
                ...getData(),
                paymentMethod: 'stripe',
            }


            const response = await fetch(checkoutRequest, data);
            if (checkStatus(response)) {
                setClientSecret(response.data.clientSecret)
                orderIdRef.current = response.data.orderId;
            }


        })();
    }, [])

    const handleSucces = async () => {
        const response = await fetch(() => updateOrder({ paymentStatus: 'paid' }, orderIdRef.current));

        if (checkStatus(response)) {
            setAlert({ open: true, message: 'Payment with Stripe Successful', severity: 'success' })
            history.push('/home')
            setUserCart([]);
        }
    }

    return (
        <Elements stripe={stripe_promise}>
            <Hide hide={!Boolean(orderIdRef.current) && !Boolean(clientSecret)}>
                <CheckoutForm handleSuccess={handleSucces} orderId={orderIdRef.current} clientSecret={clientSecret} />
            </Hide>
        </Elements>
    )
}
