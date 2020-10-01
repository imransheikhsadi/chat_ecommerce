import React, { useEffect } from 'react'
import { Box, IconButton, Typography, ButtonGroup, Button, Divider, Avatar } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import Hide from '../molecules/Hide.mole';


export default function CartItem({ wishCart, handleDelete, handleAdd, handleRemove,item, handler, ...product }) {
    useEffect(()=>{
        console.log({product})
    })
    return (
        <>
            <Box py={2}>
                <Box display="flex" alignItems="center">
                    <Box>
                        <Avatar style={{ width: 100, height: 125 }} variant="square" src={product.image.small[0]} alt="cart image" />
                    </Box>
                    <Box flexDirection={{ xs: 'column', md: 'row' }} mx={2} flexGrow={1} display="flex" justifyContent="space-between" alignItems={{ xs: 'left', md: 'center' }}>
                        <Typography gutterBottom component="div">
                            <Typography gutterBottom>{product.name}</Typography>
                            <Typography color="textSecondary">Color Black</Typography>
                        </Typography>
                        <Typography gutterBottom variant="subtitle1">{product.price}</Typography>
                        <Hide hide={wishCart}>
                            <Box mb={1}>
                                <ButtonGroup variant="outlined">
                                    <Button onClick={() => handleRemove(product._id)}>
                                        <RemoveIcon />
                                    </Button>
                                    <Button>
                                        {product.count}
                                    </Button>
                                    <Button onClick={() => handleAdd(product._id)}>
                                        <AddIcon />
                                    </Button>
                                </ButtonGroup>
                            </Box>
                        </Hide>
                        <Typography align="right" gutterBottom variant="h6">{product.subTotal}</Typography>
                    </Box>
                    <Box>
                        <Box mt={-1}>
                            <IconButton onClick={() => handleDelete(product._id)}>
                                <DeleteIcon />
                            </IconButton>
                            {wishCart && <Button onClick={() => handler({...item,count: 1})} variant="contained" color="primary">Add TO CArt</Button>}
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Divider />
        </>
    )
}
