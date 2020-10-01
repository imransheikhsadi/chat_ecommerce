import React from 'react'
import { Drawer, makeStyles, ClickAwayListener, Divider, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const createStyles = makeStyles(theme => ({
    mainContainer: {
        minWidth: 270
    },
    container: {
        margin: 10
    },
    closeButton: {
        color: theme.palette.grey[400]
    }
    
}))

export default function MainDrawer({children,open,setOpen}) {
    const classes = createStyles();

    return (
        <Drawer open={open}>
            <ClickAwayListener onClickAway={()=>setOpen(false)}>
                <div className={classes.mainContainer}>
                    <div className={classes.container}>
                        <Button onClick={()=>setOpen(false)} startIcon={<CloseIcon/>} fullWidth className={classes.closeButton} >
                            Close
                        </Button>
                    </div>
                    <Divider/>
                    <div className={classes.container}>
                        {children}
                    </div>
                </div>
            </ClickAwayListener>
        </Drawer>
    )
}
