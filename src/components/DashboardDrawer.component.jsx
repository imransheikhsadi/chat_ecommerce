import React, { useState } from 'react'
import { Drawer, IconButton, makeStyles, Typography, Box, ListItemIcon, ListItemText, fade, MenuList, MenuItem } from '@material-ui/core'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ControlledAccordionBlack from '../molecules/ControlledAccordion.variant.mole';
import { ReactComponent as DashIcon } from '../assets/svgs/rectangle.svg';
import { ReactComponent as TshirtIcon } from '../assets/svgs/tshirt.svg';
import PeopleIcon from '@material-ui/icons/People';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import { useRecoilState } from 'recoil';
import { dashDrawerState, dashboardRouteState } from '../recoil/atoms';
import clsx from 'clsx';
import AddIcon from '@material-ui/icons/Add';
import UpdateIcon from '@material-ui/icons/Update';
import ViewListIcon from '@material-ui/icons/ViewList';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import WebIcon from '@material-ui/icons/Web';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import { routes } from '../utils';
import { useIsModarator, useIsAdmin } from '../customHooks';
import Hide from '../molecules/Hide.mole';




const drawerWidth = 270;

const createStyles = makeStyles(theme => ({
    drawerHeader: {
        display: 'flex',
        color: theme.palette.common.white,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1A1A27'
    },
    drawerRoot: {
        backgroundColor: '#1E1E2D',
        zIndex: 6
    },
    accordionPaper: {
        backgroundColor: '#1A1A27 !important',
        color: 'white',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: 'hidden'
    },
    drawerClose: {
        width: theme.spacing(9),
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        [theme.breakpoints.down('sm')]: {
            visibility: "hidden",
            width: 0,
        }
    },
    white: {
        color: fade(theme.palette.primary.contrastText, .7),

    },
    menuItem: {
        '&:hover > $white': {
            color: theme.palette.primary.main,
        }
    }
}))



export default function DashboardDrawer() {
    const classes = createStyles();
    const [selected, setSelected] = useState('Dashboard');
    const [drawerOpen, setDrawerOpen] = useRecoilState(dashDrawerState)
    const [route, setRoute] = useRecoilState(dashboardRouteState);

    const isModarator = useIsModarator();
    const isAdmin = useIsAdmin()

    console.log(isModarator)

    return (
        <Drawer
            className={
                clsx({
                    [classes.drawerOpen]: drawerOpen,
                    [classes.drawerClose]: !drawerOpen
                })
            }
            classes={{
                paper: clsx(classes.drawerRoot, {
                    [classes.drawerOpen]: drawerOpen,
                    [classes.drawerClose]: !drawerOpen
                })
            }}
            variant="permanent"
        >
            <div className={classes.drawerPaper}>
                <div style={{ width: drawerWidth }}>
                    <div className={classes.drawerHeader}>
                        <Box ml={2}>
                            <Typography style={{ fontWeight: 'bold' }} component="h5" align="center" variant="h5" color="inherit">
                                WooKie
                            </Typography>
                        </Box>
                        <IconButton onClick={() => setDrawerOpen(!drawerOpen)} color="primary">
                            <KeyboardArrowRightIcon />
                        </IconButton>
                    </div>
                    <Box mt={2}>
                        <Hide hide={!isModarator}>
                            <ControlledAccordionBlack onClick={(title) => {
                                setSelected(title);
                                setRoute(routes.DASHBOARD)
                            }}
                                selected={selected}
                                title="Dashboard"
                                startIcon={<DashIcon />}
                            />
                        </Hide>
                        <Hide hide={!isModarator}>
                            <ControlledAccordionBlack onClick={(title) => setSelected(title)} selected={selected} title="Products" startIcon={<TshirtIcon />}>
                                <MenuList color="textPrimary">
                                    <MenuItem onClick={() => setRoute(routes.CREATE_PRODUCT)} className={classes.menuItem} button={true} >
                                        <ListItemIcon className={classes.white}>
                                            <AddIcon />
                                        </ListItemIcon>
                                        <ListItemText className={classes.white}>
                                            Create A Product
                                        </ListItemText>
                                    </MenuItem>
                                    {/* <MenuItem onClick={() => setRoute(routes.EDIT_PRODUCT)} className={classes.menuItem} button={true} >
                                        <ListItemIcon className={classes.white}>
                                            <UpdateIcon />
                                        </ListItemIcon>
                                        <ListItemText className={classes.white}>
                                            Update Product
                                        </ListItemText>
                                    </MenuItem> */}
                                    <MenuItem onClick={() => setRoute(routes.VIEW_PRODUCTS)} className={classes.menuItem} button={true} >
                                        <ListItemIcon className={classes.white}>
                                            <ViewListIcon />
                                        </ListItemIcon>
                                        <ListItemText className={classes.white}>
                                            See All Products
                                </ListItemText>
                                    </MenuItem>
                                </MenuList>
                            </ControlledAccordionBlack>
                        </Hide>
                        <Hide hide={!isAdmin}>
                            <ControlledAccordionBlack onClick={(title) => setSelected(title)} selected={selected} title="Management" startIcon={<PeopleIcon />}>
                                <MenuList color="textPrimary">
                                    <MenuItem onClick={() => setRoute(routes.MAKE_MODARATOR)} className={classes.menuItem} button={true} >
                                        <ListItemIcon className={classes.white}>
                                            <AddIcon />
                                        </ListItemIcon>
                                        <ListItemText className={classes.white}>
                                            Make Moderator
                                </ListItemText>
                                    </MenuItem>
                                    <MenuItem onClick={() => setRoute(routes.ADMIN_LIST)} className={classes.menuItem} button={true} >
                                        <ListItemIcon className={classes.white}>
                                            <ViewListIcon />
                                        </ListItemIcon>
                                        <ListItemText className={classes.white}>
                                            See All Admins
                                </ListItemText>
                                    </MenuItem>
                                </MenuList>
                            </ControlledAccordionBlack>
                        </Hide>
                        <Hide hide={!isModarator}>
                            <ControlledAccordionBlack onClick={(title) => setSelected(title)} selected={selected} title="Orders" startIcon={<AddShoppingCartIcon />}>
                                <MenuList color="textPrimary">
                                    <MenuItem onClick={() => setRoute(routes.VIEW_ORDERS)} className={classes.menuItem} button={true} >
                                        <ListItemIcon className={classes.white}>
                                            <LocalShippingIcon />
                                        </ListItemIcon>
                                        <ListItemText className={classes.white}>
                                            View Orders
                                    </ListItemText>
                                    </MenuItem>
                                </MenuList>
                            </ControlledAccordionBlack>
                        </Hide>
                        <ControlledAccordionBlack onClick={(title) => { setRoute(routes.PROFILE); setSelected(title) }} selected={selected} title="Profile" startIcon={<PersonIcon />} />
                        <Hide hide={!isAdmin}>
                            <ControlledAccordionBlack onClick={(title) => setSelected(title)} selected={selected} title="Settings" startIcon={<SettingsIcon />}>
                                <MenuList color="textPrimary">
                                    <MenuItem className={classes.menuItem} button={true} >
                                        <ListItemIcon className={classes.white}>
                                            <SettingsApplicationsIcon />
                                        </ListItemIcon>
                                        <ListItemText className={classes.white}>
                                            General Settings
                                </ListItemText>
                                    </MenuItem>
                                    <MenuItem className={classes.menuItem} button={true} >
                                        <ListItemIcon className={classes.white}>
                                            <WebIcon />
                                        </ListItemIcon>
                                        <ListItemText className={classes.white} onClick={() => setRoute(routes.SITE_PROPERTIES)}>
                                            Site properties
                                </ListItemText>
                                    </MenuItem>
                                    <MenuItem className={classes.menuItem} button={true} >
                                        <ListItemIcon className={classes.white}>
                                            <WebIcon />
                                        </ListItemIcon>
                                        <ListItemText className={classes.white} onClick={() => setRoute(routes.COUPON)}>
                                            Coupons
                                </ListItemText>
                                    </MenuItem>
                                </MenuList>
                            </ControlledAccordionBlack>
                        </Hide>
                    </Box>
                </div>
            </div>
        </Drawer>
    )
}
