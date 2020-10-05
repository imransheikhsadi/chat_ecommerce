export const routes = {
    DASHBOARD: 'DASHBOARD',
    CREATE_PRODUCT: 'CREATE_PRODUCT',
    VIEW_PRODUCTS: 'VIEW_PRODUCTS',
    EDIT_PRODUCT: 'EDIT_PRODUCT',
    PROFILE: 'PROFILE',
    MAKE_MODARATOR: 'MAKE_MODARATOR',
    ADMIN_LIST: 'ADMIN_LIST',
    VIEW_ORDERS: 'VIEW_ORDERS',
    SITE_PROPERTIES: 'SITE_PROPERTIES',
    COUPON: 'COUPON',
}


export const catchAsync = (fn, errBackup) => {
    return (...params) => {
        return fn(...params).then((res) => res).catch(err => {console.log(err) })
    }
}

export const checkStatus = (res) => {
    if (!res) return false;
    return res.data.status === 'success'
}

export const extractFilter = (primaryObject, substractObject) => {
    const obj1 = { ...primaryObject }
    const obj2 = {...substractObject}

    Object.keys(obj1).forEach(key => {
        if (obj1[key] === obj2[key]) {
            delete obj1[key]
        }
    });

    return obj1
}

export const filter = (obj,...fields)=> {
    const newObj = {};
    fields.forEach(field=>{
        if(obj[field]){
            newObj[field] = obj[field]
        }
    });

    return newObj;
}

export const subTract = (obj,...fields)=> {
    const newObj = {...obj};
    fields.forEach(field=>{
        delete newObj[field]
    });

    return newObj;
}

export const queryBuilder = (obj)=>{
    if(Object.keys(obj).length === 0)return '';
    const query = Object.keys(obj).map(key=> `${key}=${obj[key]}`).join('&')
    return `?${query}`;
}