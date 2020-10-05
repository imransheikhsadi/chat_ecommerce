import { Box, Container, Grid } from '@material-ui/core'
import React, { createRef, useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/user/user.atoms';
import { Redirect } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { alertSnackbarState, tokenState } from '../recoil/atoms';
import io from 'socket.io-client';
import ChatSidebar from '../components/ChatSidebar.component';
import ChatBox from '../components/ChatBox.component';






const socket = io(process.env.REACT_APP_BASE_URL.replace('/api/v1', ''));

export default function Chat() {

    const user = useRecoilValue(userState);
    const setAlert = useSetRecoilState(alertSnackbarState);
    const token = useRecoilValue(tokenState);


    useEffect(() => {
        socket.emit('addUser', token);
    }, [token])



    if (!user) {
        setAlert({ open: true, message: 'Please Login For Chat', severity: 'warning' })
        return <Redirect to="/signin" />
    }


    return (
        <Box >
            <Container maxWidth="md">
                <Box mt={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={5}>
                            <ChatSidebar socket={socket} />
                        </Grid>
                        <Grid item xs={7}>
                            <ChatBox socket={socket}/>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    )
}
