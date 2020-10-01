import React from 'react'
import Showcase from '../components/Showcase.component'
import CartItem from '../components/CartItem.component'
import { Container, Typography, Box } from '@material-ui/core'
import { useRecoilValue } from 'recoil'
import { userCartState } from '../recoil/user/user.atoms'
import Hide from '../molecules/Hide.mole'
import { cartState } from '../recoil/user/user.selector'
import { useSetRecoilState } from 'recoil'

export default function Cart() {

    const cart = useRecoilValue(cartState);
    const setUserCart = useSetRecoilState(userCartState);

    const handleItemDelete = (id)=>{
        setUserCart(pre=>pre.filter(item=> item._id !== id))
    }

    const handleAdd = (id)=>{
        setUserCart(pre=>pre.map(item=>id === item._id ? {...item,count: item.count + 1} : item))

    }

    const handleRemove = (id)=>{
        setUserCart(pre=>pre.map(item=>id === item._id ? {...item,count: item.count - 1} : item).filter(item=> item.count !== 0))
    }

    return (
        <div>
            <Container maxWidth="lg">
                <Hide hide={cart.products.length === 0} fallback={
                    <Box p={6}>
                        <Typography align="center" variant="h4" color="textSecondary">
                            No Products To Show
                        </Typography>
                    </Box>
                }>
                    <Showcase
                        items={cart.products}
                        title="Shoping Cart"
                        component={<CartItem handleRemove={handleRemove} handleAdd={handleAdd} handleDelete={handleItemDelete} />}
                        breakPoints={{ xs: 12, sm: 12, md: 12, lg: 12 }}
                    />
                    <Box my={2}>
                        <Typography component="h1" variant="h5" align="right">
                            Total: ${cart.totalPrice}
                        </Typography>
                    </Box>
                </Hide>

            </Container>

        </div>
    )
}
