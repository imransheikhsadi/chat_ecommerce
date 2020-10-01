import 'date-fns';
import { Avatar, Box, Button, ButtonGroup, Container, Divider, Grid, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, makeStyles, Paper, Tab, Tabs, Typography } from '@material-ui/core';
import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { blue, deepOrange, deepPurple, green, grey}  from '@material-ui/core/colors';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList';
import DateFnsUtils from '@date-io/date-fns';
import PersonIcon from '@material-ui/icons/Person';
import { Rating, TabContext, TabPanel } from '@material-ui/lab';
import XAxis from 'recharts/es6/cartesian/XAxis';
import YAxis from 'recharts/es6/cartesian/YAxis';
import Tooltip from 'recharts/es6/component/Tooltip';
import LineChart from 'recharts/es6/chart/LineChart';
import Line from 'recharts/es6/cartesian/Line';
import CartesianGrid from 'recharts/es6/cartesian/CartesianGrid';
import { getStat } from '../request/stats.request';
import { checkStatus } from '../utils';
import { getProducts } from '../request/product.request';
import Hide from '../molecules/Hide.mole';
import { getOrders } from '../request/order.request';
import { MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';

const getColor = (color, mode, value = 2, contrast) => {
    return {
        backgroundColor: mode === 'light' ? color[100 * value] : color[100 * (10 - value)],
        color: mode === 'light' ? contrast(color[100 * value]) : contrast(color[100 * (10 - value)])
    }
}



const createStyles = makeStyles(function (theme) {
    const isLight = theme.palette.type === 'light';
    const mode = theme.palette.type;
    const { getContrastText } = theme.palette;

    return {
        avatarSize: {
            width: 50,
            height: 50,
            color: theme.palette.primary.main,
            backgroundColor: isLight ? getContrastText(deepPurple[300]) : getContrastText(deepPurple[700])

        },
        orderBox: getColor(deepPurple, mode, 2, getContrastText),
        incomeBox: getColor(green, mode, 3, getContrastText),
        expenseBox: getColor(blue, mode, 3, getContrastText),
        userBox: getColor(deepOrange, mode, 3, getContrastText),
    }
})

export default function Dashboard() {

    const classes = createStyles();
    const [currentTab, setCurrentTab] = useState(0);
    const [totalIncome, setTotalIncome] = useState('--');
    const [newOrders, setNewOrders] = useState('--');
    const [bestSelling, setBestSelling] = useState([]);
    const [sales, setSales] = useState([]);
    const [cost, setCost] = useState([]);
    const [bayers, setBayers] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    const [statDate, setStatDate] = useState(new Date());
    const [range,setRange] = useState('month')
    const [newUsers, setNewUsers] = useState('--')
    const pickerRef = useRef();


    useEffect(() => {
        (async () => {
            const response = await getStat({range,point: statDate},'');
            if (checkStatus(response)) {
                const { stats } = response.data;
                setNewOrders(stats.newOrders || '--');
                setTotalIncome(stats.totalIncome || '--');
                setNewUsers(stats.newUsers || '--')
            }

        })()
    }, [range,statDate]);

    useEffect(() => {
        (async () => {
            const response = await getProducts('?sort=-createdAt&limit=5');
            if (checkStatus(response)) {
                setRecentProducts(response.data.products)
            }

        })()
    }, []);

    useEffect(() => {
        (async () => {
            const response = await getStat({range,point: statDate},'latestBayers');
            if (checkStatus(response)) {
                setBayers(response.data.bayers)
            }

        })()
    }, [range,statDate]);

    useEffect(() => {
        (async () => {
            const response = await getProducts('?sort=-sold&limit=5');
            if (checkStatus(response)) {
                setBestSelling(response.data.products);
            }

        })()
    }, []);


    useEffect(() => {
        (async () => {
            const response = await getOrders('');
            if (checkStatus(response)) {
                const orders = response.data.orders;
                const dup = [];
                const arr = [];
                orders.forEach(item => {
                    if (!dup.includes(item.orderBy._id)) {
                        arr.push({
                            name: item.orderBy.name,
                            products: item.products.map(e => e.product.image.small[0]),
                            date: item.orderedAt
                        })
                    }

                    dup.push(item.orderBy._id);
                })


            }

        })()
    }, []);

    useEffect(() => {
        (async () => {
            const response = await getStat({range,point: statDate},'/summary');
            if (checkStatus(response)) {
                setSales(response.data.sales)
                setCost(response.data.cost)
            }

        })()
    }, [range,statDate]);


    const handleTabChange = (_, nxt) => {
        setCurrentTab(nxt)
    }

    const handleDateChange = (date) => {
        setStatDate(date)
    }

    return (
        <Box mt={3}>
            <Container maxWidth="lg">
                <Grid container justify="space-between">
                    <Grid item>
                        <Typography variant="h4">Dashboard</Typography>
                    </Grid>

                    <Grid item>
                        <Box mb={2} display="flex" justifyContent="end">
                            <ButtonGroup>
                                <Button color={range === 'day'? 'primary':'default'} onClick={()=>setRange('day')}>Day</Button>
                                <Button color={range === 'week'? 'primary':'default'} onClick={()=>setRange('week')}>Week</Button>
                                <Button color={range === 'month'? 'primary':'default'} onClick={()=>setRange('month')}>Month</Button>
                                <Button color={range === 'year'? 'primary':'default'} onClick={()=>setRange('year')}>Year</Button>
                                <Button color="secondary" onClick={() => pickerRef.current.click()}>{statDate.toLocaleDateString().replaceAll('/', '-')}</Button>
                            </ButtonGroup>
                        </Box>
                        <Box mb={2} display="none">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    value={statDate}
                                    KeyboardButtonProps={{ ref: pickerRef }}
                                    onChange={handleDateChange}
                                />
                            </MuiPickersUtilsProvider>
                        </Box>
                    </Grid>
                </Grid>

                <Box mt={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            {/* <Paper> */}
                            <Box className={classes.orderBox} p={2}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box >
                                        <Typography>NEW ORDERS</Typography>
                                        <Typography variant="h4">{newOrders}</Typography>
                                        {/* <Typography color="textSecondary">+2.5%(30 Days)</Typography> */}
                                    </Box>
                                    <Box>
                                        <Avatar className={classes.avatarSize}>
                                            <ShoppingBasketIcon color="inherit" />
                                        </Avatar>
                                    </Box>
                                </Box>
                                <Box></Box>
                            </Box>
                            {/* </Paper> */}
                        </Grid>
                        <Grid item xs={3}>
                            <Box className={classes.incomeBox} p={2}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box >
                                        <Typography>Total Income</Typography>
                                        <Typography variant="h4">${totalIncome}</Typography>
                                        {/* <Typography color="textSecondary">+2.5%</Typography> */}
                                    </Box>
                                    <Box>
                                        <Avatar className={classes.avatarSize}>
                                            <AttachMoneyIcon color="inherit" />
                                        </Avatar>
                                    </Box>
                                </Box>
                                <Box></Box>
                            </Box>
                        </Grid>
                        <Grid item xs={3}>
                            <Box className={classes.expenseBox} p={2}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box >
                                        <Typography>Total Expense</Typography>
                                        <Typography variant="h4">{cost.map(item => item.totalCost).reduce((accu, cur) => accu + cur, 0)}</Typography>
                                        {/* <Typography color="textSecondary">+2.5%(30 Days)</Typography> */}
                                    </Box>
                                    <Box>
                                        <Avatar className={classes.avatarSize}>
                                            <FeaturedPlayListIcon color="inherit" />
                                        </Avatar>
                                    </Box>
                                </Box>
                                <Box></Box>
                            </Box>
                        </Grid>
                        <Grid item xs={3}>
                            <Box className={classes.userBox} p={2}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box >
                                        <Typography>NEW USERS</Typography>
                                        <Typography variant="h4">{newUsers}</Typography>
                                        {/* <Typography color="textSecondary">+2.5%(30 Days)</Typography> */}
                                    </Box>
                                    <Box>
                                        <Avatar className={classes.avatarSize}>
                                            <PersonIcon color="inherit" />
                                        </Avatar>
                                    </Box>
                                </Box>
                                <Box></Box>
                            </Box>
                        </Grid>
                        {/* ************************** */}
                        <Grid item xs={6}>
                            <Paper>
                                <Box p={2}>
                                    <Box my={2}>
                                        <Typography variant="h5" gutterBottom>Summary</Typography>
                                    </Box>
                                    {/* <Divider /> */}
                                    <Box>
                                        <TabContext value={currentTab}>
                                            <Paper square>
                                                <Tabs
                                                    value={currentTab}
                                                    onChange={handleTabChange}
                                                // variant="fullWidth"
                                                >
                                                    {/* <Tab label="Products" /> */}
                                                    <Tab value={0} label="Sales" />
                                                    <Tab value={1} label="Cost" />
                                                    <Tab value={2} label="Revenue" />
                                                </Tabs>

                                            </Paper>
                                            <TabPanel value={0} >
                                                <Box>
                                                    <LineChart width={400} height={300} data={sales}>
                                                        <Line type="monotone" dataKey="sale" stroke={blue[500]} />
                                                        <CartesianGrid stroke={grey[300]} strokeDasharray="5 5" />
                                                        <XAxis dataKey="_id" />
                                                        <YAxis />
                                                        <Tooltip />
                                                    </LineChart>
                                                </Box>
                                            </TabPanel>
                                            <TabPanel value={1} >
                                                <Box>
                                                    <LineChart width={400} height={300} data={cost}>
                                                        <Line type="monotone" dataKey="totalCost" stroke={blue[500]} />
                                                        <CartesianGrid stroke={grey[300]} strokeDasharray="5 5" />
                                                        <XAxis dataKey="_id" />
                                                        <YAxis />
                                                        <Tooltip />
                                                    </LineChart>
                                                </Box>
                                            </TabPanel>
                                            <TabPanel value={2} >Third Tab Panel</TabPanel>
                                        </TabContext>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper>
                                <Box p={2}>
                                    <Box my={2}>
                                        <Typography variant="h5" gutterBottom>Top Selling Products</Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <List>
                                            {bestSelling.map((item, i) =>
                                                <React.Fragment key={item._id}>
                                                    <ListItem>
                                                        <ListItemAvatar>
                                                            <Avatar src={item.image.small[0]} variant="square" />
                                                        </ListItemAvatar>
                                                        <ListItemText primary={
                                                            <Box display="flex" justifyContent="space-between">
                                                                <Typography>{item.name}</Typography>
                                                                <Box mr={3}>
                                                                    <Rating
                                                                        value={item.rating}
                                                                        size="small"
                                                                    />
                                                                </Box>
                                                            </Box>
                                                        } secondary={item.title} />
                                                        <ListItemSecondaryAction>
                                                            <Typography variant="h6">
                                                                ${item.price}
                                                            </Typography>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                    <Hide hide={bestSelling.length - 1 === i}>
                                                        <Divider />
                                                    </Hide>
                                                </React.Fragment>
                                            )}
                                        </List>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper>
                                <Box p={2}>
                                    <Box my={2}>
                                        <Typography variant="h5" gutterBottom>Recent Activity</Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <List>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar />
                                                </ListItemAvatar>
                                                <ListItemText primary="Delivered" />
                                                <ListItemSecondaryAction>
                                                    <Typography color="textSecondary">
                                                        25mins ago
                                                    </Typography>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        </List>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper>
                                <Box p={2}>
                                    <Box my={2}>
                                        <Typography variant="h5" gutterBottom>Recent Products</Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <List>
                                            {recentProducts.map((item, i) =>
                                                <React.Fragment key={item._id}>
                                                    <ListItem>
                                                        <ListItemAvatar>
                                                            <Avatar src={item.image.small[0]} variant="square" />
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={
                                                                <Typography>{item.name}</Typography>
                                                            }
                                                            secondary={
                                                                <Typography variant="h6">
                                                                    ${item.price}
                                                                </Typography>
                                                            }
                                                        />

                                                    </ListItem>
                                                    <Hide hide={recentProducts.length - 1 === i}>
                                                        <Divider />
                                                    </Hide>
                                                </React.Fragment>
                                            )}
                                        </List>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper>
                                <Box p={2}>
                                    <Box my={2}>
                                        <Typography variant="h5" gutterBottom>Recent bayers</Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <List>
                                            {bayers.map((item, i) =>
                                                <React.Fragment key={item._id}>
                                                    <ListItem>
                                                        <ListItemAvatar>
                                                            <Avatar src={item?.avatar} />
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={
                                                                <Typography>{item.name}</Typography>
                                                            }
                                                            secondary={
                                                                <Typography color="textSecondary">
                                                                    {new Date(item.orderedAt).toDateString()}
                                                                </Typography>
                                                            }
                                                        />
                                                        {/* <ListItemSecondaryAction>
                                                            <AvatarGroup >
                                                                <Avatar src="https://timesofindia.indiatimes.com/thumb/msid-73984558,width-1200,height-900,resizemode-4/.jpg" />
                                                                <Avatar src="https://i.pinimg.com/originals/2d/43/1f/2d431f765ad31dae82a632aa8246d28c.jpg" />
                                                            </AvatarGroup>
                                                        </ListItemSecondaryAction> */}
                                                    </ListItem>
                                                    <Hide hide={bayers.length - 1 === i}>
                                                        <Divider />
                                                    </Hide>
                                                </React.Fragment>
                                            )}
                                        </List>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

            </Container>
        </Box >
    )
}
