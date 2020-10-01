import React from 'react'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IconButton, makeStyles, Box } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { useSetRecoilState } from 'recoil';
import { slideChangeEvent } from '../recoil/atoms';


const createStyles = makeStyles(theme => ({
    dot: {
        '& > li > button:before': {
            fontSize: 15
        }
    }
}))

const NextButton = ({ onClick,customStyle }) => {
    return (
        <Box display={{ xs: 'none', sm: 'block' }}>
            <IconButton color="primary" onClick={onClick} style={customStyle ? customStyle : { position: 'absolute', right: 30, top: '50%' }}>
                <ChevronRightIcon />
            </IconButton>
        </Box>
    )
}

const PrevButton = ({ onClick,customStyle }) => {
    return (
        <Box display={{ xs: 'none', sm: 'block' }}>
            <IconButton color="primary" onClick={onClick} style={customStyle ? customStyle : { position: 'absolute', left: 30, top: '50%', zIndex: 5555 }}>
                <ChevronLeftIcon />
            </IconButton>
        </Box>

    )
}



export default function Carousel({ component, data, customStyle }) {

    const classes = createStyles()
    const setSlideEvent = useSetRecoilState(slideChangeEvent);

    const settings = {
        dots: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextButton customStyle={customStyle?.buttonNext} />,
        prevArrow: <PrevButton customStyle={customStyle?.buttonPrev} />,
        infinite: false,
        appendDots: (dots) =>
            <div style={customStyle?.buttonDots || { position: 'absolute', bottom: 10 }}>
                <ul className={classes.dot} >{dots}</ul>
            </div>
    };

    return (
        <Slider {...settings} afterChange={()=>setSlideEvent(prev=>!prev)}>
            {data.map((item,i) =>
                <React.Fragment key={i}>
                    {React.cloneElement(component, {...item})}
                </React.Fragment>
            )}
        </Slider>
    )
}
