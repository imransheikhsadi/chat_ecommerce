import React from 'react';
import Carousel from '../components/Carousel.component';
import slideDemoImage from '../assets/hero.jpg';
import HeroItem from '../molecules/HeroItem.mole';


function Home() {

    return (
        <div>
            <div>
                <Carousel component={<HeroItem />} data={[{ image: slideDemoImage }]} />
            </div>
        </div>
    )
}


export default Home;
