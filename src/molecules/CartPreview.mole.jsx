import React from 'react'
import PreviewCartItem from './PreviewCartItem.mole'
import { Divider, Box, Typography, Button } from '@material-ui/core'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { userCartState } from '../recoil/user/user.atoms'
import { cartState } from '../recoil/user/user.selector'
import Hide from './Hide.mole'
import { useHistory } from 'react-router-dom'

export default function CartPreview() {

    const setCartItems = useSetRecoilState(userCartState);
    const cart = useRecoilValue(cartState)
    const history = useHistory();

    const handleDelete = (id)=>{
        setCartItems(pre=>pre.filter(item=>item._id !== id))
    }
    
    return (
        <Box>
            <Hide hide={cart.products.length === 0} fallback={
                <Box width={200} p={3}>
                    <Typography color="textSecondary">
                        No Items To Show
                    </Typography>
                </Box>
            }>
                <Box maxHeight={300} overflow="hidden scroll">
                    {cart.products.map((item, i) =>
                        <PreviewCartItem handleDelete={handleDelete} key={item._id} item={item} />
                    )}
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between" p={2}>
                    <Typography style={{ fontWeight: 'bold' }}>
                        Total Price:
                </Typography>
                    <Typography style={{ fontWeight: 'bold' }}>
                        ${cart.totalPrice}
                </Typography>
                </Box>
                <Box width="80%" margin="auto">
                    <Button onClick={()=>history.push('/checkout')} style={{ padding: '10px 0' }} color='primary' variant="contained" fullWidth>Proceed To Checkout</Button>
                </Box>
                <Button onClick={()=>history.push('/cart')} color='primary' fullWidth>View Cart</Button>
            </Hide>
        </Box>
    )
}
