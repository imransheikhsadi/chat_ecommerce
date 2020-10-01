import React from 'react'
import { Typography } from '@material-ui/core'

export default function Keyvalue({ items }) {
    return (
        <React.Fragment>
            {Object.keys(items).map((key,i)=>
            <Typography key={i}>
                <Typography color="textPrimary" component="span">
                    {`${key}: `}
                </Typography>
                <Typography color="textSecondary" component="span">
                    {items[key]}
                </Typography>
            </Typography>
            )}
        </React.Fragment>
    )
}
