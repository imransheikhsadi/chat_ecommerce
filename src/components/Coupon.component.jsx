import { Avatar, Box, Button, Chip, Container, Divider, Grid, IconButton, Paper, Tooltip, Typography } from '@material-ui/core'
import FileCopyIcon from '@material-ui/icons/FileCopy';
import React, { useEffect, useState } from 'react'
import AddIcon from '@material-ui/icons/Add';

import CreateCoupon from '../molecules/CreateCoupon.mole';
import { catchAsync, checkStatus } from '../utils';
import { deleteCoupon, getCoupons } from '../request/other.request';
import { sub } from 'date-fns';
import { useSetRecoilState } from 'recoil';
import { loaderState } from '../recoil/atoms';

export default function Coupon() {
    const [newCouponOpen, setNewCouponOpen] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [clipText, setClipText] = useState('');
    const setLoader = useSetRecoilState(loaderState);

    useEffect(() => {
        catchAsync(async () => {
            const response = await getCoupons();
            if (checkStatus(response)) {
                setCoupons(response.data.doc.coupons)
            }
        })()
    }, [])

    const handleCopy = (code) => {
        setClipText(code);
        navigator.clipboard.writeText(code);
    }

    const getRemainTime = (d) => {
        const currentDate = new Date();
        const endDate = new Date(d);
        const df = new Date(endDate.getTime() - currentDate.getTime())
        const years = df.getUTCFullYear() - 1970 === 0 ? '' : `${df.getUTCFullYear() - 1970} Years`
        const month = df.getUTCMonth() === 0 ? '' : `${df.getUTCMonth()} Month`
        const day = df.getUTCDate() - 1 === 0 ? '' : `${df.getUTCDate()} Day`
        const hour = df.getUTCDate() === 0 ? '' : `${df.getUTCHours()} Hours`
        return `${years} ${month} ${day} ${hour}`;
    }

    const isValid = (d) => {
        return (new Date()).getTime() < (new Date(d)).getTime()
    }

    const handleDelete = catchAsync(async (code) => {
        setLoader(true)
        const response = await deleteCoupon({ code });
        setLoader(false)
        if (checkStatus(response)) {
            console.log(response.data)
            setCoupons(response.data.doc.coupons)
        }
    })

    return (
        <div>
            <Box m={2} display="flex" justifyContent="space-between">
                <Box></Box>
                <Typography variant="h4" align="center">Coupons</Typography>
                <Box>
                    <Button onClick={() => setNewCouponOpen(true)} variant="outlined" startIcon={<AddIcon color="primary" />}>Add New Coupon</Button>
                </Box>
            </Box>
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    {coupons.map(item =>
                        <Grid key={item.code} item xs={4}>
                            <Paper>
                                <Box p={3}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box overflow="hidden">
                                            <Typography align="center" variant="h6">{item.code}</Typography>
                                        </Box>
                                        <Tooltip title="Copy" arrow={true}>
                                            <IconButton color={clipText === item.code ? 'primary' : 'default'} onClick={() => handleCopy(item.code)}>
                                                <FileCopyIcon style={{ width: 15, height: 15 }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Divider />
                                    <Box mt={1} display="flex" justifyContent="space-between">
                                        <Typography color="textSecondary">Expires In</Typography>
                                        <Typography color={isValid(item.expiresIn) ? 'primary' : 'secondary'}>{getRemainTime(item.expiresIn)}</Typography>
                                    </Box>
                                    <Box mt={1} display="flex" justifyContent="space-between">
                                        <Typography color="textSecondary">Discount</Typography>
                                        <Typography>{item.discount && `$${item.discount}`}</Typography>
                                    </Box>
                                    <Box mt={1} display="flex" justifyContent="space-between">
                                        <Typography color="textSecondary">Limit</Typography>
                                        <Typography>{item.limit === '0' ? <Typography component="span" color="secondary">{'Unlimited'}</Typography> : item.limit}</Typography>
                                    </Box>
                                    <Box mt={1}>
                                        <Typography gutterBottom color="textSecondary" align="center">Valid For</Typography>
                                        {!Boolean(item.validFor.all) && <Box maxWidth={280} m={'auto'}>
                                            {Object.keys(item.validFor).map(key =>
                                                [...item.validFor[key]].map(item => <Chip style={{ margin: 2 }} color="primary" size="small" avatar={<Avatar>{key.split('').slice(0, 1).join('').toUpperCase()}</Avatar>} key={`${key}-${item}`} label={item} />)
                                            )}
                                        </Box>}
                                    </Box>
                                    <Box mt={2}>
                                        <Button onClick={() => handleDelete(item.code)} variant="outlined" fullWidth >Delete</Button>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </Container>
            <CreateCoupon newCouponOpen={newCouponOpen} setNewCouponOpen={setNewCouponOpen} setCoupons={setCoupons} />
        </div>
    )
}
