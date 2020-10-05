import request from "./request"
import { catchAsync } from "../utils"

export const createReview = catchAsync(async (data) => {
    const response = await request(data, `/reviews`);
    return response;
});