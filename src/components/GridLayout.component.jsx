import React from 'react'
import { Grid } from "@material-ui/core"

export default function GridLayout ({spacing,breakPoints,component,items}){
    return (
        <Grid container spacing={Number(spacing)}>
            {items.map((item, i) =>
                <Grid key={i} item xs={breakPoints?.xs || 12} sm={breakPoints?.sm || 4} md={breakPoints?.md || 3} lg={breakPoints?.lg || 3}>
                    {React.cloneElement(component, {...item,item})}
                </Grid>
            )}
        </Grid>
    )
}

