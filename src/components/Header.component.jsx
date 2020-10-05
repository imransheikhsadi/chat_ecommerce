import React, { useState } from 'react'
import { AppBar, Toolbar, IconButton, makeStyles, MenuItem, Container, ClickAwayListener, Box, Tooltip, Badge, MenuList, ListItemIcon, ListItemText, Avatar } from '@material-ui/core'
import logo from '../assets/logo.svg'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import PersonIcon from '@material-ui/icons/Person';
import { useRecoilState } from 'recoil';
import { mainDrawerState, cartDrawerState } from '../recoil/atoms';
import NavMenu from '../molecules/NavMenu.mole';
import MenuIcon from '@material-ui/icons/Menu';
import MainDrawer from '../molecules/MainDrawer.mole';
import MenuContainer from '../molecules/MenuContainer.mole';
import CartPreview from '../molecules/CartPreview.mole';
import EnhancedEncryptionIcon from '@material-ui/icons/EnhancedEncryption';
import { Link, useHistory } from 'react-router-dom';
import { userState } from '../recoil/user/user.atoms';
import Hide from '../molecules/Hide.mole';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useRecoilValue } from 'recoil';
import { cartState } from '../recoil/user/user.selector';


const createStyle = makeStyles(theme => ({
    mainHeader: {
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'row'
    },
    regular: {
        minHeight: 52
    },
    list: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        [theme.breakpoints.up('md')]: {
            flexGrow: 1
        }
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        [theme.breakpoints.down('md')]: {
            justifyContent: 'space-between'
        }
    },
    icon: {
        fontSize: 25,

    },
    button: {
        '&:hover $icon,&:focus': {
            color: theme.palette.primary.main
        }
    },
    logo: {

        [theme.breakpoints.down('md')]: {
            margin: 'auto',

        }
    },
    listIcon: {
        minWidth: 'max-content',
        marginRight: 10
    }

}));


export default function Header() {

    const classes = createStyle();

    const [drawerOpen, setDrawerOpen] = useRecoilState(mainDrawerState);
    const [user, setUser] = useRecoilState(userState);
    const [cartDrawerOpen, setCartDrawerOpen] = useRecoilState(cartDrawerState);
    const [personOpen, setPersonOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const cart = useRecoilValue(cartState);
    const history = useHistory();


    const handleLogOut = () => {
        setUser(null);
        document.cookie = 'jwt=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    return (
        <React.Fragment>
            <AppBar className={classes.mainHeader}>
                <Container maxWidth="lg" className={classes.container}>
                    <Box display={{ xs: 'block', md: 'none' }}>
                        <IconButton className={classes.button} onClick={() => setDrawerOpen(true)}>
                            <MenuIcon className={classes.icon} />
                        </IconButton>
                    </Box>
                    <Toolbar classes={{ regular: classes.regular }}>
                        <Link to="/home">
                                <img className={classes.logo} src={logo} alt="logo" />
                        </Link>
                    </Toolbar>
                    <Box display={{ xs: 'none', md: 'flex' }}>
                        <NavMenu />
                    </Box>
                    <div className={classes.list}>
                        <Box display={{ xs: 'none', md: 'block' }} style={{ position: 'relative' }}>
                            <ClickAwayListener onClickAway={() => setCartOpen(false)}>
                                <Tooltip title="Cart" arrow>
                                    <IconButton onClick={() => setCartOpen(!cartOpen)} className={classes.button}>
                                        <Badge badgeContent={cart.totalQuantity} color="primary">
                                            <ShoppingBasketIcon className={classes.icon} />
                                        </Badge>
                                    </IconButton>
                                </Tooltip>
                            </ClickAwayListener>
                            <MenuContainer open={cartOpen}>
                                <CartPreview />
                            </MenuContainer>
                        </Box>
                        <Box display={{ xs: 'block', md: 'none' }}>
                            <Tooltip title="Cart" arrow>
                                <IconButton onClick={() => setCartDrawerOpen(!cartOpen)} className={classes.button}>
                                    <Badge badgeContent={cart.totalQuantity} color="primary">
                                        <ShoppingBasketIcon className={classes.icon} />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box style={{ position: 'relative' }}>
                            <ClickAwayListener onClickAway={() => setPersonOpen(false)}>
                                <Tooltip title="My Account" arrow>
                                    <IconButton className={classes.button} onClick={() => setPersonOpen(!personOpen)}>
                                        {user ? <Avatar style={{ width: 30, height: 30 }} src={user?.avatar} /> :
                                            <PersonIcon className={classes.icon} />
                                        }
                                    </IconButton>
                                </Tooltip>
                            </ClickAwayListener>
                            <MenuContainer open={personOpen}>
                                <MenuList dense>
                                    <Hide hide={user}>
                                        <MenuItem onClick={() => history.push('/signin')}>
                                            <ListItemIcon classes={{ root: classes.listIcon }}>
                                                <EnhancedEncryptionIcon />
                                            </ListItemIcon>
                                            <ListItemText>
                                                Login
                                        </ListItemText>
                                        </MenuItem>
                                    </Hide>

                                    <Hide hide={user}>
                                        <MenuItem onClick={() => history.push('/signup')}>
                                            <ListItemIcon classes={{ root: classes.listIcon }}>
                                                <PersonIcon />
                                            </ListItemIcon>
                                            <ListItemText>
                                                Register
                                        </ListItemText>
                                        </MenuItem>
                                    </Hide>
                                    <Hide hide={!user}>
                                        <MenuItem onClick={() => history.push('/dashboard')}>
                                            <ListItemIcon classes={{ root: classes.listIcon }}>
                                                <PersonIcon />
                                            </ListItemIcon>
                                            <ListItemText>
                                                Profile
                                        </ListItemText>
                                        </MenuItem>
                                    </Hide>
                                    <MenuItem onClick={() => history.push('/cart')}>
                                        <ListItemIcon classes={{ root: classes.listIcon }}>
                                            <ShoppingBasketIcon />
                                        </ListItemIcon>
                                        <ListItemText>
                                            View Cart
                                        </ListItemText>
                                    </MenuItem>
                                    <Hide hide={!user}>
                                        <MenuItem onClick={handleLogOut}>
                                            <ListItemIcon classes={{ root: classes.listIcon }}>
                                                <ExitToAppIcon />
                                            </ListItemIcon>
                                            <ListItemText>
                                                Log Out
                                        </ListItemText>
                                        </MenuItem>
                                    </Hide>
                                    
                                </MenuList>
                            </MenuContainer>
                        </Box>
                    </div>
                </Container>
            </AppBar>
            <MainDrawer open={drawerOpen} setOpen={setDrawerOpen}>
                <NavMenu styleProp={{ flxd: 'column', py: 10, fz: 12 }} showIcon={true} />
            </MainDrawer>
            <MainDrawer open={cartDrawerOpen} setOpen={setCartDrawerOpen}>
                <CartPreview />
            </MainDrawer>
            <div style={{ width: '100%', height: 52, visibility: 'hidden' }}>!!Fixer!!</div>
        </React.Fragment>
    )
}
