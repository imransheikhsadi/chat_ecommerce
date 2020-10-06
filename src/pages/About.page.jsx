import { Box, Container, Divider, Grid, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import aboutBg from '../assets/ourBg.jpg'

const createStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '60vh',
        backgroundImage: `url(${aboutBg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom'

    },
   
    box: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

}))

export default function About() {
    const classes = createStyles();
    return (
        <Container maxWidth="lg">
            <Box mt={7}>
                <Grid container spacing={10}>
                    <Grid item xs={6}>
                        <div className={classes.root}>

                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <Box>
                            <Box className={classes.box}>
                                <Box>
                                    <Typography align="center" variant="h3" >
                                        About Us
                                    </Typography>
                                    <Box mb={2}>
                                        <Divider />
                                    </Box>
                                    <Typography gutterBottom color="textSecondary" variant="h6">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quasi, deleniti praesentium earum quae molestiae veniam sunt, recusandae iure nisi eum blanditiis. Nisi pariatur sed vitae, ullam reprehenderit harum reiciendis.
                                    </Typography>
                                    <Typography color="textSecondary" variant="h6">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quasi, deleniti praesentium earum quae molestiae veniam sunt, recusandae iure nisi eum blanditiis. Nisi pariatur sed vitae, ullam reprehenderit harum reiciendis.
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}
