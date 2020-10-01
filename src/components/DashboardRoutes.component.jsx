import React from 'react'
import { useRecoilValue } from 'recoil'
import { dashboardRouteState } from '../recoil/atoms'
import { routes } from '../utils';
import CreateProduct from './CreateProduct.component';
import Dashboard from './Dashboard.component';
import ViewProducts from './ViewProducts.component';
import EditProduct from './EditProduct.component';
import Profile from './Profile.component';
import MakeModarator from './MakeModarator.component';
import AdminList from './AdminList.component';
import ViewOrders from './ViewOrders.component';
import SiteProperties from './SiteProperties.component';
import Coupon from './Coupon.component';
import { useIsModarator } from '../customHooks';

export default function DashboardRoutes() {

    const isModarator = useIsModarator();
    const route = useRecoilValue(dashboardRouteState);

    if(route === routes.CREATE_PRODUCT){
        return <CreateProduct/>
    }
    // if(route === routes.DASHBOARD){
    //     return <Dashboard/>
    // }
    if(route === routes.VIEW_PRODUCTS){
        return <ViewProducts/>
    }
    if(route === routes.EDIT_PRODUCT){
        return <EditProduct />
    }
    if(route === routes.MAKE_MODARATOR){
        return <MakeModarator />
    }
    if(route === routes.PROFILE){
        return <Profile />
    }
    if(route === routes.ADMIN_LIST){
        return <AdminList />
    }
    if(route === routes.VIEW_ORDERS){
        return <ViewOrders />
    }
    if(route === routes.SITE_PROPERTIES){
        return <SiteProperties />
    }
    // if(route === routes.COUPON){
    //     return <Coupon />
    // }
    if(isModarator){
        return  <ViewProducts/>
    }

    return <Profile/>;

}
