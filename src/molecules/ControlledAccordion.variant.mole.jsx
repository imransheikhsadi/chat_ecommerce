import React, { useState, cloneElement } from 'react'
import { Accordion, AccordionSummary, Typography, AccordionDetails, makeStyles, Box } from '@material-ui/core'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useRecoilState } from 'recoil';
import { dashDrawerState } from '../recoil/atoms';
import { useEffect } from 'react';


const createStyles = makeStyles(theme=>({
    root: {
        backgroundColor: '#1E1E2D'
    },
    title: {
        paddingLeft: props=>props.drawerOpen ? 8 : 30,
        transition: 'all 300ms',
        paddingTop: 3,
        color: props=> props.selected ? theme.palette.common.white : theme.palette.grey[400]
    },
    startIcon: {
        fill: props=> props.selected ? theme.palette.primary.main : theme.palette.grey[800],
        width: 25
    }
}));


export default function ControlledAccordionBlack({children,title,startIcon,selected,onClick}) {

    const [drawerOpen,setDrawerOpen] = useRecoilState(dashDrawerState)
    const [expandable, setExpandable] = useState(true);
    const classes = createStyles({selected: selected === title,drawerOpen});


    useEffect(()=>{
        if(!drawerOpen){
            setExpandable(true)
        }
    },[drawerOpen])


    return (
        <Accordion 
            onClick={()=>{onClick(title);setDrawerOpen(Boolean(children))}} 
            className={classes.selected} classes={{root: classes.root}}  
            expanded={!expandable && Boolean(children)} 
            onChange={() => setExpandable(!expandable)}>
            <AccordionSummary
                expandIcon={children && <KeyboardArrowDownIcon color="primary"/>}
            >
                <Box display="flex">
                    <div>
                        {cloneElement(startIcon,{className: classes.startIcon})}
                    </div>
                    <Typography className={classes.title} variant="subtitle1">
                        {title}
                    </Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    )
}
