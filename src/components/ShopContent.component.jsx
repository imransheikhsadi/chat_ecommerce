import React from 'react'
import { Typography, MenuItem, Box, Menu, Button, ButtonGroup } from '@material-ui/core'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Pagination from '@material-ui/lab/Pagination/Pagination';
import CropSquareIcon from '@material-ui/icons/CropSquare';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import { useState } from 'react';
import { checkStatus, queryBuilder } from '../utils';
import Showcase from './Showcase.component';
import ShopCard from '../molecules/ShopCard.mole';
import SortIcon from '@material-ui/icons/Sort';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { sideDrawerState, shopQueryState } from '../recoil/atoms';
import LazySkeleton from './LazySkeleton.component';
import { useEffect } from 'react';
import { getProducts } from '../request/product.request';
import Hide from '../molecules/Hide.mole';
import { useFetch, useIsInit } from '../customHooks';


const single = { xs: 12, sm: 12, md: 6, lg: 6 }
const double = { xs: 12, sm: 6, md: 6, lg: 4 }
const max = { xs: 12, sm: 6, md: 4, lg: 3 }

export default function ShopContent() {
    const fetch = useFetch();
    const [limitEl, setLimitEl] = useState(null);
    const [breakPoints, setBreakPoints] = useState(max);
    const setSideBarOpen = useSetRecoilState(sideDrawerState)
    const [shopItems, setShopItems] = useState([]);
    const [shopQuery, setShopQuery] = useRecoilState(shopQueryState);
    const [loading, setLoading] = useState(true)
    const [totalProducts,setTotalProducts] = useState(-1);

    useEffect(() => {
        fetchProducts()
    }, [shopQuery])

    const fetchProducts = async () => {
        const response = await fetch(getProducts,queryBuilder(shopQuery),setLoading);
        if (checkStatus(response)) {
            setShopItems(response.data.products)
            setTotalProducts(response.data.total)
        }
        console.log(response)
    }

    const handleLimit = (limit)=>{
        setShopQuery({...shopQuery,limit: limit})
    }

    return (
        <div>
            <Box display="flex" justifyContent="space-between" className="">
                <Typography variant="h5">
                    Products({totalProducts})
                </Typography>
                <Box display={{ xs: 'none', md: 'block' }} className="">

                    <ButtonGroup>
                        <Button
                            endIcon={
                                <KeyboardArrowDownIcon />
                            }>
                            All
                        </Button>
                        <Button onClick={() => setBreakPoints(single)}>
                            <CropSquareIcon />
                        </Button>
                        <Button onClick={() => setBreakPoints(double)}>
                            <ViewModuleIcon />
                        </Button>
                        <Button onClick={() => setBreakPoints(max)}>
                            <ViewComfyIcon />
                        </Button>
                    </ButtonGroup>
                </Box>
                <Box display={{ xs: 'block', md: 'none' }}>
                    <Button
                        startIcon={
                            <SortIcon />
                        }
                        onClick={() => setSideBarOpen(true)}
                    >
                        Filter
                    </Button>
                </Box>
            </Box>
            <Box my={4}>
                <Hide hide={loading} fallback={
                    <LazySkeleton breakPoints={breakPoints} items={shopQuery.limit} width="100%" height={380} />
                }>
                    <Showcase
                        component={
                            <ShopCard width="100%" />
                        }
                        items={shopItems}
                        title={null}
                        breakPoints={breakPoints}

                    />
                </Hide>
            </Box>
            <Box mb={3} display="flex" justifyContent="center">
                    <Button 
                        style={{textTransform: 'capitalize'}} 
                        onClick={(e)=>setLimitEl(e.currentTarget)}
                        endIcon={<KeyboardArrowDownIcon/>}
                    >
                        Product Per Page - {shopQuery.limit}
                    </Button>
                    <Menu
                        anchorEl={limitEl}
                        open={Boolean(limitEl)}
                        onClose={()=>setLimitEl(null)}
                        value={shopQuery.limit}
                        
                    >
                        {[8,16,32].map(item=>
                            <MenuItem key={item} onClick={()=>handleLimit(item)}>{item}</MenuItem>
                        )}
                    </Menu>
                    <Pagination defaultPage={1} page={shopQuery.page} onChange={(_,next)=>setShopQuery({...shopQuery,page: next})}  count={Math.ceil(totalProducts/shopQuery.limit)} />
                </Box>
        </div>
    )
}
