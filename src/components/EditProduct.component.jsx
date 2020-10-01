import React from 'react'
import MakeProduct from './MakeProduct.component'
import { useRecoilState } from 'recoil'
import { updateProductState, alertSnackbarState } from '../recoil/atoms'
import {  checkStatus, extractFilter } from '../utils'
import { updateProduct } from '../request/product.request'
import { useSetRecoilState } from 'recoil'
import { useFetch } from '../customHooks'


export default function EditProduct() {
    const fetch = useFetch();
    const [product] = useRecoilState(updateProductState)
    const setAlert = useSetRecoilState(alertSnackbarState);

    const handleUpdate = async(updatedProduct)=>{
        updatedProduct.imageObject = product.image;
        const response = await fetch(()=>updateProduct(extractFilter(updatedProduct,product),product._id))
        if(checkStatus(response)){
            setAlert({open: true,message: 'Product Updated Successfully',severity: 'success'})
        }
    }
    return (
        <>
            <MakeProduct {...product} pageTitle="Update Product" buttonTitle="Update Product"  getProduct={handleUpdate}/>
        </>
    )
}
