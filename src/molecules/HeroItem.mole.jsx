import React from 'react'
import { makeStyles, Typography, Button } from '@material-ui/core'
import {ReactComponent as ContentBack} from '../assets/heroBack.svg'

const createStyles = makeStyles(theme => ({
    root: {

    },
    container: {
        display: 'flex',
        width: '100%',
        height: 'calc(100vh - 52px)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        [theme.breakpoints.down('sm')]: {
            height: '60vh'
        }
    },
    content: {
        margin: 'auto',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 30,
        zIndex: 4666,
        position: 'relative',
        '& > *': {
            textAlign: 'center'
        },
        [theme.breakpoints.down('xs')]: {
            overflow: 'hidden'
        }

    },
    contentBack: {
        position: 'absolute',
        zIndex: -1,
        fill: theme.palette.background.paper,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '110%',
        height: '110%'
    }
}))

export default function HeroItem({ image }) {

    const classes = createStyles();

    return (
        <div className={classes.root}>
            <div className={classes.container} style={{ backgroundImage: `url("${image}")` }}>
                <div className={classes.content}>
                    <ContentBack className={classes.contentBack} />
                    <Typography color="primary" variant="h6">
                        unique Watch
                    </Typography>
                    <Typography variant="h4">
                        Buy the best for the rest
                    </Typography>
                    <Typography color="textSecondary">
                        Buy The best watches in the world. they are 100% <br /> water resistent and portable
                    </Typography>
                    <div style={{padding: '30px 0'}}>
                        <Button size="large" variant="contained" color="primary">Shop Now</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
