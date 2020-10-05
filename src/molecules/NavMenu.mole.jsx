import React, { useEffect, useState } from 'react'
import { MenuList, MenuItem, makeStyles, Box } from '@material-ui/core'
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { useHistory } from 'react-router-dom';
import { useIsModarator } from '../customHooks';


const createStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: props => props.flxd || 'row',
        flexGrow: 1,
    },
    listItem: {
        color: theme.palette.text.primary,
        fontSize: props => props.fz || 14,
        paddingTop: props => props.py,
        paddingBottom: props => props.py
    },
    selected: {
        color: theme.palette.primary.light,
        '&$selected': {
            backgroundColor: 'transparent',
        }
    }
}))


export default function NavMenu({ styleProp, showIcon }) {

    const classes = createStyles(styleProp);
    const [selected, setSelected] = useState(0);
    const history = useHistory();
    const isModarator = useIsModarator();
    const [navItems,setNavItems] = useState(['home', 'shop','cart','checkout','chat']);


    useEffect(()=>{
        if(isModarator &&  !navItems.includes('dashboard')){
            setNavItems([...navItems,'dashboard'])
        }
    },[isModarator])


    const handleNavClick = (event, index,path) => {

        setSelected(index)
        history.push(`/${path}`)
    }

    return (
        <MenuList className={classes.root}>
            {navItems.map((item, i) =>
                <MenuItem
                    key={i}
                    onClick={e => handleNavClick(e, i,item)}
                    className={classes.listItem}
                    selected={i === selected}
                    classes={{ selected: classes.selected }}
                >
                    {showIcon ?
                        <Box display="flex" justifyContent="space-between" flexGrow={1} alignItems="end">
                            {item.toUpperCase()}
                            <ChevronRightIcon />
                        </Box>:
                        item.toUpperCase()
                    }
                </MenuItem>
            )}
        </MenuList>
    )
}
