import React from 'react'
import MakeProduct from './MakeProduct.component';
import { catchAsync } from '../utils';
import { createProduct, searchProduct } from '../request/product.request';
import { useFetch } from '../customHooks';
import { useSetRecoilState } from 'recoil';
import { alertSnackbarState } from '../recoil/atoms';


export default function CreateProduct() {

    const fetch = useFetch();
    const setAlert = useSetRecoilState(alertSnackbarState);

    const handleProduct = catchAsync(async(product)=>{

        const response = await fetch(createProduct,product);
        
        if(response.data.status === 'success'){
            setAlert({open: true,message: 'Product Created Successfully',severity: 'success'})
        }
        
    });
    return (
        <>
            <MakeProduct pageTitle="Create Product" buttonTitle="Create Product" getProduct={handleProduct} />
        </>
    )
}
