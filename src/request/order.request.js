import request from "./request";
import { catchAsync } from "../utils";

export const getOrders = catchAsync(async (query)=>{
    const response = await request({},`/orders${query}`,'GET')
    return response;
});

export const updateOrder = catchAsync(async (data,id)=>{
    const response = await request(data,`/orders/${id}`,'POST')
    return response;
});