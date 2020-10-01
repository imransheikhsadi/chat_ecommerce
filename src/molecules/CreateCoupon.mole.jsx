import React, { useEffect, useRef, useState } from 'react'
import CachedIcon from '@material-ui/icons/Cached';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { TreeItem, TreeView } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Avatar, Box, Button, ButtonGroup, Checkbox, Chip, Dialog, FormControlLabel, TextField, Typography } from '@material-ui/core'
import { useRecoilValue } from 'recoil';
import { alertSnackbarState, loaderState, propertyState, searchOpenState } from '../recoil/atoms';
import { catchAsync, checkStatus, randomString } from '../utils';
import { createCoupon } from '../request/other.request';
import { useSetRecoilState } from 'recoil';
import ProductSearch from './ProductSearch.mole';


export default function CreateCoupon({ newCouponOpen, setNewCouponOpen,setCoupons }) {
    const { catagories, productTypes, brands, _id } = useRecoilValue(propertyState);
    const [selectByGroupOpen, setSelectBygroupOpen] = useState(false)
    const [validationDate, setValidationDate] = useState(new Date());
    const [purchaseLimit, setPurchaseLimit] = useState('0');
    const [allChecked, setAllChecked] = useState(true);
    const [discount,setDiscount] = useState();
    const [selectBygroup, setSelectBygroup] = useState(null);
    const [code,setCode] = useState(randomString(30));
    const setLoader = useSetRecoilState(loaderState);
    const setAlert = useSetRecoilState(alertSnackbarState);
    const [validFor,setValidFor] = useState({all: 'all',catagories: [],productTypes: [],brands: [],id:[]});
    const [idInput,setIdInput] = useState('')
    const [idInputOpen,setIdInputOpen] = useState(false)
    const setSearchOpen = useSetRecoilState(searchOpenState);
    const formRef = useRef();

    const keys = Object.keys(validFor);

    useEffect(() => {
        if (_id && selectBygroup === null) {
            setSelectBygroup({ catagories, productTypes, brands })
        }
    }, [catagories])

    useEffect(() => {
        console.log(validFor)
    }, [validFor])

    useEffect(() => {
        if(!allChecked){
        const obj = {...validFor}
            delete obj.all
            setValidFor(obj)
        }else{
            setValidFor({...validFor,all: 'All'})
        }
    }, [allChecked])

    const handleSelectGroup = (key, val) => {
        const obj = { ...selectBygroup }
        obj[key] = obj[key].filter(item => item !== val)
        setSelectBygroup(obj)

        const newObj = {...validFor}
        newObj[key] = selectBygroup[key].filter(item => {
            console.log(item===val)
            return item === val
        })
        newObj[key] = [...validFor[key],...newObj[key]]
        setValidFor(newObj)
    }

    const handlePurchaseLimit = (e) => {
        if (e.target.value >= 0) {
            setPurchaseLimit(e.target.value)
        }
    }

    const handleDiscount = (e)=>{
        if(e.target.value*1 >= 1){
            setDiscount(e.target.value*1)
        }
    }

    const handleCreate = catchAsync(async(event)=>{
        event.preventDefault();

        if(code && code !== ''){
            setNewCouponOpen(false)
            setLoader(true)
            const response = await createCoupon({ code,discount,expiresIn: validationDate,limit: purchaseLimit,validFor})
            setLoader(false);
            if(checkStatus(response)){
                setCoupons(response.data.doc.coupons)
            }else{
                setAlert({open: true,message: response.data.message,severity: 'error'})
            }
        }
    });

    const handleIdAdd = (_,code)=>{
        setValidFor({...validFor,id: [...validFor.id.filter(item=>item !== code),code]})
    }


    return (
        <div>
            <Dialog open={newCouponOpen} onClose={() => setNewCouponOpen(false)}>
                <Box m={3}>
                    <form ref={formRef} onSubmit={handleCreate}>
                        <Box mb={1}>
                            <ButtonGroup >
                                <TextField required value={code} onChange={e=>setCode(e.target.value)} fullWidth variant="outlined" placeholder="Coupon Code" />
                                <Button onClick={()=>setCode(randomString(30))}>
                                    <CachedIcon />
                                </Button>
                            </ButtonGroup>
                        </Box>
                        <Box mb={1}>
                            <TextField required value={discount} onChange={handleDiscount} fullWidth type="number" variant="outlined" placeholder="Coupon Discount" />
                        </Box>
                        <Box>
                            <Box mb={1}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        label="Coupon Expire Date"
                                        fullWidth
                                        disablePast
                                        value={validationDate}
                                        onChange={(d) => setValidationDate(d)}
                                    />
                                </MuiPickersUtilsProvider>
                            </Box>
                            <Box mb={1}>
                                <TextField value={purchaseLimit} onChange={handlePurchaseLimit} fullWidth type="number" label="Purchase Limit" helperText="0 means unlimited" />
                            </Box>
                            <Box>
                                <Box mb={1} justifyContent="space-between" alignItems="center" display="flex">
                                    <Typography color="textSecondary">Token will Be available for</Typography>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={e => setAllChecked(e.target.checked)}
                                                color="primary"
                                                checked={allChecked}
                                            />
                                        }
                                        label="All"
                                        labelPlacement="start"
                                    />
                                </Box>
                                {!Boolean(validFor.all) && <Box maxWidth={280} m={'auto'}>
                                    {keys.map(key=>
                                        [...validFor[key]].map(item=><Chip style={{margin: 2}} color="primary" size="small" avatar={<Avatar>{key.split('').slice(0,1).join('').toUpperCase()}</Avatar>} key={`${key}-${item}`} label={item} />)
                                    )}
                                </Box>}
                                <Box>
                                    <Typography color="textSecondary">Select by</Typography>
                                    <ButtonGroup disabled={allChecked} fullWidth >
                                        <Button onClick={() => setSelectBygroupOpen(true)}>Group</Button>
                                        <Button onClick={() => setIdInputOpen(true)}>ID</Button>
                                        <Button onClick={()=>  setSearchOpen(true)}>Search</Button>
                                    </ButtonGroup>
                                </Box>
                            </Box>
                            <Box mt={2}>
                                <Button onClick={()=>formRef.current.requestSubmit()} fullWidth color="primary" variant="contained">Create</Button>
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Dialog>
            <Dialog open={selectByGroupOpen} onClose={() => setSelectBygroupOpen(false)}>
                <Box p={3}>
                    <TreeView
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                    >
                        <TreeItem nodeId="A" label="Catagories">
                            {selectBygroup?.catagories.map((item, i) =>
                                <TreeItem onClick={() => handleSelectGroup('catagories', item)} key={`A${i}`} nodeId={`${i}`} label={item} />
                            )}
                        </TreeItem>
                        <TreeItem nodeId="B" label="Product Types">
                            {selectBygroup?.productTypes.map((item, i) =>
                                <TreeItem onClick={() => handleSelectGroup('productTypes', item)} key={`B${i}`} nodeId={`${i}`} label={item} />
                            )}
                        </TreeItem>
                        <TreeItem nodeId="C" label="Brands">
                            {selectBygroup?.brands.map((item, i) =>
                                <TreeItem onClick={() => handleSelectGroup('brands', item)} key={`C${i}`} nodeId={`${i}`} label={item} />
                            )}
                        </TreeItem>
                    </TreeView>
                </Box>
            </Dialog>
            <Dialog open={idInputOpen} onClose={()=>setIdInputOpen(false)}>
                <Box p={3}>
                    <TextField value={idInput} onChange={(e)=>setIdInput(e.target.value)} placeholder="Product ID" variant="outlined" />
                    <Box mt={2}>
                        <Button variant="contained" color="primary" fullWidth>ADD</Button>
                    </Box>
                </Box>
            </Dialog>
           <ProductSearch getId={handleIdAdd} />
        </div>
    )
}
