import { AppBar, Avatar, Badge, Box, Button, List, ListItem, ListItemAvatar, ListItemText, Paper, Tab, Tabs, Typography, useTheme } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/user/user.atoms';
import { getAllUser } from '../request/user.requset';
import { checkStatus } from '../utils';
import SwipeableViews from 'react-swipeable-views';
import {AvatarGroup, TabContext, TabPanel } from '@material-ui/lab';
import { useRecoilState } from 'recoil';
import { chatUsersState, currentTargetState, messageFromState } from '../recoil/atoms';
import CreateGroup from '../molecules/CreateGroup.mole';
import { getAllGroups } from '../request/group.request';


export default function ChatSidebar({ socket }) {
    const [users, setUsers] = useRecoilState(chatUsersState);
    const user = useRecoilValue(userState);
    const [currentTab, setCurrentTab] = useState(0);
    const [active, setActive] = useState([]);
    const usersRef = useRef(null);
    const [messageFrom, setMessageFrom] = useRecoilState(messageFromState);
    const [target, setTarget] = useRecoilState(currentTargetState);
    const targetRef = useRef(null);
    const [groups, setGroups] = useState([]);
    const [popupOpen, setPopupOpen] = useState(false);

    const theme = useTheme();


    useEffect(() => {
        targetRef.current = target
    }, [target])


    useEffect(() => {
        (async () => {
            const response = await getAllGroups();
            console.log(response)
            if (checkStatus(response)) {
                setGroups(response.data.groups)
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

    const handleTarget = (val) => {
        setTarget(val)
        setMessageFrom(messageFrom.filter(item => item !== val._id))
    }

    const handleGroupTarget = (val)=>{
        handleTarget(val);
        socket.emit('addToGroup',{id: val._id})
    }



    return (
        <Box>
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
                                        <ListItem onClick={() => handleTarget(item)} key={item._id} selected={item._id === target?._id} button>
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
                        <Button fullWidth color="primary" variant="contained" onClick={() => setPopupOpen(true)} > Create New Group </Button>
                        <Paper>
                            <Box>
                                <List>
                                    {groups.map(item =>
                                        <ListItem selected={item._id === target?._id} onClick={()=>handleGroupTarget(item)} key={item._id} button>
                                            <ListItemAvatar>
                                                <AvatarGroup max={3}>
                                                    {item.members.map(member =>
                                                        <Avatar alt={member.name} key={member._id} src={member.avatar} />
                                                    )}
                                                </AvatarGroup>
                                            </ListItemAvatar>
                                            <ListItemText primary={item.name} />
                                        </ListItem>
                                    )}
                                </List>
                            </Box>
                        </Paper>
                    </TabPanel>
                </SwipeableViews>
            </TabContext>
            <Box>
                <CreateGroup open={popupOpen} setPopupOpen={setPopupOpen} setGroups={setGroups} />
            </Box>
        </Box>
    )
}
