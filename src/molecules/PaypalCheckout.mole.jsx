import { Box } from '@material-ui/core';
import React, { useRef } from 'react'
import { PayPalButton } from 'react-paypal-button-v2'
import { useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { useFetch } from '../customHooks';
import { alertSnackbarState } from '../recoil/atoms';
import { userCartState } from '../recoil/user/user.atoms';
import { updateOrder } from '../request/order.request';
import { paypalPaymentCapture } from '../request/other.request';
import { checkoutRequest } from '../request/product.request';
import { checkStatus } from '../utils';

export default function PaypalCheckout({ getData }) {

    const fetch = useFetch();
    const orderIdRef = useRef(null);
    const paypalOrderIdRef = useRef(null);
    const setAlert = useSetRecoilState(alertSnackbarState);
    const setUserCart = useSetRecoilState(userCartState);
    const history = useHistory();

    const handlePaypalPayment = async () => {

        const data = {
            ...getData(),
            paymentMethod: 'paypal'
        }
        const response = await fetch(checkoutRequest, data);
        orderIdRef.current = response.data.orderId;
        paypalOrderIdRef.current = response.data.paypalOrderId;

        return response.data.paypalOrderId;
    }

    const handleSucces = async () => {
        const capture = await fetch(paypalPaymentCapture, { orderID: paypalOrderIdRef.current });
        if (checkStatus(capture)) {
            const response = await fetch(() => updateOrder({ paymentStatus: 'paid' }, orderIdRef.current));

            if (checkStatus(response)) {
                setAlert({ open: true, message: 'Payment with PayPal Successful', severity: 'success' })
                history.push('/home')
                setUserCart([]);
            }
        }
    }

    return (
        <Box p={3}>
            <PayPalButton
                createOrder={handlePaypalPayment}
                onApprove={handleSucces}
            />
        </Box>
    )
}
