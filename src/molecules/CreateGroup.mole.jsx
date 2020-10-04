import { Avatar, Box, Button, Dialog, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useFetch } from '../customHooks';
import { alertSnackbarState } from '../recoil/atoms';
import { createGroup } from '../request/group.request';
import { getAllUser } from '../request/user.requset';
import { checkStatus } from '../utils';
import AddIcon from '@material-ui/icons/Add';
import { userState } from '../recoil/user/user.atoms';

export default function CreateGroup({ open,setPopupOpen,setGroups }) {
    const [name, setName] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectUserOpen, setSelectUserOpen] = useState();
    const user = useRecoilValue(userState);
    const setAlert = useSetRecoilState(alertSnackbarState);
    const fetch = useFetch();


    const handleCreate = async () => {
        setPopupOpen(false)
        if (selectedUsers.length === 0 || name === '') return setAlert({ open: true, message: 'Please Specify all fields', severity: 'error' })
        const response = await fetch(createGroup, { name, members: [...selectedUsers.map(item=>item._id), user._id] });
        if (checkStatus(response)) {
            setGroups(pre=>[...pre,response.data.group])
            console.log(response);
        }
    };

    useEffect(() => {
        (async () => {
            const response = await getAllUser();
            if (checkStatus(response)) {
                setUsers(response.data.users.filter(item => item._id !== user?._id))
            }
        })()
    }, [])

    const handleMemberAdd = (member) => {
        console.log(member)
        setSelectedUsers([...selectedUsers,member])
        setUsers(users.filter(item=>item._id !== member._id ))
        setSelectUserOpen(false)
    }

    return (
        <div>
            <Dialog open={open} onClose={()=>setPopupOpen(false)}>
                <Paper>
                    <Box p={3}>
                        <TextField fullWidth value={name} onChange={e => setName(e.target.value)} label="Group Name" />
                        <Box>
                            <Button disabled={name === ''} fullWidth onClick={() => setSelectUserOpen(true)} startIcon={<AddIcon />} >Add</Button>
                        </Box>
                        <Box>
                            <List>
                                {selectedUsers.map(item =>
                                    <ListItem key={item._id}>
                                        <ListItemAvatar>
                                            <Avatar src={item.avatar} />
                                        </ListItemAvatar>
                                        <ListItemText primary={item.name} />
                                    </ListItem>
                                )}
                            </List>
                        </Box>
                        <Button fullWidth color="primary" variant="contained" onClick={handleCreate}>Create Group</Button>
                    </Box>
                </Paper>
            </Dialog>
            <Dialog open={selectUserOpen} onClose={()=>setSelectUserOpen(false)}>
                <Paper>
                    <Box p={3}>
                        <Box>
                            <Typography gutterBottom variant="h6" color="textSecondary" align="center" >Select Members</Typography>
                        </Box>
                        <List>
                            {users.map(item =>
                                <ListItem button onClick={() => handleMemberAdd(item)} key={item._id}>
                                    <ListItemAvatar>
                                        <Avatar src={item.avatar} />
                                    </ListItemAvatar>
                                    <ListItemText primary={item.name} />
                                </ListItem>
                            )}
                        </List>
                    </Box>
                </Paper>
            </Dialog>
        </div>
    )
}
