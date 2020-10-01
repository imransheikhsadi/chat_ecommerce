import React from 'react'
import { makeStyles, ButtonBase, fade } from '@material-ui/core'

const createStyles = makeStyles(theme => ({
    root: {
        backgroundColor: (props)=> props.selected ? theme.palette.primary.main : fade(theme.palette.primary.main,.3),
        width: 30,
        height: 30,
        display: 'flex',
        margin: 2,
        '& > *': {
            margin: 'auto'
        },
        '&:hover': {
           backgroundColor: theme.palette.primary.main,
           color: theme.palette.primary.contrastText
        }
    }
}))

export default function Size({onClick,size,selected}) {

    const classes = createStyles({selected});

    return (
        <ButtonBase onClick={onClick} className={classes.root}>
            {size}
        </ButtonBase>
    )
}
