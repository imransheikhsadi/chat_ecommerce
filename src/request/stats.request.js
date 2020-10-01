import request from "./request"
import { catchAsync } from "../utils"

export const getStat = catchAsync(async (data,stat) => {
    const response = await request(data, `/stats/${stat}`);
    return response;
});