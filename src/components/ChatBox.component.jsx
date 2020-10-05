import React, { useEffect, useRef, useState } from 'react'
import { Avatar, Box, Button, ClickAwayListener, Dialog, Divider, fade, IconButton, Input, makeStyles, Paper, Typography } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/user/user.atoms';
import { catchAsync, checkStatus } from '../utils';
import { useSetRecoilState } from 'recoil';
import { chatUsersState, currentTargetState, messageFromState } from '../recoil/atoms';
import { createMessage, getMessages, getGroupMessages } from '../request/message.request';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import Hide from '../molecules/Hide.mole';
import { useRecoilState } from 'recoil';
import ImageUpload from './ImageUpload.component';

const allEmoji = ['👌', '👋', '👊', '👍', '😂', '😀', '😇', '😈', '😍', '😎', '💗', '🦁']

const createStyles = makeStyles(theme => ({
    me: {
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
    },
    meImage: {
        width: '70%',
        backgroundColor: fade(theme.palette.primary.main, .3),
        padding: 8,
        margin: 15,
        borderRadius: 3,
        marginLeft: 'auto',
    },
    othersImage: {
        width: '70%',
        backgroundColor: fade(theme.palette.grey[500], .3),
        padding: 8,

        margin: 15,
        borderRadius: 3
    }
}));

export default function ChatBox({ socket }) {
    const [messages, setMessages] = useState([]);
    const user = useRecoilValue(userState);
    const [message, setMessage] = useState('');
    const [emojiOpen, setEmojiOpen] = useState(false)
    const classes = createStyles();
    const [target, setTarget] = useRecoilState(currentTargetState);
    const targetRef = useRef(target);
    const users = useRecoilValue(chatUsersState);
    const usersRef = useRef(null);
    const setMessageFrom = useSetRecoilState(messageFromState);
    const [messagePage, setMessagePage] = useState(1);
    const [scroll, setScroll] = useState('down');
    const scrollDownRef = useRef();
    const scrollUpRef = useRef();
    const [typeing, setTypeing] = useState(false);
    const [otherTypeing, setOtherTypeing] = useState(false);
    const [messageType, setMessageType] = useState('text');
    const [imageUrl, setImageUrl] = useState(null);



    useEffect(() => {
        if (scroll === 'down') {
            scrollDownRef.current && scrollDownRef.current.scrollIntoView({ behavior: 'smooth', inline: 'end' });
        }
    }, [setOtherTypeing])

    useEffect(() => {
        targetRef.current = target;
    }, [target])

    useEffect(() => {


        socket.on('chat', (data) => {
            if (targetRef.current === null) {
                const t = usersRef.current.filter(item => item._id == data.from)[0];
                if (t) {
                    setTarget(t)
                    setMessages(pre => [...pre, data])
                }
            } else if (targetRef.current._id === data.from) {
                setMessages(pre => [...pre, data])
            } else if (data.type === 'group') {
                setMessages(pre => [...pre, data])
            } else {
                setMessageFrom(pre => [...pre, data.from])
            }
        })
    }, [])

    useEffect(() => {
        socket.on('typeing', (data) => {
            setOtherTypeing(data.status);
        })
    }, [])

    useEffect(() => {

        usersRef.current = users;

    }, [users])

    useEffect(() => {

        if (target) {
            socket.emit('typeing', { to: target._id, status: typeing })
        }

    }, [typeing])

    useEffect(() => {
        if (scroll === 'up') {
            scrollUpRef.current && scrollUpRef.current.scrollIntoView({ behavior: 'smooth', inline: 'start' });
        } else {
            scrollDownRef.current && scrollDownRef.current.scrollIntoView({ behavior: 'smooth', inline: 'end' });
        }
    }, [messages])







    const handleCreateMessage = catchAsync(async (data) => {
        const response = await createMessage(data);
    })

    const handleMessage = () => {
        if (message === '') return;
        if (!target) return;
        const body = { message, from: user._id, to: target._id, messageType, createdBy: user.name }
        if (messageType === 'image') {
            body.imageSrc = imageUrl
        }
        setMessages([...messages, { ...body, src: imageUrl }])
        setMessage('');
        socket.emit('chat', { ...body, src: imageUrl, type: target.members ? 'group' : 'single' })
        handleCreateMessage(body)
        setTypeing(false);
    }



    const me = (id) => {
        if (user?._id && user?._id === id) {
            return 'me'
        }

        return 'others'
    }


    useEffect(() => {
        catchAsync(async () => {
            if (target) {
                if (target.members) {
                    const response = await getGroupMessages({ from: user._id, to: target._id }, { page: messagePage });
                    if (checkStatus(response)) {
                        setMessages(response.data.messages)
                        setScroll('down');
                    }
                } else {
                    const response = await getMessages({ from: user._id, to: target._id }, { page: messagePage });
                    if (checkStatus(response)) {
                        setMessages(response.data.messages)
                        setScroll('down');
                    }
                }
            }
        })()
    }, [target])


    useEffect(() => {
        catchAsync(async () => {
            const response = await getMessages({ from: user._id, to: target._id }, { page: messagePage });
            if (checkStatus(response)) {
                setScroll('up');
                setMessages([...response.data.messages, ...messages])
            }
        })()
    }, [messagePage]);

    const handleImageUrl = (_, base64Data) => {
        setMessageType('image')
        setImageUrl(base64Data)
        setMessage('---image---')
    }

    const scrollDown = () => {
        scrollDownRef.current && scrollDownRef.current.scrollIntoView({ behavior: 'smooth', inline: 'end' });
    }

    const handleMessageUpdate = (event) => {
        if (message === '---image---') return;
        setMessage(event.target.value)
        setMessageType('text')
    }

    const handleEmoji = (em) => {
        if (message === '') {
            setMessageType('emoji')
            setMessage(`${em}`)
        } else {
            setMessage(`${message}${em}`)
        }
        setEmojiOpen(false)
    }

    if (!target) {
        return null;
    }

    return (
        <Box>
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
                    <Box minHeight={200} maxHeight={300} overflow="hidden scroll">
                        <Box ref={scrollUpRef} />
                        <Hide hide={messages.length === 0} fallback={
                            <Box mt={3}>
                                <Typography align="center" color="textSecondary">
                                    No Messages Found, Start Chatting now
                                </Typography>
                            </Box>
                        }>
                            <Box textAlign="center">
                                <Button onClick={() => setMessagePage(messagePage + 1)} startIcon={<ArrowUpwardIcon color="primary" />} >See Old Messages</Button>
                            </Box>
                        </Hide>
                        {messages.map((item) => {
                            if (item.messageType === 'image') {
                                return (

                                    <Box className={classes[`${me(item.from)}Image`]} key={item._id}>
                                        <Hide hide={!target.members}>
                                            <Typography style={{ fontSize: 12, padding: '4px 0'}} color="textSecondary" align={me(item.from) === 'me' ? 'right' : 'left'} >
                                                {item.createdBy}
                                            </Typography>
                                        </Hide>
                                        <img onLoad={scrollDown} width="100%" src={item.src} />
                                    </Box>
                                )
                            } else if (item.messageType === 'emoji') {
                                return (

                                    <Box className={classes[me(item.from)]} key={item._id}>
                                        <Hide hide={!target.members}>
                                            <Typography style={{ fontSize: 12, padding: '4px 0', backgroundColor: '#fff' }} color="textSecondary" align={me(item.from) === 'me' ? 'right' : 'left'} >
                                                {item.createdBy}
                                            </Typography>
                                        </Hide>
                                        <Typography style={{ fontSize: 30, backgroundColor: 'transparent' }} className={classes[`${me(item.from)}Text`]}>
                                            {item.message}
                                        </Typography>
                                    </Box>
                                )
                            } else {
                                return (
                                    <Box className={classes[me(item.from)]} key={item._id}>
                                        <Hide hide={!target.members}>
                                            <Typography style={{ fontSize: 12, padding: '4px 0', backgroundColor: '#fff' }} color="textSecondary" align={me(item.from) === 'me' ? 'right' : 'left'} >
                                                {item.createdBy}
                                            </Typography>
                                        </Hide>
                                        <Typography className={classes[`${me(item.from)}Text`]}>
                                            {item.message}
                                        </Typography>
                                    </Box>
                                )
                            }
                        })}
                        <Box visibility={otherTypeing ? 'visible' : 'hidden'}>
                            <Typography align="center" variant="subtitle2" color="textSecondary">
                                Typeing....
                            </Typography>
                        </Box>
                        <Box ref={scrollDownRef} />
                    </Box>

                    <Box pb={3}>
                        <Box maxHeight={60} overflow="hidden auto" p={2} maxWidth="80%" margin="auto">

                            <ClickAwayListener onClickAway={() => setTypeing(false)}>
                                <Input onFocus={() => setTypeing(true)} value={message} onChange={handleMessageUpdate} className={classes.input} fullWidth multiline={true} placeholder="write your message" endAdornment={
                                    <Box display="flex" marginTop="auto">
                                        <IconButton onClick={() => setEmojiOpen(true)} style={{ color: 'orange' }} size="small">
                                            <EmojiEmotionsIcon />
                                        </IconButton>
                                        <IconButton size="small">
                                            <ImageUpload onUpload={handleImageUrl} button={<AttachFileIcon />} />
                                        </IconButton>
                                        <IconButton disabled={!Boolean(target)} onClick={handleMessage} color="primary" size="small">
                                            <SendIcon />
                                        </IconButton>
                                    </Box>
                                } />
                            </ClickAwayListener>
                        </Box>
                    </Box>
                </Box>
            </Paper>
            <Dialog open={emojiOpen} onClose={() => setEmojiOpen(false)}>
                <Box p={3} maxWidth={300}>
                    <Typography gutterBottom>Emoji</Typography>
                    <Divider />
                    <Box justifyContent="center" display="flex" flexWrap="wrap">
                        {allEmoji.map((em, i) =>
                            <Box style={{ cursor: 'pointer' }} onClick={() => handleEmoji(em)} p={1} key={i} fontSize={25}>
                                {em}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Dialog>
        </Box>
    )
}
