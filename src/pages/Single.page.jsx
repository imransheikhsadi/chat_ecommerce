import React from 'react'
import Magnifier from '../molecules/Magnifier.mole'
import { catchAsync, checkStatus } from '../utils'
import { Container, Breadcrumbs, Link, Grid, Box, MenuItem, MenuList, Typography, ButtonGroup, Button, FormControlLabel, Checkbox, Backdrop, CircularProgress}  from '@material-ui/core'
import Carousel from '../components/Carousel.component'
import Keyvalue from '../molecules/Keyvalue.mole'
import VarientColor from '../molecules/VarientColor.mole'
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useEffect } from 'react'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { singleProductId } from '../recoil/product/product.aton'
import { useSetRecoilState } from 'recoil'
import { loaderState, alertSnackbarState } from '../recoil/atoms'
import { getProduct } from '../request/product.request'
import { userCartState, userState } from '../recoil/user/user.atoms'
import { Redirect, useHistory } from 'react-router-dom'
import { useRecoilValue } from 'recoil'


export default function Single() {

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));
    const [product, setProduct] = useState(null)
    const [productId] = useRecoilState(singleProductId);
    const setLoader = useSetRecoilState(loaderState);
    const [userCart, setUserCart] = useRecoilState(userCartState);
    const [cartQuantity, setCartQuantity] = useState(0);
    const history = useHistory();
    const user = useRecoilValue(userState);
    const setAlert = useSetRecoilState(alertSnackbarState);


    useEffect(() => {
        const currentProduct = userCart.filter(item => item._id === product?._id)?.[0];

        if (currentProduct && currentProduct.count) {
            setCartQuantity(currentProduct.count)
        } else {
            setCartQuantity(0)
        }
    }, [userCart]);

    useEffect(() => {
        if (productId) {
            catchAsync(async () => {
                setLoader(true)
                const response = await getProduct(productId)
                setLoader(false)
                if (checkStatus(response)) {
                    setProduct(response.data.product)
                }
            })()
        }
    }, [productId]);

    const handleRemove = () => {
        setUserCart(pre => pre.map(item => product._id === item._id ? { ...item, count: item.count - 1 } : item).filter(item => item.count !== 0))
    }

    const addCartItem = () => {
        setUserCart((pre) => {
            const ids = pre.map(item => product._id);
            const arr = [...pre].map(item => {
                if (product._id === item._id) {
                    return { ...item, count: item.count + 1 }
                } else {
                    return item;
                }
            })
            if (!ids.includes(product._id)) return [...arr, { ...product, count: 1 }]
            return arr;
        });
    }

    const handleBuy = () => {
        if (!user) {
            setAlert({ open: true, message: 'Please Log in To Buy' })
        } else if (userCart.length === 0) {
            setAlert({ open: true, message: 'Add at least One Product To the Cart' })
        } else {
            history.push('/checkout')
        }
    }

    if (!productId) return <Redirect to="/shop" />

    if (!product) return (
        <Box width="100%" height="80vh">
            <Backdrop style={{ zIndex: 15 }} open={true}>
                <CircularProgress />
            </Backdrop>
        </Box>
    )

    return (
        <div>
            <div className="">
                <Container>
                    <div style={{ padding: '15px 0' }}>
                        <Breadcrumbs>
                            <Link  color="inherit">
                                Shop
                            </Link>
                            <Link color="inherit">
                                {product?.catagory?.toUpperCase()}
                            </Link>
                            <Link color="textPrimary">
                                {product.name.toUpperCase()}
                            </Link>
                        </Breadcrumbs>
                        <div className="">
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Grid container>
                                        <Grid style={{ display: matches ? 'none' : 'initial' }} item xs={2}>
                                            <div>
                                                <MenuList open={true} >
                                                    {product.image.card.map(url =>
                                                        <MenuItem>
                                                            <img style={{ width: '100%' }} src={url} alt="" />
                                                        </MenuItem>
                                                    )}
                                                </MenuList>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={10} className="">
                                            <Box mt={3}>
                                                <Carousel
                                                    component={<Magnifier />}
                                                    customStyle={{ buttonDots: { bottom: -60 }, buttonNext: { display: 'none' }, buttonPrev: { display: 'none' } }}
                                                    data={product.image.original.map(url => ({ image: url }))}
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <div className="">
                                        <Keyvalue items={{ Sku: product.productCode, Availability: `${product.quantity} in stock` }} />
                                    </div>
                                    <Box mt={5}>
                                        <Typography variant="h4">
                                            {product.name}
                                        </Typography>
                                        <Typography color="primary" variant="h4">
                                            ${product.price}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Tax Included
                                        </Typography>
                                    </Box>
                                    <Box mt={5}>
                                        <Keyvalue items={{
                                            Color: <Typography component="span" color="primary">
                                                Black
                                            </Typography>
                                        }} />
                                        <Box >
                                            {product.image.small.map(url =>
                                                <VarientColor image={url} />
                                            )}
                                        </Box>
                                    </Box>
                                    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} mt={5}>
                                        <ButtonGroup size="large" fullWidth>
                                            <Button onClick={handleRemove}>
                                                <RemoveIcon />
                                            </Button>
                                            <Button color="primary">
                                                {cartQuantity}
                                            </Button>
                                            <Button onClick={addCartItem}>
                                                <AddIcon />
                                            </Button>
                                        </ButtonGroup>
                                        <div style={{ width: 20, height: 20 }} />
                                        <Button onClick={addCartItem} size="large" fullWidth variant="contained" color="primary">Add To Cart</Button>
                                    </Box>
                                    <Box mt={3}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    color="primary"
                                                />
                                            }
                                            label="I agree with the terms and conditions "
                                        />
                                    </Box>
                                    <div className="">
                                        <Button onClick={handleBuy} size="large" fullWidth variant="contained" color="textSecondary">
                                            Buy Now
                                        </Button>
                                    </div>
                                    <Box mt={2}>
                                    </Box>

                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    )
}
