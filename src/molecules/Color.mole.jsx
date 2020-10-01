import React from 'react'
import { makeStyles, Box, Tooltip } from '@material-ui/core'

const createStyles = makeStyles(theme => ({
    root: {
        width: 30,
        height: 30,
        borderRadius: 5,
        boxSizing: 'border-box',
        backgroundColor: props => props.color,
        position: 'relative',
        border: `2px solid transparent`,


        '&:after': {
            content: `''`,
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: props => props.color,
            transition: 'all 300ms'
        },
        '&:hover': {
            border: `2px solid ${theme.palette.primary.main}`,
            backgroundColor: theme.palette.text.secondary,
            '&:after': {
                transform: 'scale(.8)',
                borderRadius: 0
            }
        }
    }
}))

export default function Color({ color,label }) {
    const classes = createStyles({ color });
    return (
        <Tooltip title={label} arrow={true}>
            <div style={{ padding: '0 4px' }}>
                <div className={classes.root}>

                </div>
            </div>
        </Tooltip>
    )
}
