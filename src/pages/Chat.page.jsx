import { Avatar, Badge, Box, Container, Dialog, Divider, fade, Grid, IconButton, Input, List, ListItem, ListItemAvatar, ListItemText, makeStyles, Paper, Typography } from '@material-ui/core'
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
import { alertSnackbarState, tokenState } from '../recoil/atoms';
import io from 'socket.io-client';



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
    const [users, setUsers] = useState([]);
    const setAlert = useSetRecoilState(alertSnackbarState);
    const [active, setActive] = useState([]);
    const usersRef = useRef(null);
    const [messageFrom, setMessageFrom] = useState([]);
    const token = useRecoilValue(tokenState);

    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: 'smooth', inline: 'end' });
        }
    }, [messages])

    useEffect(()=>{
        targetRef.current = target;
    },[target])

    useEffect(()=>{
        socket.emit('addUser',token);
    },[])
    

    useEffect(() => {
        socket.on('active', (data) => {
            setActive(data);
        });

        socket.on('chat', (data) => {
            console.log(data)
            console.log(target)
            if (targetRef.current === null) {
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

        socket.emit('getActive');
    }, [])

    useEffect(() => {
        (async () => {
            const response = await getAllUser();
            if (checkStatus(response)) {
                usersRef.current = response.data.users;
                setUsers(response.data.users.filter(item => item._id !== user?._id))
            }
            console.log(response)
        })()
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

    const handleTarget = (tar)=>{
        setTarget(tar);
        setMessageFrom(messageFrom.filter(item=>item !== tar._id))
    }

    if (!user) {
        setAlert({ open: true, message: 'Please Login For Chat', severity: 'warning' })
        return <Redirect to="/signin" />
    }

    return (
        <Box >
            <Container maxWidth="md">
                <Box mt={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <Paper>
                                <Box py={2}>
                                    <Typography align="center" variant="h6" color="textSecondary" gutterBottom>Connects</Typography>
                                </Box>
                                <Box maxHeight={400} overflow="hidden auto">
                                    <List>
                                        {users.map(item =>
                                            <ListItem onClick={()=>handleTarget(item)} key={item._id} selected={item._id === target?._id} button>
                                                <ListItemAvatar>
                                                    <Badge
                                                        badgeContent="New"
                                                        invisible={!active.includes(item._id)}
                                                        variant={messageFrom.includes(item._id) ? 'standard' : 'dot'}
                                                        color="primary"
                                                    >
                                                        <Avatar src={item.avatar} />
                                                    </Badge>
                                                </ListItemAvatar>
                                                <ListItemText primary={item.name} />
                                            </ListItem>
                                        )}
                                    </List>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={8}>
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
