import { Box, fade, IconButton, makeStyles, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import io from 'socket.io-client';
import ChatIcon from '@material-ui/icons/Chat';

const createStyles = makeStyles(theme=>({
    button: {
        // color: theme.palette.secondary.main
        backgroundColor: fade(theme.palette.grey[500],.3)
    }
}));

const socket = io(process.env.REACT_APP_BASE_URL.replace('/api/v1'));

socket.on('connect',()=>{
    console.log('Socket Connection Estqablished','----------------------------------------')
})

export default function Messenger() {
    
    const [messengerOpen,setMessengerOpen] = useState(false);
    const classes = createStyles();

    return (
        <Box position="fixed" top="80%" left="80%" >
            <IconButton className={classes.button} color="secondary" >
                <ChatIcon style={{fontSize: 50}} />
            </IconButton>
        </Box>
    )
}
