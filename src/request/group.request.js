import request from "./request";
import { catchAsync, queryBuilder } from "../utils";

export const createGroup = catchAsync(async (data)=>{
    const response = await request(data,`/groups`)
    return response;
});

export const getAllGroups = catchAsync(async (data)=>{
    const response = await request(data,`/groups`,'GET')
    return response;
});

