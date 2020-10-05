import React from 'react'
import ControlledAccordion from '../molecules/ControlledAccordion.mole'
import { Typography, Box, List, ListItem } from '@material-ui/core'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { propertyState, shopQueryState } from '../recoil/atoms'
import { useIsInit } from '../customHooks'
import { useRecoilValue } from 'recoil'
import { subTract } from '../utils'



export default function Sidebar() {

    const property = useRecoilValue(propertyState);
    const [catagory, setCatagory] = useState('')
    const [shopQuery, setShopQuery] = useRecoilState(shopQueryState);
    const isInit = useIsInit();


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
        </Box>
    )
}
