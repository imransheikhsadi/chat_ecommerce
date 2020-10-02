import { AppBar, Avatar, Badge, Box, Container, Dialog, Divider, fade, Grid, IconButton, Input, List, ListItem, ListItemAvatar, ListItemText, makeStyles, Paper, Tab, Tabs, Typography, useTheme } from '@material-ui/core'
import React, { createRef, useEffect, useRef, useState } from 'react'
import SendIcon from '@material-ui/icons/Send';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/user/user.atoms';
import { useFetch } from '../customHooks';
import { getAllUser } from '../request/user.requset';
import { checkStatus } from '../utils';
import { Redirect, useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { alertSnackbarState, chatUsersState, messageFromState, tokenState } from '../recoil/atoms';
import io from 'socket.io-client';
import { green } from '@material-ui/core/colors';
import ChatSidebar from '../components/ChatSidebar.component';



const createStyles = makeStyles(theme => ({
    me: {
        // textAlign: 'right'
        margin: 15
    },
    meText: {
        backgroundColor: fade(theme.palette.primary.main, .3),
        padding: '5px 8px',
        borderRadius: 3,
        maxWidth: 'fit-content',
        marginLeft: 'auto'
    },
    others: {
        margin: 15
    },
    othersText: {
        backgroundColor: fade(theme.palette.grey[500], .3),
        padding: '5px 8px',
        borderRadius: 3,
        maxWidth: 'fit-content'
    }
}));


const allEmoji = ['👌', '👋', '👊', '👍', '😂', '😀', '😇', '😈', '😍', '😎', '💗', '🦁']
const socket = io(process.env.REACT_APP_BASE_URL.replace('/api/v1', ''));

export default function Chat() {

    const [messages, setMessages] = useState([]);
    const user = useRecoilValue(userState);
    const [message, setMessage] = useState('');
    const messageRef = useRef();
    const [emojiOpen, setEmojiOpen] = useState(false)
    const classes = createStyles();
    const [target, setTarget] = useState(null);
    const targetRef = useRef(null);
    const setAlert = useSetRecoilState(alertSnackbarState);
    const token = useRecoilValue(tokenState);
    const users = useRecoilValue(chatUsersState);
    const usersRef = useRef(null);
    const setMessageFrom = useSetRecoilState(messageFromState);



    useEffect(() => {
        
        usersRef.current = users;
          
    }, [users])

    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: 'smooth', inline: 'end' });
        }
    }, [messages])

    useEffect(() => {
        targetRef.current = target;
        console.log({ref: targetRef.current,target})
    }, [target])

    useEffect(() => {
        socket.emit('addUser', token);
    }, [])

    useEffect(() => {


        socket.on('chat',(data)=>{
            if ( targetRef.current === null) {
                const t = usersRef.current.filter(item => item._id == data.from)[0];
                console.log({ t, data, use: usersRef.current })
                if (t) {
                    setTarget(t)
                    setMessages(pre => [...pre, data])
                }
            } else if (targetRef.current._id === data.from) {
                setMessages(pre => [...pre, data])
            } else {
                setMessageFrom(pre => [...pre, data.from])
            }
        })
    }, [])

    const handleMessage = () => {
        if (message === '') return;
        if (!target) return;
        const body = { message, from: user._id, to: target._id }
        setMessages([...messages, body])
        setMessage('');
        socket.emit('chat', body)
    }



    const me = (id) => {
        if (user?._id && user?._id === id) {
            return 'me'
        }

        return 'others'
    }


    if (!user) {
        setAlert({ open: true, message: 'Please Login For Chat', severity: 'warning' })
        return <Redirect to="/signin" />
    }

    const handleTarget=(data)=>{
        setTarget(data)
    }

    return (
        <Box >
            <Container maxWidth="md">
                <Box mt={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={5}>
                            <ChatSidebar setTarget={handleTarget} socket={socket} />
                        </Grid>
                        <Grid item xs={7}>
                            <Paper>
                                <Box>
                                    <Box p={3} display="flex" alignItems="center">
                                        <Avatar src={user.avatar} />
                                        <Box ml={3}>
                                            <Typography variant="h5" >{user.name}</Typography>
                                            <Typography variant="subtitle1" color="textSecondary">connected with {target?.name}</Typography>
                                        </Box>
                                    </Box>
                                    <Divider />
                                    <Box minHeight={200} maxHeight={300} overflow="hidden scroll" >
                                        {messages.map((item, i) =>
                                            <Box className={classes[me(item.from)]} key={i}>
                                                <Typography className={classes[`${me(item.from)}Text`]}>
                                                    {item.message}
                                                </Typography>
                                            </Box>
                                        )}
                                        <Box ref={messageRef} />
                                    </Box>
                                    <Box pb={3}>
                                        <Box maxHeight={60} overflow="hidden auto" p={2} maxWidth="80%" margin="auto">
                                            <Input value={message} onChange={e => setMessage(e.target.value)} className={classes.input} fullWidth multiline={true} placeholder="write your message" endAdornment={
                                                <Box display="flex" marginTop="auto">
                                                    <IconButton onClick={() => setEmojiOpen(true)} style={{ color: 'orange' }} size="small">
                                                        <EmojiEmotionsIcon />
                                                    </IconButton>
                                                    <IconButton size="small">
                                                        <AttachFileIcon />
                                                    </IconButton>
                                                    <IconButton disabled={!Boolean(target)} onClick={handleMessage} color="primary" size="small">
                                                        <SendIcon />
                                                    </IconButton>
                                                </Box>
                                            } />
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            <Dialog open={emojiOpen} onClose={() => setEmojiOpen(false)}>
                <Box p={3} maxWidth={300}>
                    <Typography gutterBottom>Emoji</Typography>
                    <Divider />
                    <Box justifyContent="center" display="flex" flexWrap="wrap">
                        {allEmoji.map((em, i) =>
                            <Box p={1} key={i} fontSize={25}>
                                {em}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Dialog>
        </Box>
    )
}
