import React from 'react'
import { IconButton, makeStyles } from '@material-ui/core'
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import PinterestIcon from '@material-ui/icons/Pinterest';

const createStyles = makeStyles(theme=>({
    root: {
        '& > *': {
            color: theme.palette.common.white,
            '&:hover': {
                color: theme.palette.common.black,
            }
        }
    }
}))

export default function SocialIcons() {

    const classes = createStyles();

    return (
        <div className={classes.root}>
            <IconButton>
                <FacebookIcon />
            </IconButton>
            <IconButton>
                <InstagramIcon />
            </IconButton>
            <IconButton>
                <TwitterIcon />
            </IconButton>
            <IconButton>
                <PinterestIcon />
            </IconButton>
        </div>
    )
}
