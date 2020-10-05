import React from 'react'
import { Card, CardMedia, IconButton, CardActions, makeStyles, fade, CardActionArea, Typography, Button, CardContent, Box } from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import Rating from '@material-ui/lab/Rating';
import ShoppingBasketOutlinedIcon from '@material-ui/icons/ShoppingBasketOutlined';
import VarientColor from './VarientColor.mole';
import { useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userCartState, userWishListState } from '../recoil/user/user.atoms';
import Skeleton from '@material-ui/lab/Skeleton';
import { useState } from 'react';
import Hide from './Hide.mole';
import { singleProductId } from '../recoil/product/product.aton';




const createClasses = makeStyles(theme => ({
    actions: {
        display: 'flex',
        position: 'absolute',
        flexDirection: 'column',
        opacity: 0,
        right: 0,
        transition: 'opacity 300ms',
        zIndex: 1,

        '& > *': {
            marginLeft: '0 !important',
            backgroundColor: fade(theme.palette.grey[400], .5),
            marginBottom: 8,
            transition: 'all 300ms',
            '&:hover': {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white
            }

        },
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },
    container: {
        position: 'relative',
        margin: 'auto',
        '&:hover $actions': {
            opacity: 1
        },
        '&:hover $cartButton': {
            opacity: 1,
        }
    },
    brand: {
        fontSize: 12,
        color: theme.palette.grey[500],
        textAlign: 'center'
    },
    name: {
        fontSize: 12
    },
    price: {
        fontWeight: 'bold'
    },
    small: {
        width: theme.spacing(4),
        height: theme.spacing(4)
    },
    varientSize: {
        borderRadius: 2,
        transition: 'all 300ms',
        width: 25,
        height: 25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white
        },
        '&:first-child': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white
        },
        '&:not(:last-child)': {
            marginRight: 3
        }
    },
    cartButton: {
        opacity: 0,
        marginTop: 15,
        transition: 'all 300ms',
        position: 'relative',

    },
    cardContent: {
        textAlign: 'center',
        backgroundColor: theme.palette.background.paper,
        transition: 'all 300ms',
        paddingBottom: '0 !important',
        '$container:hover &': {
            [theme.breakpoints.up('sm')]: {
                transform: 'translateY(-50px)'
            }
        }
    },
    cardMedia: {
        height: 'auto',
        width: '100%'
    }
}))

export default function ShopCard({ width = 280, item }) {
    const { image, brand, name, rating, price } = item;
    const classes = createClasses()
    const history = useHistory();
    const setCardItems = useSetRecoilState(userCartState);
    const setWishList = useSetRecoilState(userWishListState);
    const setproductID = useSetRecoilState(singleProductId);
    const [loading, setLoading] = useState(true);

    const addCartItem = () => {
        setCardItems((pre) => {
            const ids = pre.map(e => e._id);
            const arr = [...pre].map(product => {
                if (item._id === product._id) {
                    return { ...product, count: product.count + 1 }
                } else {
                    return product;
                }
            })
            if (!ids.includes(item._id)) return [...arr, { ...item, count: 1 }]
            return arr;
        });
    }

    const handleView = ()=>{
        setproductID(item._id)
        history.push('/single')
    }

    return (
        <Card className={classes.container} style={{ width: width }}>
            <CardActions className={classes.actions} >
                <IconButton onClick={handleView}>
                    <VisibilityIcon />
                </IconButton>
                {/* <IconButton onClick={addToWishList}>
                    <FavoriteIcon />
                </IconButton> */}
                {/* <IconButton>
                    <CompareArrowsIcon />
                </IconButton> */}
            </CardActions>
            <CardActionArea onClick={handleView}>
                <Hide hide={!loading}>
                    <Skeleton width="100%" variant="rect" height={280} />
                </Hide>
                <CardMedia style={{display: loading ? 'none': 'block' }} component="img" onLoad={(e) => setLoading(false)} classes={{ media: classes.cardMedia }} image={image.card[0]} />
            </CardActionArea>
            <CardContent className={classes.cardContent}>
                <Typography className={classes.brand}>
                    <span style={{ display: 'block' }}>{brand}</span>
                    <Rating readOnly={true} value={item.totalStar/item.totalReview} size="small" />
                </Typography>
                <Typography className={classes.name}>
                    {name}
                </Typography>
                <Typography className={classes.price}>
                    ${price}
                </Typography>
                <Box >
                    {
                        image.small.map((img,i) =>
                            <VarientColor key={i} image={img} />
                        )
                    }
                </Box>
                <Box display={{ xs: 'none', md: 'block' }} className={classes.cartButton}>
                    <Button onClick={addCartItem} style={{ position: 'absolute', width: 'max-content', transform: 'translate(-50%,0)' }} startIcon={<ShoppingBasketOutlinedIcon />} variant="contained" color="primary">Add To Cart</Button>
                </Box>
                <Box display={{ xs: 'block', md: 'none' }} style={{ margin: '15px 0' }}>
                    <Button onClick={addCartItem} startIcon={<ShoppingBasketOutlinedIcon />} variant="contained" color="primary">Add To Cart</Button>
                    <Box>
                        <IconButton>
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => setWishList(prev => [...prev, { name, image, rating, price, brand }])}>
                            <FavoriteIcon  />
                        </IconButton>
                        <IconButton>
                            <CompareArrowsIcon />
                        </IconButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}
