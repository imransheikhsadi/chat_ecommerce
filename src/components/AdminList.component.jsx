import React, { useState } from 'react'
import { getAdmins } from '../request/user.requset';
import { Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, Container, TableBody, Avatar, Button } from '@material-ui/core'
import { routes, checkStatus, catchAsync } from '../utils'
import EditIcon from '@material-ui/icons/Edit';
import { dashboardRouteState } from '../recoil/atoms';
import { useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import { editUserState } from '../recoil/user/user.atoms';
import LazySkeleton from './LazySkeleton.component';
import Hide from '../molecules/Hide.mole';

export default function AdminList() {
    const [admins, setAdmins] = useState([]);
    const setRoute = useSetRecoilState(dashboardRouteState);
    const setEditUser = useSetRecoilState(editUserState);
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        
        (catchAsync(async () => {
            setLoading(true)
            const response = await getAdmins();
            if (checkStatus(response)) {
                setAdmins(response.data.admins)
            }
            setLoading(false)
        }))()
    }, [])

    const handleEdit = (user) => {
        setEditUser(user);
        setRoute(routes.MAKE_MODARATOR);
    }

    return (
        <div>
            <Box my={2}>
                <Typography variant="h4" align="center">
                    View Admins
                </Typography>
                <Container maxWidth="lg">
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Edit And View</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {admins.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>
                                            <Avatar variant="square" src={item.avatar} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography color="secondary">
                                                {item.role}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleEdit(item)} startIcon={
                                                <EditIcon />
                                            } variant="outlined">
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </TableContainer>
                    <Hide hide={!loading}>
                        <LazySkeleton breakPoints={{ xs: 12 }} items={8} height={60} />
                    </Hide>
                </Container>
            </Box>
        </div>
    )
}
