import { catchAsync } from "../utils";
import request from "./request";

export const createProduct = catchAsync(async (newProduct)=>{
    const response = await request(newProduct,'/products')
    return response;
});

export const getProducts = catchAsync(async (query='')=>{
    const response = await request({},`/Products${query}`,'GET')
    return response;
});

export const updateProduct = catchAsync(async (updatedProduct,id)=>{
    const response = await request(updatedProduct,`/Products/${id}`,'PATCH')
    return response;
});

export const deleteProduct = catchAsync(async (id)=>{
    const response = await request({},`/Products/${id}`,'DELETE')
    return response;
});

export const getProduct = catchAsync(async (id)=>{
    const response = await request({},`/Products/${id}`,'GET')
    return response;
});

export const checkoutRequest = catchAsync(async (data)=>{
    const response = await request(data,`/products/checkout`,'POST')
    return response;
});

export const searchProduct = catchAsync(async (key)=>{
    const response = await request({},`/products?search=${key}`,'GET')
    return response;
});