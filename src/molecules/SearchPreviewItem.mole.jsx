import React from 'react'
import Hide from './Hide.mole'
import { MenuItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@material-ui/core'

export default function SearchPreviewItem({ src,name,email,_id,productCode,handleClick }) {
    return (
        <>
            <MenuItem onClick={()=>handleClick(_id,productCode)}>
                <Hide hide={!src}>
                    <ListItemAvatar>
                        <Avatar src={src} />
                    </ListItemAvatar>
                </Hide>
                <ListItemText primary={name} />
                <Typography color="textSecondary">
                    {email}
                </Typography>
            </MenuItem>
        </>
    )
}
