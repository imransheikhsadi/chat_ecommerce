import { atom } from "recoil";
import { SINGLE_PRODUCT_ID } from "./product.keys";

export const singleProductId= atom({
    key: SINGLE_PRODUCT_ID,
    default: null
});