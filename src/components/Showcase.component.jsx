import React from 'react'
import { Container, Typography, makeStyles } from '@material-ui/core'
import GridLayout from './GridLayout.component';

const createStyles = makeStyles(theme => ({
    header: {
        margin: '40px 0',
        '& > *': {
            textAlign: 'center'
        }
    }
}))


export default function Showcase({ items, component, title, subTitle, breakPoints, spacing = 2, fallback }) {

    const classes = createStyles();


    return (
        <Container maxWidth="lg">
            {title &&
                <div className={classes.header}>
                    <Typography variant="h5">
                        {title}
                    </Typography>
                    <Typography>
                        {subTitle}
                    </Typography>
                </div>
            }
            <GridLayout items={items} component={component} breakPoints={breakPoints} spacing={spacing} />
        </Container>
    )
}
