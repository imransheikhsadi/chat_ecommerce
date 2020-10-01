import React, { useRef } from 'react'
import ControlledAccordion from '../molecules/ControlledAccordion.mole'
import { Typography, Box, List, ListItem, Slider } from '@material-ui/core'
import Size from '../molecules/Size.mole'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { propertyState, shopQueryState } from '../recoil/atoms'
import { useIsInit } from '../customHooks'
import { useRecoilValue } from 'recoil'
import { subTract } from '../utils'



export default function Sidebar() {

    const [priceRange, setPriceRange] = useState([60, 4000])
    const property = useRecoilValue(propertyState);
    const [sortby, setSortby] = useState('')
    const [catagory, setCatagory] = useState('')
    const [productType, setProductType] = useState('')
    const [size, setSize] = useState('')
    const [brand, setBrand] = useState('')
    const [shopQuery, setShopQuery] = useRecoilState(shopQueryState);
    const isInit = useIsInit();
    const timer = useRef();

    // useEffect(() => {
    //     if (!isInit) {
    //         setShopQuery(pre => {
    //             return {
    //                 ...pre,
    //                 sort: sortby
    //             }
    //         })
    //     }
    // }, [sortby])


    // useEffect(() => {
    //     if (!isInit) {
    //         clearTimeout(timer.current);
    //         timer.current = setTimeout(() => {
    //             setShopQuery(pre => {
    //                 return {
    //                     ...pre,
    //                     'price[lte]': priceRange[1],
    //                     'price[gte]': priceRange[0],
    //                 }
    //             })
    //         }, 600)
    //     }
    // }, [priceRange])


    useEffect(() => {
        if (!isInit) {
            setShopQuery(pre => {
                if(catagory === '')return subTract(pre,'catagory')
                return {
                    ...pre,
                    catagory: catagory
                }
            })
        }
    }, [catagory])

    // useEffect(() => {
    //     if (!isInit) {
    //         setShopQuery(pre => {
    //             if(brand === '')return subTract(pre,'brand')
    //             return {
    //                 ...pre,
    //                 brand,
    //             }
    //         })
    //     }
    // }, [brand])

    // useEffect(() => {
    //     if (!isInit) {
    //         setShopQuery(pre => {
    //             if(productType === '')return subTract(pre,'productType')
    //             return {
    //                 ...pre,
    //                 productType: productType
    //             }
    //         })
    //     }
    // }, [productType])

    // useEffect(() => {
    //     if (!isInit) {
    //         setShopQuery(pre => {
    //             if(size === '')return subTract(pre,'size')
    //             return {
    //                 ...pre,
    //                 size
    //             }
    //         })
    //     }
    // }, [size])

    return (
        <Box>
            <ControlledAccordion title={
                <Typography component="span">
                    Catagories
                </Typography>
            }>
                <List dense={true} >
                    {property.catagories.map((item, i) =>
                        <ListItem key={i} selected={shopQuery?.catagory === item} onClick={() => setCatagory(item)} button={true}>
                            {item.toUpperCase()}
                        </ListItem>

                    )}
                    <ListItem onClick={() => setCatagory('')} button={true}>
                        REST
                    </ListItem>
                </List>
            </ControlledAccordion>
            {/* <ControlledAccordion title={
                <Typography component="span">
                    Product Type
                </Typography>
            }>

                <List dense={true} >
                    {property.productTypes.map(item =>
                        <ListItem key={item} selected={shopQuery?.productType === item} onClick={() => setProductType(item)} button={true}>
                            {item.toUpperCase()}
                        </ListItem>
                    )}
                    <ListItem onClick={() => setProductType('')} button={true}>
                        REST
                    </ListItem>
                </List>
            </ControlledAccordion> */}
            {/* <ControlledAccordion title={
                <Typography component="span">
                    Brands
                </Typography>
            }>

                <List dense={true} >
                    {property.brands.map(item =>
                        <ListItem key={item} selected={shopQuery?.brand === item} onClick={() => setBrand(item)} button={true}>
                            {item.toUpperCase()}
                        </ListItem>
                    )}
                    <ListItem onClick={() => setBrand('')} button={true}>
                        REST
                    </ListItem>
                </List>
            </ControlledAccordion> */}
            {/* <ControlledAccordion title={
                <Typography component="span">
                    Sort By
                </Typography>
            }>

                <List dense={true} >
                    <ListItem selected={sortby === '-price'} onClick={() => setSortby('-price')} button={true}>
                        Highest Price
                    </ListItem>
                    <ListItem selected={sortby === 'price'} onClick={() => setSortby('price')} button={true}>
                        Lowest Price
                    </ListItem>
                </List>
            </ControlledAccordion> */}
            {/* <ControlledAccordion title={
                <Typography component="span">
                    Price
                </Typography>

            }>

                <Slider
                    value={priceRange}
                    min={0}
                    max={4000}
                    aria-labelledby="range-slider"
                    onChange={(e, v) => setPriceRange(v)}
                    valueLabelDisplay="auto"
                    marks={[
                        {
                            value: 0,
                            label: 'Low'
                        },
                        {
                            value: 4000,
                            label: 'High'
                        }
                    ]}

                />

            </ControlledAccordion> */}
            {/* <ControlledAccordion title={
                <Typography component="span">
                    Colors
                </Typography>

            }>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <Color color="red" />
                    <Color color="blue" />
                    <Color color="green" />
                    <Color color="orange" />

                </div>

            </ControlledAccordion> */}
            {/* <ControlledAccordion title={
                <Typography component="span">
                    Size
                </Typography>

            }>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {property.sizes.map((item, i) =>
                        <Size selected={size === item} key={i} onClick={() => setSize(item)} size={item.toUpperCase()} />
                    )}
                    <Size onClick={() => setSize('')} size={'-'} />
                </div>

            </ControlledAccordion> */}
        </Box>
    )
}
