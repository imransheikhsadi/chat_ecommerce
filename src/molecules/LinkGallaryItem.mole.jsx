import React from 'react'
import { Button, makeStyles, Box } from '@material-ui/core'
import { useSetRecoilState } from 'recoil'
import { shopQueryState } from '../recoil/atoms'
import { useHistory } from 'react-router-dom'

const createStyles = makeStyles(theme => ({
    center: {

    },
    img: {
        width: '100%',
        // height: '100%',
        transition: 'all 300ms',
        '$container:hover &': {
            transform: 'scale(1.3)'
        },
    },
    container: {
        position: 'relative',
        maxHeight: (props)=> props.height ? props.height : 260,
        width: '100%',
        overflow: 'hidden',
        '&:before': {
            content: `''`,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0)',
            zIndex: 1,
            position: 'absolute',
            transition: 'all 300ms',

        },
        '&:hover': {
            '&:before': {
                backgroundColor: 'rgba(0,0,0,.5)',
            }
        }
    },
    hoverClass: {
        opacity: 0,
        transition: 'all 300ms',
        '$container:hover &': {
            opacity: 1
        }
    }
}))

export default function LinkGallaryItem({ image, children, hover,height,link,title }) {

    const classes = createStyles({height})
    const setShopQuery = useSetRecoilState(shopQueryState);
    const history = useHistory();

    const handleClick = ()=>{
        setShopQuery(pre=>({catagory: link}))
        history.push('/shop')
    }

    return (
        <div className={classes.container}>
            <img src={image} className={classes.img} alt="" />
            <Box className={hover && classes.hoverClass} style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                zIndex: 2
            }}>
                {children ? children : <Button onClick={handleClick} color="primary" variant="contained">{title}</Button>}
            </Box>
        </div>
    )
}
