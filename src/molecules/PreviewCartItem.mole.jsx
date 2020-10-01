import React from 'react'
import { makeStyles, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction, Typography, IconButton, Box } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';



const createStyles = makeStyles(theme => ({
    color: {
        fontSize: 12,
        color: theme.palette.grey[500]
    },
    price: {
        fontWeight: 'bold'
    },
    priceContainer: {
        fontSize: 14
    }
}));

export default function PreviewCartItem({ item,handleDelete }) {

    const classes = createStyles();

    return (
        <ListItem ContainerComponent="div">
            <ListItemAvatar>
                <img style={{ width: 80 }} src={item.image.small[0]} alt="shoe" />
            </ListItemAvatar>
            <ListItemText style={{ width: 'max-content', padding: '0 30px' }}>
                <Typography>
                    {item.name}
                </Typography>
                <Typography className={classes.color}>
                    Green
                </Typography>
                <Box display="flex" justifyContent="space-between">
                    <Typography className={classes.priceContainer}>
                        {item.count} x <span className={classes.price}>{item.price}</span>
                    </Typography>
                    <Typography ml="auto">
                        ${item.subTotal}
                    </Typography>
                </Box>
            </ListItemText>
            <ListItemSecondaryAction>
                <IconButton onClick={()=>handleDelete(item._id)}>
                    <DeleteIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
}
