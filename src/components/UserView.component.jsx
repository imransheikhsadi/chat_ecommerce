import React from 'react'
import { Container, makeStyles, Box, Paper, Typography, Avatar,  Dialog, TextField, MenuItem, IconButton, Tooltip } from '@material-ui/core'
import { useEffect } from 'react';
import { useState } from 'react';
import Hide from '../molecules/Hide.mole';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import PublishIcon from '@material-ui/icons/Publish';
import ImageUpload from './ImageUpload.component';
import { catchAsync } from '../utils';
import { uploadprofilePicture } from '../request/user.requset';


const createStyles = makeStyles(theme => ({
    root: {

    },
    imageContainer: {
        position: 'absolute',
        bottom: -20,
        left: 40,
        [theme.breakpoints.down('sm')]: {
            top: '60%',
            left: '50%',
            transform: 'translate(-50%,0)'
        }
    },
    avatar: {
        width: 200,
        height: 200
    }
}))

const select = ['role']


export default function UserView({ uploadHandler,user,setUser }) {
    const classes = createStyles();
    const [focus, setFocus] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [textEditPopup, setTextEditPopup] = useState(false)
    const [newAvatar,setNewAvatar] = useState(null);
    

    useEffect(()=>{
        catchAsync(async()=>{
            if(newAvatar){
                await uploadprofilePicture({newImage: newAvatar});
            }
        })()
    },[newAvatar])



    const handleChange = (e) => {
        const newUser = { ...user }
        newUser[focus] = e.target.value
        setUser(newUser)
        setTextEditPopup(true)

    }

    const handleFieldClick = (val) => {
        if (editMode) {
            setFocus(val)
            setTextEditPopup(true)
        }
    }


    const handleSave = () => {
        setEditMode(false)
        if(user){
            uploadHandler(user);
        }
    }

    const imageHandler = (_, url) => {
        setUser({ ...user, avatar: url })
        setNewAvatar(url)
    }

    return (
        <div>
            <Container maxWidth="md">
                <Box position="relative">
                    <Box height={300}>
                        <Paper style={{ height: '100%' }}></Paper>
                    </Box>
                    <div className={classes.imageContainer}>
                        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }}>
                            <Box position="relative">
                                <Avatar
                                    classes={{ root: classes.avatar }}
                                    variant="square"
                                    src={user?.avatar}
                                />
                                <Hide hide={!editMode}>
                                    <Box position="absolute" top={0} right={0}>
                                        <ImageUpload onUpload={imageHandler} button={
                                            <Tooltip title="Change Profile Picture">
                                                <IconButton>
                                                    <Box fontSize={25}>
                                                        <PublishIcon fontSize="inherit" />
                                                    </Box>
                                                </IconButton>
                                            </Tooltip>
                                        } />
                                    </Box>
                                </Hide>
                            </Box>
                            <Box display="flex" justifyContent="end" mb={4} ml={2} mt={2} flexDirection="column">
                                <Box display="flex">
                                    <Typography onClick={() => handleFieldClick('name')} variant="h4">
                                        {user?.name}
                                    </Typography>
                                    <Typography onClick={() => handleFieldClick('role')} color="primary">
                                        {user?.role}
                                    </Typography>
                                </Box>
                                <Typography color="textSecondary">
                                    {user?.email}
                                </Typography>
                            </Box>
                        </Box>

                    </div>
                    <Box top={10} right={10} position="absolute">
                        <Hide hide={editMode} fallback={
                            <Tooltip arrow={true} title="Save Changes">
                                <IconButton onClick={handleSave} color="primary">
                                    <DoneIcon />
                                </IconButton>
                            </Tooltip>
                        }>
                            <Tooltip arrow={true} title="Edit Profile">
                                <IconButton onClick={() => setEditMode(true)} color="secondary">
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                        </Hide>
                    </Box>
                </Box>

            </Container>
            <Dialog open={textEditPopup} onClose={() => setTextEditPopup(false)}>
                <Box m={4}>
                    {
                        select.includes(focus) ?
                            <TextField
                                value={user?.[focus]}
                                select
                                onChange={handleChange}
                            >
                                {['user', 'moderator', 'admin'].map(role =>
                                    <MenuItem key={role} value={role}>
                                        {role}
                                    </MenuItem>
                                )}
                            </TextField> :
                            <TextField value={user?.[focus]} onChange={handleChange} />
                    }
                </Box>
            </Dialog>

        </div>
    )
}
