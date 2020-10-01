import React from 'react'
import { makeStyles, ButtonBase, Avatar } from '@material-ui/core'

const createStyles = makeStyles(theme=>({
    varientColor: {
        border: `2px solid transparent`,
        borderRadius: 4,
        transition: 'all 300ms',
        '&:hover': {
            border: `2px solid ${theme.palette.primary.main}`
        },
        '&:first-child': {
            borderColor: theme.palette.primary.main
        },
        '&:not(:last-child)': {
            marginRight: 3
        }
    }
}))

export default function VarientColor({image}) {

    const classes = createStyles();

    return (
        <ButtonBase className={classes.varientColor}>
            <Avatar variant="rounded" src={image} />
        </ButtonBase>
    )
}
