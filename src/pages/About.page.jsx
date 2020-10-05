import { Box, Container, Divider, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import aboutBg from '../assets/ourBg.jpg'
import { ReactComponent as AboutSvg } from '../assets/aboutsv.svg'

const createStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '60vh',
        backgroundImage: `url(${aboutBg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom'

    },
    contentBack: {
        position: 'absolute',
        zIndex: -1,
        fill: theme.palette.primary.main,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        // width: '110%',
        // height: '110%'
    },
    box: {
        width: '100%',
        position: 'absolute',
        top: '50%',
        left: '88%',
        transform: 'translate(-50%,-50%)',
        zIndex: 999

    }

}))

export default function About() {
    const classes = createStyles();
    return (
        <Container maxWidth="md">
            <div className={classes.root}>

            </div>
            <Box position="relative" width="60%">
                <Box className={classes.box}>
                    <AboutSvg className={classes.contentBack} />
                    <Typography align="center" variant="h3" style={{color: '#fff'}}>
                        About Us
                    </Typography>
                    <Typography gutterBottom style={{color: '#eee',fontSize: 20}}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quasi, deleniti praesentium earum quae molestiae veniam sunt, recusandae iure nisi eum blanditiis. Nisi pariatur sed vitae, ullam reprehenderit harum reiciendis.
                    </Typography>
                    <Typography style={{color: '#eee',fontSize: 20}}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quasi, deleniti praesentium earum quae molestiae veniam sunt, recusandae iure nisi eum blanditiis. Nisi pariatur sed vitae, ullam reprehenderit harum reiciendis.
                    </Typography>
                </Box>
            </Box>
        </Container>
    )
}
