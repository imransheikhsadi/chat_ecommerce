import { Box, Button, ButtonGroup, Container, fade, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, TextField, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { catchAsync, checkStatus } from '../utils';
import { getSiteProperties, updateSiteProperties } from '../request/other.request';
import { useIsInit } from '../customHooks';

const createStyles = makeStyles(theme => ({
    item: {
        backgroundColor: fade(theme.palette.text.secondary, .1),
        marginBottom: 2
    }
}))

export default function SiteProperties() {

    const classes = createStyles()
    const [catagories, setCatagories] = useState([]);
    const [catagory, setCatagory] = useState();
    const [sizes, setSizes] = useState([]);
    const [size, setSize] = useState();
    const [brand, setBrand] = useState();
    const [productTypes,setProductTypes] = useState([])
    const [productType,setProductType] = useState()
    const [brands,setBrands] = useState([])
    const isInit = useIsInit()


    useEffect(() => {
        catchAsync(async () => {
            const response = await getSiteProperties();
            if (checkStatus(response)) {
                console.log(response.data)
                setCatagories(response.data.siteProperties.catagories)
                setSizes(response.data.siteProperties.sizes)
                setProductTypes(response.data.siteProperties.productTypes)
                setBrands(response.data.siteProperties.brands)
            }
        })()
    }, [])

    useEffect(() => {
        if (!isInit) {
            catchAsync(async () => {
                await updateSiteProperties({ catagories });
            })()
        }
    }, [catagories])
    useEffect(() => {
        if (!isInit) {
            catchAsync(async () => {
                await updateSiteProperties({ sizes });
            })()
        }
    }, [sizes])

    useEffect(() => {
        if (!isInit) {
            catchAsync(async () => {
                await updateSiteProperties({ productTypes });
            })()
        }
    }, [productTypes])

    useEffect(() => {
        console.log({brands})
        if (!isInit) {
            catchAsync(async () => {
                await updateSiteProperties({ brands });
            })()
        }
    }, [brands])

    useEffect(()=>{
        console.log({brand})
    },[brand])


    const handleCatagory = (e) => {
        setCatagory(e.currentTarget.value.toLowerCase());
    }

    const handleCatagories = () => {
        if (catagory && catagory !== '') {
            setCatagory('')
            setCatagories([...catagories.filter(val => val !== catagory), catagory])
        }
    }

    const handleCatagoryRemove = (name) => {
        setCatagories(catagories.filter(val => name !== val))
    }

    const handleSizeRemove = (name) => {
        setSizes(sizes.filter(val => name !== val))
    }

    const handleSizes = () => {
        if (size && size !== '') {
            setSize('')
            setSizes([...sizes.filter(val => val !== size), size])
        }
    }

    const handleProductTypes = () => {
        if (productType && productType !== '') {
            setProductType('')
            setProductTypes([...productTypes.filter(val => val !== productType), productType])
        }
    }

    const handleBrands = () => {
        if (brand && brand !== '') {
            setBrand('')
            setBrands([...brands.filter(val => val !== brand), brand])
        }
    }


    return (
        <div>
            <Box my={3}>
                <Typography variant="h4" align="center">
                    Site Properties
                </Typography>
            </Box>
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Typography variant="h5">
                            Catagories
                        </Typography>
                        <List>
                            {catagories.map((name, i) =>
                                <ListItem key={i} className={classes.item}>
                                    <ListItemText primary={name.toUpperCase()} />
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={() => handleCatagoryRemove(name)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )}
                        </List>
                        <Box>
                            <ButtonGroup>
                                <Box flexGrow={1}>
                                    <TextField placeholder="Add a catagory" onChange={handleCatagory} value={catagory} size="small" variant="outlined" />
                                </Box>
                                <Button onClick={handleCatagories} variant="outlined">
                                    <AddIcon />
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="h5">
                            Sizes
                        </Typography>
                        <List>
                            {sizes.map((name, i) =>
                                <ListItem key={i} className={classes.item}>
                                    <ListItemText primary={name.toUpperCase()} />
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={() => handleSizeRemove(name)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )}
                        </List>
                        <Box>
                            <ButtonGroup>
                                <Box flexGrow={1}>
                                    <TextField placeholder="add new size" onChange={(e) => setSize(e.currentTarget.value.toLowerCase())} value={size} size="small" variant="outlined" />
                                </Box>
                                <Button onClick={handleSizes} variant="outlined">
                                    <AddIcon />
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="h5">
                            Product Types
                        </Typography>
                        <List>
                            {productTypes.map((name, i) =>
                                <ListItem key={i} className={classes.item}>
                                    <ListItemText primary={name.toUpperCase()} />
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={() => handleSizeRemove(name)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )}
                        </List>
                        <Box>
                            <ButtonGroup>
                                <Box flexGrow={1}>
                                    <TextField placeholder="add new product type" onChange={(e) => setProductType(e.currentTarget.value.toLowerCase())} value={productType} size="small" variant="outlined" />
                                </Box>
                                <Button onClick={handleProductTypes} variant="outlined">
                                    <AddIcon />
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                    <Typography variant="h5">
                            Brands
                        </Typography>
                        <List>
                            {brands.map((name, i) =>
                                <ListItem key={i} className={classes.item}>
                                    <ListItemText primary={name.toUpperCase()} />
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={() => setBrands(brands.filter(val => name !== val))}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )}
                        </List>
                        <Box>
                            <ButtonGroup>
                                <Box flexGrow={1}>
                                    <TextField placeholder="Add new Brand" onChange={(e) => setBrand(e.currentTarget.value.toLowerCase())} value={brand} size="small" variant="outlined" />
                                </Box>
                                <Button onClick={handleBrands} variant="outlined">
                                    <AddIcon />
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}
