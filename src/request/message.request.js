import request from "./request";
import { catchAsync, queryBuilder } from "../utils";

export const createMessage = catchAsync(async (data)=>{
    const response = await request(data,`/messages`)
    return response;
});

export const getMessages = catchAsync(async (data,query)=>{
    const response = await request(data,`/messages/get${queryBuilder(query)}`)
    return response;
});

export const getGroupMessages = catchAsync(async (data,query)=>{
    const response = await request(data,`/messages/group${queryBuilder(query)}`)
    return response;
});