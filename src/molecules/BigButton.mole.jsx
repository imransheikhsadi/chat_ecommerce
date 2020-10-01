import React from 'react'
import { ButtonBase, Typography, makeStyles, fade, Box } from '@material-ui/core'

const createStyle = makeStyles(theme => ({
    root: {
        backgroundColor: fade(theme.palette.background.paper, .8),
        padding: '20px 30px',
        borderRadius: 5,
        transition: 'all 300ms',
        '&:hover': {
            transform: 'scale(1.3)'
        }
    }
}))

export default function BigButton({ title, subTitle }) {

    const classes = createStyle();

    return (
        <ButtonBase className={classes.root}>
            <Box>
                <Typography style={{width: 'max-content',margin: 'auto'}}>
                    {title}
                </Typography>
                <Typography variant="h6" style={{width: 'max-content',margin: 'auto'}}>
                    {subTitle}
                </Typography>
            </Box>
        </ButtonBase>
    )
}
