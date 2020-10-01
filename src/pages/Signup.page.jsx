import React from 'react'
import { Box, Paper, Typography, TextField, Button, makeStyles } from '@material-ui/core'
import { useState } from 'react';
import { createUser } from '../request/user.requset';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userState } from '../recoil/user/user.atoms';
import { Redirect } from 'react-router-dom';
import { checkStatus } from '../utils';
import { alertSnackbarState } from '../recoil/atoms';
import { useFetch } from '../customHooks';

const createStyles = makeStyles(() => ({
    fieldContainer: {
        '& > *': {
            marginBottom: 15
        }
    }
}));

export default function Signup() {
    const fetch = useFetch();
    const classes = createStyles()

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user, setUser] = useRecoilState(userState);
    const setAlertSnackbar = useSetRecoilState(alertSnackbarState);

    if (user) {
        setAlertSnackbar({ open: true, message: 'You are Already Have An Account', severity: 'info' })
        return <Redirect to="/home" />
    }


    const handleCreate = async () => {
        const name = `${firstName} ${lastName}`
        const newUser = { name, email, password, confirmPassword }
        const response = await fetch(createUser,newUser);
        if (checkStatus(response)) {
            setUser(response.data.user)
            setAlertSnackbar({open: true,message: 'User Created Successfully',severity: 'success'})
        }
    }

    return (
        <Box my={6}>
            <Typography variant="h4" gutterBottom align="center">Create an Account</Typography>
            <Box maxWidth={400} margin="auto">
                <Paper>
                    <Box p={4}>
                        <Typography variant="h5">Personal Information</Typography>
                        <Box className={classes.fieldContainer}>
                            <TextField value={firstName} onChange={e => setFirstName(e.currentTarget.value)} label="Enter First Name" required fullWidth />
                            <TextField value={lastName} onChange={e => setLastName(e.currentTarget.value)} label="Enter Last Name" fullWidth />
                            <TextField value={email} onChange={e => setEmail(e.currentTarget.value)} label="Email Address" required fullWidth />
                            <TextField value={password} onChange={e => setPassword(e.currentTarget.value)} label="Password" required fullWidth />
                            <TextField value={confirmPassword} onChange={e => setConfirmPassword(e.currentTarget.value)} label="Confirm Password" required fullWidth />
                        </Box>
                        <Box mt={3}>
                            <Button onClick={handleCreate} variant="outlined" color="primary">
                                Create Account
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}
