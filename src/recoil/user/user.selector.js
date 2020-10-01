const { selector } = require("recoil");
const { CART } = require("./user.keys");
const { userCartState } = require("./user.atoms");

export const cartState = selector({
    key: CART,
    get: ({ get }) => {
        const usercart = get(userCartState);
        const products = [];
        let totalPrice = 0;
        let totalQuantity = 0;
        usercart.forEach((item) => {
            const count = item.count
            const subTotal = item.price * count;
            totalQuantity = totalQuantity + count;
            totalPrice = totalPrice + (item.price * count)
            products.push({ subTotal, ...item })

        })

        return { totalPrice, totalQuantity, products };
    }
})