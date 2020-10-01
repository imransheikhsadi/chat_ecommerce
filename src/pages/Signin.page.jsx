import React, { useEffect } from 'react'
import { Container, Paper, Typography, Button, Grid, Box, TextField, Link, Dialog, ClickAwayListener } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userState } from '../recoil/user/user.atoms';
import { useState } from 'react';
import { catchAsync, checkStatus } from '../utils';
import { userLogin, forgetPassword, signinWithGoogle, signinWithFacebook } from '../request/user.requset';
import { alertSnackbarState, loaderState } from '../recoil/atoms';
import { useRef } from 'react';
import MailIcon from '@material-ui/icons/Mail';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { ReactComponent as FbLoginLogo } from '../assets/LoginWithFaceBook.svg';
import { useFetch } from '../customHooks';

export default function Signin() {

    const fetch = useFetch();
    const history = useHistory();
    const [user, setUser] = useRecoilState(userState);
    const setAlertSnackbar = useSetRecoilState(alertSnackbarState);
    const setLoader = useSetRecoilState(loaderState);
    const [email, setEmail] = useState('imran@gmail.com');
    const [password, setPassword] = useState('12345678');
    const [emailPopup, setEmailPopup] = useState(false);
    const [resetEmail, setResetEmail] = useState(null);
    const [messagePopup, setMessagePopup] = useState(false);
    const formRef = useRef();
    const fbButtonRef = useRef();

    useEffect(() => {
        fbButtonRef.current = document.querySelector('.fb-login-button');
    }, [])


    if (user) {
        setAlertSnackbar({ open: true, message: 'You are Already Logged In', severity: 'info' })
        history.push('/');
    }



    const handleLogin = async () => {
        const response = await fetch(userLogin, { email, password })
        if (checkStatus(response)) {
            setUser(response.data.user);
            setAlertSnackbar({ open: true, message: 'Logged In Successfully', time: 4000, severity: 'success' })
        }
    };


    const forgetRequest = catchAsync(async () => {
        setAlertSnackbar({ open: true, message: 'Please wait for the response', severity: 'warning' })
        setMessagePopup(true)
        const response = await forgetPassword({ email: resetEmail });
        if (checkStatus(response)) {
            setAlertSnackbar({ open: true, message: response.data.message, severity: 'success', time: 12000 })
        } else {
            setMessagePopup(false);
            setAlertSnackbar({ open: true, message: response.data.message, severity: 'error' })
        }
    })

    // const googleSigninRequest = catchAsync
    const handleFromSubmit = (event) => {
        event.preventDefault();
        setEmailPopup(false);
        forgetRequest()
    }

    const handleGoogleSuccess = async ({ code }) => {
        if (code) {
            const response = await fetch(signinWithGoogle, { code })
            if (checkStatus(response)) {
                setUser(response.data.user)
                setAlertSnackbar({ open: true, message: 'Login Successful With Google', severity: 'success' })
            }
        } else {
            setAlertSnackbar({ open: true, message: 'Failed To Login', severity: 'error' })
        }
    }

    const handleFacebookSuccess = async (fbRes) => {
        const response = await fetch(signinWithFacebook, { userID: fbRes.userID, accessToken: fbRes.accessToken });
        if (checkStatus(response)) {
            setUser(response.data.user)
            setAlertSnackbar({ open: true, message: 'Login Successful With Facebook', severity: 'success' })
        }
    }

    const handleGoogleFailure = (err) => {
        console.log(err)
    }


    return (
        <Box my={6}>
            <Typography variant="h3" align="center" gutterBottom>Already Registered?</Typography>
            <Container>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper>
                            <Box p={4}>
                                <Typography variant="h5" gutterBottom>
                                    New Costomer
                                </Typography>
                                <Typography variant="subtitle2" color="textSecondary">
                                    By creating an account with our store, you will be able to move through the checkout process faster, store multiple shipping addresses, view and track your orders in your account and more.
                                </Typography>
                                <Box mt={3}>
                                    <Button onClick={() => history.push('/signup')} color="primary" variant="outlined">
                                        Create an Account
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper>
                            <Box pt={2} ml={2} display="flex" flexDirection={{xs: 'column', sm: 'row'}}  alignItems="center">
                                <Box >
                                    <GoogleLogin
                                        buttonText="Login With Google"
                                        clientId={process.env.REACT_APP_CLIENT_APT}
                                        onSuccess={handleGoogleSuccess}
                                        onFailure={handleGoogleFailure}
                                        cookiePolicy="single_host_origin"
                                        responseType="code"
                                        redirectUri="postmessage"
                                    />
                                </Box>

                                <Box>
                                    <Box display="none">
                                        <FacebookLogin
                                            appId={process.env.REACT_APP_FB_ID}
                                            callback={handleFacebookSuccess}
                                            cssClass="fb-login-button"
                                        />
                                    </Box>
                                    <Button onClick={() => console.log(fbButtonRef.current.click())}>
                                        <FbLoginLogo />
                                    </Button>
                                </Box>
                            </Box>
                            <Box p={4} pt={2}>
                                <Box>
                                    <Typography variant="h5" gutterBottom>
                                        Login
                                    </Typography>
                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                        If you have an account with us, please log in.
                                </Typography>
                                </Box>
                                <Box my={3} width="70%">
                                    <TextField value={email} onChange={e => setEmail(e.currentTarget.value)} label="Email Address" required fullWidth style={{ marginBottom: 10 }} />
                                    <TextField value={password} onChange={e => setPassword(e.currentTarget.value)} label="Password" required fullWidth />
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Box>
                                        <Button onClick={handleLogin} variant="outlined" color="primary">
                                            Login
                                        </Button>
                                    </Box>
                                </Box>
                                <Typography style={{ cursor: 'pointer' }} component="div" variant="subtitle2" color="priamry" align="right">
                                    <Link onClick={() => setEmailPopup(true)} >Forget Your Password?</Link>
                                </Typography>
                            </Box>

                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            <Dialog open={emailPopup}>
                <ClickAwayListener onClickAway={() => setEmailPopup(false)}>
                    <Box m={3}>
                        <Typography variant="h5">
                            Please Provide Your Email Address
                        </Typography>
                        <form ref={formRef} onSubmit={handleFromSubmit}>
                            <TextField value={resetEmail} onChange={(e) => setResetEmail(e.currentTarget.value)} required label="Email Address" fullWidth type="email" />
                        </form>
                        <Box mt={2}>
                            <Button fullWidth variant="contained" color="primary" onClick={() => formRef.current.requestSubmit()}>Submit</Button>
                        </Box>
                    </Box>
                </ClickAwayListener>
            </Dialog>
            <Dialog open={messagePopup}>
                <ClickAwayListener onClickAway={() => history.push('/')}>
                    <Box m={3}>
                        <Box textAlign="center">
                            <MailIcon style={{ fontSize: 100 }} />
                        </Box>
                        <Typography >A Mail will be sent to your account very soon.</Typography>
                        <Typography color="textSecondary">Please Do not forget to check the spam folder.</Typography>
                    </Box>
                </ClickAwayListener>
            </Dialog>
        </Box>
    )
}
