import { AppBar, Avatar, Badge, Box, List, ListItem, ListItemAvatar, ListItemText, Paper, Tab, Tabs, Typography, useTheme } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/user/user.atoms';
import { getAllUser } from '../request/user.requset';
import { checkStatus } from '../utils';
import SwipeableViews from 'react-swipeable-views';
import { AvatarGroup, TabContext, TabPanel } from '@material-ui/lab';
import { useRecoilState } from 'recoil';
import { chatUsersState, messageFromState } from '../recoil/atoms';


export default function ChatSidebar({ setTarget,socket }) {
    const [users, setUsers] = useRecoilState(chatUsersState);
    const user = useRecoilValue(userState);
    const [currentTab, setCurrentTab] = useState(0);
    const [active, setActive] = useState([]);
    const usersRef = useRef(null);
    const [messageFrom, setMessageFrom] = useRecoilState(messageFromState);
    const [targetID, setTargetID] = useState(null);
    const targetRef = useRef(null);

    const theme = useTheme();


    useEffect(()=>{
        targetRef.current = targetID
    },[targetID])


    useEffect(() => {
        (async () => {
            const response = await getAllUser();
            if (checkStatus(response)) {
                setUsers(response.data.users.filter(item => item._id !== user?._id))
            }
        })()
    }, [])

    useEffect(() => {
        socket.on('active', (data) => {
            setActive(data);
        });

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

    const handleTarget = (val)=>{
        setTarget(val)
        setTargetID(val._id)
        setMessageFrom(messageFrom.filter(item => item !== val._id))
    }

    return (
        <TabContext value={currentTab}>
            <AppBar position="static" color="default">
                <Tabs value={currentTab} variant="fullWidth" onChange={(_, next) => setCurrentTab(next)}>
                    <Tab value={0} label="Connects" />
                    <Tab value={1} label="Groups" />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={currentTab}
                onChangeIndex={(ind) => setCurrentTab(ind)}

            >
                <TabPanel value={0}>
                    <Paper>
                        <Box maxHeight={400} overflow="hidden auto">
                            <List>
                                {users.map(item =>
                                    <ListItem onClick={() => handleTarget(item)} key={item._id} selected={item._id === targetID} button>
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
                </TabPanel>
                <TabPanel value={1}>
                    <Paper>
                        <Box>
                            <List>
                                <ListItem button>
                                    <ListItemAvatar>
                                        <AvatarGroup spacing="small" max={3}>
                                            <Avatar />
                                            <Avatar />
                                            <Avatar />
                                            <Avatar />
                                            <Avatar />
                                            <Avatar />
                                        </AvatarGroup>
                                    </ListItemAvatar>
                                    <ListItemText primary="Admin Froup" />
                                </ListItem>
                            </List>
                        </Box>
                    </Paper>
                </TabPanel>
            </SwipeableViews>
        </TabContext>
    )
}
