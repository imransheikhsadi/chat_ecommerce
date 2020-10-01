import { Box, Divider, fade, IconButton, Input, makeStyles, Paper, Typography } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import ChatIcon from '@material-ui/icons/Chat';
import Hide from '../molecules/Hide.mole';
import SendIcon from '@material-ui/icons/Send';
import RemoveIcon from '@material-ui/icons/Remove';

const createStyles = makeStyles(theme => ({
    button: {
        // color: theme.palette.secondary.main
        backgroundColor: fade(theme.palette.grey[500], .3),
    },
    chatContainer: {
        position: 'fixed',
        right: '5%',
        bottom: '5%',
        zIndex: 10,
        minWidth: 300,
        textAlign: 'right'
    },
    me: {
        textAlign: "right",
        margin: '6px 4px',
        maxWidth: '80%',
        marginLeft: 'auto',
    },
    meText: {
        backgroundColor: fade(theme.palette.text.secondary, .2),
        padding: 10,
        borderRadius: 3,
        maxWidth: 'fit-content',
        marginLeft: 'auto'
    },
    others: {
        textAlign: "left",
        margin: '6px 4px',
        maxWidth: '80%',
        // marginLeft: 'auto',
    },
    othersText: {
        backgroundColor: fade(theme.palette.primary.main, .2),
        padding: 10,
        borderRadius: 3,
        maxWidth: 'fit-content',
        // marginLeft: 'auto'
    }
}));

const socket = io(process.env.REACT_APP_BASE_URL.replace('/api/v1',''));

export default function Messenger() {

    const [messengerOpen, setMessengerOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            message: 'Hi i am from granada and fedog so ahrt you gk',
            from: 'me'
        },
        {
            message: 'Hello granada and fedog so ahrt y',
            from: 'others'
        },
        {
            message: 'Hi i am from granada and fedog so ahrt you gk',
            from: 'me'
        },
        {
            message: 'Hello granada and fedog so ahrt y',
            from: 'others'
        },
        {
            message: 'Hi i am from granada and fedog so ahrt you gk',
            from: 'me'
        },
        {
            message: 'Hello granada and fedog so ahrt y',
            from: 'others'
        },
        {
            message: 'Hello granada and fedog so ahrt y',
            from: 'others'
        },
        {
            message: 'Hello granada and fedog so ahrt y',
            from: 'others'
        }
    ]);
    const classes = createStyles();
    const boxRef = useRef();
    const clientIdRef = useRef()

    useEffect(()=>{
        socket.on('message',(data)=>{
            console.log(data,'-----------------------------------')
            clientIdRef.current = data?.id;
            setMessages(pre=>[...pre,{message: data.message,from: 'others'}])
        });
    },[])

    const handleMessage = () => {
        if (message === '') return;
        setMessages([...messages, { message, from: 'me' }])
        setMessage('');
        console.log(socket)
        socket.emit('message',{message,id: clientIdRef.current});
    }

    useEffect(() => {
        if(!boxRef.current)return
        boxRef.current.scrollTop = boxRef.current.scrollHeight
    }, [messages, boxRef])

    return (
        <Box className={classes.chatContainer} >
            <Hide hide={messengerOpen}>
                <IconButton onClick={()=>setMessengerOpen(true)} className={classes.button} color="primary" >
                    <ChatIcon style={{ fontSize: 50 }} />
                </IconButton>
            </Hide>
            <Hide hide={!messengerOpen}>
                <Paper>
                    <Box p={2}>
                        <Box>
                            <Box alignItems="center" justifyContent="space-between" display="flex" >
                                <Typography gutterBottom variant="h6" color="textSecondary">Chat with Admin</Typography>
                                <IconButton onClick={() => setMessengerOpen(false)}>
                                    <RemoveIcon />
                                </IconButton>
                            </Box>
                            <Divider />
                        </Box>
                        <Box ref={boxRef} mt={2} maxHeight={300} overflow="hidden auto" minHeight={200}>
                            {messages.map((item, i) =>
                                <Box key={i} className={classes[item.from]}>
                                    <Typography className={classes[`${item.from}Text`]}>
                                        {item.message}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                        <Box>
                            <Input value={message} onChange={e => setMessage(e.target.value)} fullWidth placeholder="message" endAdornment={
                                <IconButton onClick={handleMessage} color="primary">
                                    <SendIcon />
                                </IconButton>
                            } />
                        </Box>
                    </Box>
                </Paper>
            </Hide>
        </Box>
    )
}
