import React, { useState } from 'react'
import { Drawer, IconButton, makeStyles, Typography, Box, ListItemIcon, ListItemText, fade, MenuList, MenuItem } from '@material-ui/core'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ControlledAccordionBlack from '../molecules/ControlledAccordion.variant.mole';
import { ReactComponent as TshirtIcon } from '../assets/svgs/tshirt.svg';
import PeopleIcon from '@material-ui/icons/People';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import PersonIcon from '@material-ui/icons/Person';
import { useRecoilState } from 'recoil';
import { dashDrawerState, dashboardRouteState } from '../recoil/atoms';
import clsx from 'clsx';
import AddIcon from '@material-ui/icons/Add';
import ViewListIcon from '@material-ui/icons/ViewList';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import WebIcon from '@material-ui/icons/Web';
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
    const [selected, setSelected] = useState('Products');
    const [drawerOpen, setDrawerOpen] = useRecoilState(dashDrawerState)
    const [route, setRoute] = useRecoilState(dashboardRouteState);

    const isModarator = useIsModarator();
    const isAdmin = useIsAdmin()


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
                                My Shop
                            </Typography>
                        </Box>
                        <IconButton onClick={() => setDrawerOpen(!drawerOpen)} color="primary">
                            <KeyboardArrowRightIcon />
                        </IconButton>
                    </div>
                    <Box mt={2}>
                        <Hide hide={!isModarator}>
                            <ControlledAccordionBlack onClick={(title) => setSelected(title)} selected={selected} title="Products" startIcon={<TshirtIcon />}>
                                <MenuList color="textPrimary">
                                    <Hide hide={!isAdmin}>
                                        <MenuItem onClick={() => setRoute(routes.CREATE_PRODUCT)} className={classes.menuItem} button={true} >
                                            <ListItemIcon className={classes.white}>
                                                <AddIcon />
                                            </ListItemIcon>
                                            <ListItemText className={classes.white}>
                                                Create A Product
                                        </ListItemText>
                                        </MenuItem>
                                    </Hide>
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
                                            See All Users
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
                            <ControlledAccordionBlack onClick={(title) => {
                                setSelected(title);
                                setRoute(routes.SITE_PROPERTIES)
                            }}
                                selected={selected}
                                title="Site Properties"
                                startIcon={<WebIcon />}
                            />
                        </Hide>
                    </Box>
                </div>
            </div>
        </Drawer>
    )
}
