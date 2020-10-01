import { Box, Button, Typography, useTheme } from '@material-ui/core'
import { TramOutlined } from '@material-ui/icons';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useRef } from 'react'
import { useSetRecoilState } from 'recoil';
import { useRecoilValue } from 'recoil';
import { alertSnackbarState, loaderState } from '../recoil/atoms';
import { userState } from '../recoil/user/user.atoms';




export default function CheckoutForm({ clientSecret,orderId,handleSuccess }) {
    const user = useRecoilValue(userState);
    const setAlert = useSetRecoilState(alertSnackbarState);
    const setLoader = useSetRecoilState(loaderState);
    const stripre = useStripe();
    const elements = useElements();
    const formRef = useRef();
    const theme = useTheme();

    const element_option = {
        style: {
            base: {
                fontSize: '18px',
                color: theme.palette.text.secondary
            }
        },
        hidePostalCode: true
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripre || !elements) {
            setAlert({open: true,message: 'Failed to Intialize Payment',severity: 'error'})
            return;
        }
        const cardElement = elements.getElement(CardElement);
        setLoader(TramOutlined)
        const result = await stripre.confirmCardPayment(clientSecret, {
            payment_method: {
                type: 'card',
                card: cardElement,
                billing_details: {
                    name: user.name,
                    email: user.email
                }
            }
        });

        if(result.error){
            setAlert({open: true,message: 'Payment Failed',severity: 'error'})
        }else{
            handleSuccess()

        }
        setLoader(false);
    }

    return (
        <div>
            <form ref={formRef} onSubmit={handleSubmit}>
                <Box p={3}>
                    <Box mb={2}  minWidth={300}>
                        <Typography>Card Details</Typography>
                        <CardElement options={element_option} />
                    </Box>
                    {/* <Box mb={2}>
                        <label>Card Number</label>
                        <CardNumberElement options={element_option} />
                    </Box>
                    <Box mb={2}>
                        <label>Expire Date</label>
                        <CardExpiryElement options={element_option} />
                    </Box>
                    <Box mb={2}>
                        <label>Card cvc number</label>
                        <CardCvcElement options={element_option} />
                    </Box> */}
                    <Box>
                        <Button fullWidth onClick={() => formRef.current.requestSubmit()} variant="contained" color="primary">Confirm Order</Button>
                    </Box>
                </Box>
            </form>
        </div>
    )
}
