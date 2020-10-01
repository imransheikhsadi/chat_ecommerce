import React from 'react'
import { Grid, Container, Box, makeStyles } from '@material-ui/core'
import Sidebar from '../components/Sidebar.component'
import ShopContent from '../components/ShopContent.component'
import MainDrawer from '../molecules/MainDrawer.mole'
import { useRecoilState } from 'recoil'
import { sideDrawerState } from '../recoil/atoms'

const createStyles = makeStyles(theme => ({
    sideBar: {
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    }
}))

export default function Shop() {

    const classes = createStyles()
    const [sideBarOpen, setSideBarOpen] = useRecoilState(sideDrawerState);

    return (
        <Box mt={3}>
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid className={classes.sideBar} item xs={false} md={2}>
                        <Box mt={6}>
                            <Sidebar />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <ShopContent />
                    </Grid>
                </Grid>
            </Container>
            <MainDrawer open={sideBarOpen} setOpen={setSideBarOpen}>
                <Sidebar />
            </MainDrawer>
        </Box>
    )
}
