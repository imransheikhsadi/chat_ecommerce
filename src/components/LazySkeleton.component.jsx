import React from 'react'
import { Grid } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton';



export default function LazySkeleton({ breakPoints, width, height, items }) {
    return (
        <Grid container spacing={2}>
            {[...Array(items)].map((_,i)=>
            <Grid key={i} {...breakPoints} item>
                <Skeleton variant="rect" component="div" width={width} height={height} />
            </Grid>)}
        </Grid>
    )
}
