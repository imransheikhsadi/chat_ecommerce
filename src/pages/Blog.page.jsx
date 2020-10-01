import React from 'react'
import { Container, Grid } from '@material-ui/core'
import Showcase from '../components/Showcase.component'
import BlogCard from '../molecules/BlogCard.mole'
// import { assets } from '../utils'

const items = [
    {

    }
]

function BlogComponent({ image }) {
    return <Grid container >
        <Grid xs={2} item>
            
        </Grid>
        <Grid xs={8} item>
            <BlogCard image={image} horizontal={true} />
        </Grid>
        <Grid xs={2} item>
            
            </Grid>
    </Grid>
}


export default function Blog() {
    return (
        <div>
            {/* <Container maxWidth="lg">
                <Showcase
                    title="News"
                    items={[
                        { image: assets.blog[0] },
                        { image: assets.blog[1] },
                        { image: assets.blog[2] }
                    ]}
                    component={
                        <BlogComponent/>
                    }
                    breakPoints={{ lg: 12 }}
                />
            </Container> */}
        </div>
    )
}
