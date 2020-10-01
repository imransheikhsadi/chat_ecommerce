import React, { useState } from 'react'
import { Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, Container, TableBody, Avatar, Button, TableFooter, TablePagination, IconButton, Menu, MenuItem, makeStyles, Dialog, List, ListItem, ListItemAvatar, ListItemText, Chip } from '@material-ui/core'
import { checkStatus, catchAsync } from '../utils'
import { alertSnackbarState } from '../recoil/atoms';
import { useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import Hide from '../molecules/Hide.mole';
import LazySkeleton from './LazySkeleton.component';
import { getOrders, updateOrder } from '../request/order.request';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useIsInit } from '../customHooks';
import DoneIcon from '@material-ui/icons/Done';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';



const createStyles = makeStyles(theme => ({
    pending: {
        color: theme.palette.warning.main,
        textTransform: 'capitalize'
    },
    complete: {
        color: theme.palette.success.main,
        textTransform: 'capitalize'

    },
    paid: {
        color: theme.palette.success.main,
        textTransform: 'capitalize'

    },
    cancelled: {
        color: theme.palette.error.main,
        textTransform: 'capitalize'
    },
    chipColor: {
        color: theme.palette.text.primary
    }
}))

export default function ViewOrders() {
    const classes = createStyles()
    const setAlert = useSetRecoilState(alertSnackbarState);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(-1);
    const [buttonRef, setButtonRef] = useState(null);
    const [extra, setExtra] = useState('')
    const isInit = useIsInit();
    const [order, setOrder] = useState(null)

    useEffect(() => {
        fetchData(`?page=${page}&limit=${rowsPerPage}&sort=-orderedAt`)
    }, [])

    useEffect(() => {
        if (!isInit) {
            fetchData(`?page=${page}&limit=${rowsPerPage}&${extra}`)
        }
    }, [page, rowsPerPage, extra])


    const fetchData = catchAsync(async (query) => {
        setLoading(true)
        const response = await getOrders(query);
        if (checkStatus(response)) {
            setOrders(response.data.orders)
            setTotal(response.data.total)
        }
        console.log(response.data)
        setLoading(false)
    })


    const handleRowsPerPAge = event => {
        setRowsPerPage(event.target.value)
        setPage(1);
    }

    const handleFilter = (q) => {
        setExtra(q);
        setButtonRef(null)

    }

    const handlePaymentConfirm = async (id) => {
        const response = await updateOrder({ paymentStatus: 'paid' }, id);
        if (checkStatus(response)) {
            setOrder(response.data.order)
            setAlert({ open: true, message: 'Order Updated Successfully', severity: 'success' })
        } else {
            setAlert({ open: true, message: 'Failed To Update Order', severity: 'error' })
        }
        console.log(response.data)
    }

    const handleDeliveryConfirm = async (id) => {
        const response = await updateOrder({ deliveryStatus: 'complete' }, id);
        if (checkStatus(response)) {
            setOrder(response.data.order)
            setAlert({ open: true, message: 'Order Updated Successfully', severity: 'success' })
        } else {
            setAlert({ open: true, message: 'Failed To Update Order', severity: 'error' })

        }
    }



    return (
        <div>
            <Box my={2}>
                <Typography variant="h4" align="center">
                    View Orders
                </Typography>
                <Container maxWidth="lg">
                    <Box display="flex" justifyContent="end">
                        <IconButton onClick={e => setButtonRef(e.currentTarget)}>
                            <FilterListIcon />
                        </IconButton>
                        <Menu onClose={() => setButtonRef(null)} anchorEl={buttonRef} open={Boolean(buttonRef)}>
                            <MenuItem
                                onClick={() => handleFilter('sort=-orderedAt')}
                                selected={extra === 'sort=-orderedAt'}
                            >
                                Recent Orders
                            </MenuItem>
                            <MenuItem
                                onClick={() => handleFilter('deliveryStatus=pending')}
                                selected={extra === 'deliveryStatus=pending'}
                            >
                                Pending Delivery
                            </MenuItem>
                            <MenuItem
                                onClick={() => handleFilter('paymentStatus=pending')}
                                selected={extra === 'paymentStatus=pending'}
                            >
                                Pending Payment
                            </MenuItem>
                            <MenuItem
                                onClick={() => handleFilter('deliveryStatus=complete')}
                                selected={extra === 'deliveryStatus=complete'}
                            >
                                Complete Delivery
                            </MenuItem>
                            <MenuItem
                                onClick={() => handleFilter('paymentStatus=paid')}
                                selected={extra === 'paymentStatus=paid'}
                            >
                                Complete Payment
                            </MenuItem>
                            <MenuItem
                                onClick={() => handleFilter('paymentStatus=paid')}
                                selected={extra === ''}
                            >
                                All
                            </MenuItem>

                        </Menu>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Total Price</TableCell>
                                    <TableCell>Payment Status</TableCell>
                                    <TableCell>Delivery Statsus</TableCell>
                                    <TableCell>Payment Method</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Ordered At</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <Hide hide={loading} fallback={
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <LazySkeleton breakPoints={{ xs: 12 }} items={rowsPerPage} height={50} />
                                        </TableCell>
                                    </TableRow>
                                }>
                                    {orders.map((item) => (
                                        <TableRow key={item._id}>
                                            <TableCell>{item.orderBy.name}</TableCell>
                                            <TableCell>{item.totalPrice}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    onClick={() => { }}
                                                    color="primary"
                                                    classes={{ colorPrimary: classes.chipColor }}
                                                    variant="outlined"
                                                    style={{ textTransform: 'capitalize' }}
                                                    label={item.paymentStatus}
                                                    deleteIcon={
                                                        item.paymentStatus === 'paid' ? <DoneIcon className={classes[item.paymentStatus]} /> :
                                                            item.paymentStatus === 'pending' ? <HourglassEmptyIcon className={classes[item.paymentStatus]} /> :
                                                                <CloseIcon className={classes[item.paymentStatus]} />
                                                    }
                                                    onDelete={() => { }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    onClick={() => { }}
                                                    variant="outlined"
                                                    color="primary"
                                                    classes={{ colorPrimary: classes.chipColor }}
                                                    style={{ textTransform: 'capitalize' }}
                                                    label={item.deliveryStatus}
                                                    deleteIcon={
                                                        item.deliveryStatus === 'complete' ? <DoneIcon className={classes[item.deliveryStatus]} /> :
                                                            item.deliveryStatus === 'pending' ? <HourglassEmptyIcon className={classes[item.deliveryStatus]} /> :
                                                                <CloseIcon className={classes[item.deliveryStatus]} />
                                                    }
                                                    onDelete={() => { }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography align="center" color="textSecondary">
                                                    {item.paymentMethod}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{item.orderBy.email}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => setOrder(item)} startIcon={
                                                    <VisibilityIcon />
                                                } variant="outlined">
                                                    View
                                            </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </Hide>
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 15]}
                                        rowsPerPage={rowsPerPage}
                                        page={page - 1}
                                        onChangePage={(_, nxt) => { console.log(nxt); setPage(nxt + 1) }}
                                        onChangeRowsPerPage={handleRowsPerPAge}
                                        count={total}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>

                </Container>
            </Box>
            <Dialog open={Boolean(order)} onClose={() => setOrder(null)}>
                <Box my={2}>
                    <Typography align="center" variant="h5">Order Details</Typography>
                </Box>
                <Box display="flex" px={3}>
                    <Box>
                        <List>
                            {order?.products.map(item =>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar variant="square" src={item.product.image.small[0]} />
                                    </ListItemAvatar>
                                    <ListItemText>
                                        <Typography>
                                            {item.product.name}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            {item.quantity} x {item.subTotal / item.quantity}
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                            )}
                        </List>
                    </Box>
                    {/* <Divider /> */}
                    <Box minWidth={280} mx={2}>
                        <Box my={1} display="flex" justifyContent="space-between">
                            <Typography color="textSecondary">
                                Customer Name
                            </Typography>
                            <Typography>
                                {order?.orderBy.name}
                            </Typography>
                        </Box>
                        <Box my={1} display="flex" justifyContent="space-between">
                            <Typography color="textSecondary">
                                Customer Email
                            </Typography>
                            <Typography>
                                {order?.orderBy.email}
                            </Typography>
                        </Box>
                        <Box my={1} display="flex" justifyContent="space-between">
                            <Typography color="textSecondary">
                                Address
                            </Typography>
                            <Typography>
                                {order?.address}
                            </Typography>
                        </Box>
                        <Box my={1} display="flex" justifyContent="space-between">
                            <Typography color="textSecondary">
                                State
                            </Typography>
                            <Typography>
                                {order?.state}
                            </Typography>
                        </Box>
                        <Box my={1} display="flex" justifyContent="space-between">
                            <Typography color="textSecondary">
                                Country
                            </Typography>
                            <Typography>
                                {order?.country}
                            </Typography>
                        </Box>
                        <Box my={1} display="flex" justifyContent="space-between">
                            <Typography color="textSecondary">
                                Ordered At
                            </Typography>
                            <Typography variant="caption">
                                {order?.orderedAt}
                            </Typography>
                        </Box>
                        <Box my={1} display="flex" justifyContent="space-between">
                            <Typography color="textSecondary">
                                Payment Method
                            </Typography>
                            <Typography>
                                {order?.paymentMethod}
                            </Typography>
                        </Box>
                        <Box my={1} display="flex" justifyContent="space-between">
                            <Typography color="textSecondary">
                                Delivery Status
                            </Typography>
                            <Typography className={classes[order?.deliveryStatus]}>
                                {order?.deliveryStatus.toUpperCase()}
                            </Typography>
                        </Box>
                        <Box my={1} display="flex" justifyContent="space-between">
                            <Typography color="textSecondary">
                                Payment Status
                            </Typography>
                            <Typography className={classes[order?.paymentStatus]}>
                                {order?.paymentStatus.toUpperCase()}
                            </Typography>
                        </Box>
                        <Box my={1} display="flex" justifyContent="space-between">
                            <Typography color="textSecondary">
                                Total Product
                            </Typography>
                            <Typography>
                                {order?.totalProduct}
                            </Typography>
                        </Box>
                        <Box my={1} display="flex" justifyContent="space-between">
                            <Typography color="textSecondary">
                                Total Price
                            </Typography>
                            <Typography>
                                ${order?.totalPrice}
                            </Typography>
                        </Box>
                    </Box>

                </Box>
                <Box mb={2} p={1} display="flex" justifyContent="space-between">
                    <Box>
                        <Button color="secondary" size="small" variant="contained">Cancel Order</Button>
                    </Box>
                    <Box>
                        <Button disabled={order?.paymentStatus === 'paid'} onClick={() => handlePaymentConfirm(order._id)} color="primary" size="small" variant="contained">Confirm Payment</Button>
                    </Box>

                    <Box>
                        <Button disabled={order?.deliveryStatus === 'complete'} onClick={() => handleDeliveryConfirm(order._id)} color="primary" size="small" variant="contained">Confirm Delivery</Button>
                    </Box>
                </Box>
                <Box right={0} position="absolute" onClick={() => setOrder(null)}>
                    <IconButton>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Dialog>
        </div>
    )
}
