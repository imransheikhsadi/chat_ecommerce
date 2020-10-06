import React from 'react'
import { Container, makeStyles, Box, Paper, Typography, Avatar,  Dialog, TextField, MenuItem, IconButton, Tooltip, Button } from '@material-ui/core'
import { useEffect } from 'react';
import { useState } from 'react';
import Hide from '../molecules/Hide.mole';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import PublishIcon from '@material-ui/icons/Publish';
import ImageUpload from './ImageUpload.component';
import { catchAsync, checkStatus } from '../utils';
import { changePassword, uploadprofilePicture } from '../request/user.requset';
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/user/user.atoms';
import { useSetRecoilState } from 'recoil';
import { alertSnackbarState } from '../recoil/atoms';
import { useFetch } from '../customHooks';


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
const adminRoles = ['user', 'moderator', 'admin']; 


export default function UserView({ uploadHandler,user,setUser }) {
    const classes = createStyles();
    const [focus, setFocus] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [textEditPopup, setTextEditPopup] = useState(false)
    const [newAvatar,setNewAvatar] = useState(null);
    const [roles,setRoles] = useState([]);
    const currentUser = useRecoilValue(userState);
    const [passwordChangeOpen,setPasswordChangeOpen] = useState(false);
    const [oldPassword,setOldPassword] = useState('');
    const [newPassword,setNewPassword] = useState('');
    const [confirmNewPassword,setConfirmNewPassword] = useState('');
    const setAlert = useSetRecoilState(alertSnackbarState);
    const fetch = useFetch();


    

    useEffect(()=>{
        catchAsync(async()=>{
            if(newAvatar){
                await uploadprofilePicture({newImage: newAvatar});
            }
        })()
    },[newAvatar])

    useEffect(()=>{
            if(currentUser){
                if(currentUser.role === 'admin'){
                    setRoles(adminRoles)
                }else{
                    setRoles([`${user.role}`])
                }
            }
    },[currentUser])



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

    const handlePasswordChange = async()=>{
        if( newPassword !== confirmNewPassword ){
            setAlert({open: true,message: 'Confirm Password Didnt Match',severity: 'warning'})
            return;
        }
        setPasswordChangeOpen(false);
        setOldPassword('')
        setNewPassword('')
        setConfirmNewPassword('');
        const response = await fetch(changePassword,{oldPassword,newPassword,confirmNewPassword})
        if(checkStatus(response)){
            setAlert({open: true,message: 'Your Password Changed Successfully',severity: 'success'})
        }
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
                        <Hide hide={currentUser && currentUser._id !== user._id }>
                            <Button onClick={()=>setPasswordChangeOpen(true)} color="primary">Change Password</Button>
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
                                {roles.map(role =>
                                    <MenuItem key={role} value={role}>
                                        {role}
                                    </MenuItem>
                                )}
                            </TextField> :
                            <TextField value={user?.[focus]} onChange={handleChange} />
                    }
                </Box>
            </Dialog>
            <Dialog open={passwordChangeOpen} onClose={()=>setPasswordChangeOpen(false)}>
                <Paper>
                    <Box m={4}>
                        <Box display="flex" flexDirection="column">
                            <TextField type="password" label="Old Password" required value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)}/>
                            <TextField type="password" label="New Password" required value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
                            <TextField type="password" label="Confirm new Password" required value={confirmNewPassword} onChange={(e)=>setConfirmNewPassword(e.target.value)}/>
                        </Box>
                        <Box mt={2}>
                            <Button onClick={handlePasswordChange} fullWidth color="primary" variant="contained" >Confirm Change</Button>
                        </Box>
                    </Box>
                </Paper>
            </Dialog>

        </div>
    )
}
