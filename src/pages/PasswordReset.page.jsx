import React from 'react'
import { useSetRecoilState } from 'recoil'
import { loaderState, alertSnackbarState } from '../recoil/atoms'
import { Box, TextField, Dialog, Typography, Button } from '@material-ui/core';
import { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useState } from 'react';
import { catchAsync, checkStatus } from '../utils';
import { resetPassword } from '../request/user.requset';
import { userState } from '../recoil/user/user.atoms';

export default function PasswordReset() {

    const setLoader = useSetRecoilState(loaderState);
    const setAlert = useSetRecoilState(alertSnackbarState);
    const setUser = useSetRecoilState(userState)
    const [passwordPrompt, setPasswordPrompt] = useState(false)
    const [password,setPassword] = useState(null);
    const [confirmPassword,setConfirmPassword] = useState(null);
    const { token } = useParams();
    const history  = useHistory()

    useEffect(() => {
        setLoader(true);
    });

    useEffect(() => {
        if (token) {
            console.log(token)
            setLoader(false);
            setPasswordPrompt(true)
        }
    }, [token]);


    const handlePassChange = catchAsync(async()=>{
        setLoader(true)
        const response = await resetPassword({password,confirmPassword},token);
        setLoader(false)
        if(checkStatus(response)){
            setAlert({open: true,message:'Password Changed Successfully',severity: 'success'})
            setUser(response.data.user)
            history.push('/home')
            
        }else{
            setAlert({open: true,message: response.data.message,severity: 'error',time: 8000})
            if(response.data.error.statusCode === 400){
                history.push('/home')
            }
        }

    })


    return (
        <Box>
            <Dialog open={passwordPrompt}>

                <Box m={4}>
                    <Typography variant="h5">
                        Give New Password
                    </Typography>
                    <Box mb={2} display="flex" flexDirection="column">
                        <TextField value={password} onChange={(e)=>setPassword(e.currentTarget.value)} label="Password" />
                        <TextField value={confirmPassword} onChange={(e)=>setConfirmPassword(e.currentTarget.value)} label="Confirm Password" />
                    </Box>
                    <Button onClick={handlePassChange} color="primary" fullWidth variant="contained">Confirm Change</Button>
                </Box>

            </Dialog>
        </Box>
    )
}
