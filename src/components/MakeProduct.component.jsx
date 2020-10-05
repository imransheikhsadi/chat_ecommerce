import React, { useRef } from 'react'
import { makeStyles, Box, TextField, Grid, Paper, Typography, FormGroup, FormControl, FormLabel, Divider, IconButton, Button, ClickAwayListener, Container, Chip, Dialog, MenuItem } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import { useState } from 'react';
import Carousel from './Carousel.component';
import ImageUpload from './ImageUpload.component';
import { useEffect } from 'react';
import ImageIcon from '@material-ui/icons/Image';
import { useSetRecoilState } from 'recoil';
import { alertSnackbarState } from '../recoil/atoms';
import { catchAsync, checkStatus } from '../utils';
import { getSiteProperties } from '../request/other.request';

const createStyles = makeStyles(theme => ({
    root: {
        margin: 'auto',
        marginBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(3),
    },
    labelFix: {
        marginTop: 3
    },
    imageContainer: {
        maxWidth: 400,
        [theme.breakpoints.down(450)]: {
            maxWidth: 380
        },
        [theme.breakpoints.down(350)]: {
            maxWidth: 280
        }
    }
}));



export default function MakeProduct(props) {
    const setAlert = useSetRecoilState(alertSnackbarState);
    const classes = createStyles();
    const [productImage, setProductImage] = useState(props.productImage || []);
    const [name, setName] = useState(props.name);
    const [title, setTitle] = useState(props.title);
    const [price, setPrice] = useState(props.price);
    const [currentPrice, setCurrentPrice] = useState(props.currentPrice);
    const [basePrice, setBasePrice] = useState(props.basePrice);
    const [quantity, setQuantity] = useState(props.quantity);
    const [catagory, setCatagory] = useState(props.catagory);
    const [productCode, setProductCode] = useState(props.productCode);
    const [description, setDescription] = useState(props.description);
    const [tags, setTags] = useState(props.tags || []);
    const [newTag,setNewTag] = useState(null);
    const [tagPopoverOpen,setTagPopover] = useState(false);
    const [catagories,setCatagories] = useState([]);


    const submitRef = useRef();

    useEffect(()=>{
        catchAsync(async ()=>{
            const response = await getSiteProperties();
            if(checkStatus(response)){
                const {siteProperties} = response.data; 
                setCatagories(siteProperties.catagories)
                setCatagory(siteProperties.catagories[1])
            }
        })()
    },[])

    const handleFile = (file, url) => {
        setProductImage([...productImage, { src: url }])
    }

    const validate = (product, callback) => {
        if (product.image.length === 0) {
            setAlert({ open: true, message: 'Please Give A Product Image', severity: 'warning' })
            return;
        }
        callback();
    }


    const handleCreate = (event) => {
        event.preventDefault()
        const product = { description, image: productImage.map(obj => obj.src),tags, name, price, currentPrice, basePrice, catagory, quantity, title, productCode }
        validate(product, () => {
            props.getProduct(product);
        })

    }

    return (
        <Container maxWidth="md" className={classes.root}>
            <Box mt={2}>
                <Typography gutterBottom={3} align="center" component="h2" variant="h4">{props.pageTitle}</Typography>
            </Box>
            <form ref={submitRef} onSubmit={handleCreate}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField value={description} onChange={(e) => setDescription(e.currentTarget.value)} required fullWidth multiline label="Product Details" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box mx="auto" className={classes.imageContainer}>
                            {productImage.length === 0 ?
                                <Box height={470}>
                                    <Paper>
                                        <Box justifyContent="center" alignItems="center" height={470} display="flex" m="auto">
                                            <Box>
                                                <ImageIcon style={{ fontSize: 150 }} />
                                                <Typography>
                                                    Upload Product Image
                                            </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Box> :
                                <Carousel
                                    component={
                                        <img width="100%" alt="Product"/>
                                    }
                                    data={productImage}
                                />
                            }
                        </Box>
                        <Box mt={3}>
                            <Paper>

                                <Box p={3}>
                                    <ImageUpload fullWidth onUpload={handleFile} />
                                </Box>
                            </Paper>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper className={classes.paper}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <TextField required value={name} onChange={(e) => setName(e.currentTarget.value)} label="Product Name" fullWidth />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required value={title} onChange={(e) => setTitle(e.currentTarget.value)} label="Title" fullWidth />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField required onChange={(e) => setPrice(e.currentTarget.value)} value={price} type="number" label="Price" fullWidth />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField required onChange={(e) => setQuantity(e.currentTarget.value)} value={quantity} type="number" label="Quantiry" fullWidth />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField onChange={(e) => setCurrentPrice(e.currentTarget.value)} value={currentPrice} type="number" label="Current Price" fullWidth />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField onChange={(e) => setBasePrice(e.currentTarget.value)} value={basePrice} type="number" label="Base Price" fullWidth />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField required onChange={(e) => setProductCode(e.currentTarget.value)} value={productCode} label="Product Code" fullWidth />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        value={catagory}
                                        select fullWidth
                                        label="Catagory"
                                        onChange={e => setCatagory(e.target.value)}
                                    >
                                        {catagories.map(item =>
                                            <MenuItem key={item} value={item}>{item.toUpperCase()}</MenuItem>
                                        )}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider />
                                    <Box mt={1}>
                                        <FormControl>
                                            <FormLabel>Add Some Tags</FormLabel>
                                            <FormGroup row>
                                                {tags.map(tag => (
                                                    <Box mt={2} mr={1}>
                                                        <Chip onDelete={() => setTags(tags.filter(item=>item !== tag))} label={tag} variant="outlined" />
                                                    </Box>
                                                ))}
                                                <Box mt={1} style={{ marginLeft: -10 }}>
                                                    <IconButton onClick={()=>setTagPopover(true)}>
                                                        <AddIcon />
                                                    </IconButton>
                                                </Box>
                                            </FormGroup>
                                        </FormControl>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Box mt={3}>
                                <Button onClick={() => submitRef.current.requestSubmit()} color="primary" fullWidth variant="contained">{props.buttonTitle}</Button>
                            </Box>
                        </Paper>

                    </Grid>

                    <Dialog open={tagPopoverOpen}>
                        <ClickAwayListener onClickAway={() => setTagPopover(false)}>
                            <Paper style={{ padding: 20 }}>
                                <Typography gutterBottom variant="h6">
                                    Give a Proper Tag
                                </Typography>
                                <Box>
                                    <TextField label="Tag" onChange={e => setNewTag(e.currentTarget.value)} />
                                </Box>
                                <Box mt={2}>
                                    <Button onClick={() => {
                                        setTagPopover(false);
                                        if (newTag) {
                                            setTags([...tags, newTag])
                                        }
                                    }}
                                        color="primary"
                                        fullWidth variant="contained"
                                    >
                                        Submit
                                    </Button>
                                </Box>
                            </Paper>
                        </ClickAwayListener>
                    </Dialog>
                </Grid>
            </form>
        </Container>
    )
}
