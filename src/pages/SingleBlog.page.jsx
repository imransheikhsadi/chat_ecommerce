import React from 'react'
import { Container, Typography, makeStyles } from '@material-ui/core'


const createStyles = makeStyles(theme=>({
    title: {
        textAlign: 'center',
        margin: '30px 0'
    }
}))

export default function SingleBlog() {

    
    const classes = createStyles();


    return (
        <div>
           <Container maxWidth="md">
                <Typography className={classes.title} variant="h4">Count Down Time Zone</Typography>
                <Typography className={classes.title} color="textSecondary">by Diego Lopez on June 20, 2018 </Typography>
            </Container> 
        </div>
    )
}
