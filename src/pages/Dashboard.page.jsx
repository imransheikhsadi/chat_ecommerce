import React from 'react'
import { makeStyles, AppBar, Toolbar, Box, IconButton, Avatar, Badge, Button } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import DashboardDrawer from '../components/DashboardDrawer.component';
import clsx from 'clsx';
import { useRecoilState } from 'recoil';
import { dashDrawerState, searchOpenState } from '../recoil/atoms';
import DashboardRoutes from '../components/DashboardRoutes.component';
import SearchIcon from '@material-ui/icons/Search';
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/user/user.atoms';
import { useHistory } from 'react-router-dom';

const drawerWidth = 270;


const createStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },

    contentRoot: {
        flexGrow: 1,
        marginTop: 60
    },
    shift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBar: {
        zIndex: 8
    },
    menuIcon: {
        fontSize: 30
    },
    toolbarRegular: {
        minHeight: 50
    },
    badgeColor: {
        backgroundColor: theme.palette.success.light,
        top: 6
    },
    avatar: {
        height: theme.spacing(4),
        width: theme.spacing(4)
    },
    searchIcon: {
        '&:hover': {
            color: theme.palette.primary.main
        }
    }
}))



export default function Dashboard() {

    const classes = createStyles();
    const [dashDrawer, setDashDrawer] = useRecoilState(dashDrawerState);
    const [searchOpen, setSearchOpen] = useRecoilState(searchOpenState);
    const user = useRecoilValue(userState);
    const history = useHistory();

    return (
        <div className={classes.root}>
            <AppBar
                position="fixed"
                className={clsx({
                    [classes.shift]: dashDrawer,
                    [classes.appBar]: !dashDrawer
                })}
                color="inherit"

            >
                <Toolbar classes={{ regular: classes.toolbarRegular }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexGrow={1}>
                        <Box display={dashDrawer ? 'none' : 'block'}>
                            <IconButton onClick={() => setDashDrawer(true)}>
                                <MenuIcon className={classes.menuIcon} />
                            </IconButton>
                        </Box>
                            <Box>
                                <Button onClick={()=>history.push('/')}>Home</Button>
                            </Box>
                        <Box ml="auto">
                            <IconButton onClick={()=>setSearchOpen(true)} className={classes.searchIcon}>
                                <SearchIcon/>
                            </IconButton>
                            <IconButton>
                                <Badge invisible={!Boolean(user)} classes={{badge: classes.badgeColor}} variant="dot" >
                                    <Avatar className={classes.avatar} src={user?.avatar} />
                                </Badge>
                            </IconButton>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <DashboardDrawer />
            <div className={classes.contentRoot}>
                <DashboardRoutes />
            </div>
        </div>
    )
}
