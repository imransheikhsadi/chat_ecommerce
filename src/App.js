import React, { lazy, Suspense, useEffect } from 'react';
import { ThemeProvider, CssBaseline, unstable_createMuiStrictModeTheme, Backdrop, CircularProgress, Typography } from '@material-ui/core';
// import { theme } from './theme';
import Home from './pages/Home.page';
import { RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil';
// import Shop from './pages/Shop.page';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import Single from './pages/Single.page';
import Header from './components/Header.component';
import Footer from './components/Footer.component';
// import Blog from './pages/Blog.page';
// import SingleBlog from './pages/SingleBlog.page';
// import Signin from './pages/Signin.page';
// import Signup from './pages/Signup.page';
import Cart from './pages/Cart.page';
// import Dashboard from './pages/Dashboard.page';
import { darkModeState, propertyState } from './recoil/atoms';
import { blue } from '@material-ui/core/colors';
import HideComponentOnRoute from './molecules/HideComponentOnRoute.mole';
import { catchAsync, checkStatus } from './utils';
import { checkUser } from './request/user.requset';
import { userState } from './recoil/user/user.atoms';
import Defaults from './components/Defaults.component';
import WishList from './pages/WishList.page';
import PasswordReset from './pages/PasswordReset.page';
// import Checkout from './pages/Checkout.page';
// import PaymentSuccess from './pages/PaymentSuccess.page';
import { getSiteProperties } from './request/other.request';

const Dashboard = lazy(() => import('./pages/Dashboard.page'));
const Checkout = lazy(() => import('./pages/Checkout.page'));
const Shop = lazy(() => import('./pages/Shop.page'));
const Signin = lazy(() => import('./pages/Signin.page'));
const Signup = lazy(() => import('./pages/Signup.page'));
const Single = lazy(() => import('./pages/Single.page'));




function App() {

  const darkMode = useRecoilValue(darkModeState);
  const setUser = useSetRecoilState(userState);
  const setProperty = useSetRecoilState(propertyState);

  const theme = unstable_createMuiStrictModeTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: blue.A400
      }
    }
  });

  console.log(theme)

  useEffect(() => {
    const checkMe = catchAsync(async () => {
      const response = await checkUser();
      const siteRes = await getSiteProperties();
      if (checkStatus(siteRes)) {
        setProperty(siteRes.data.siteProperties)
      }
      if (checkStatus(response)) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    });
    checkMe()
  }, [])

  return (

    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HideComponentOnRoute route={['/dashboard', '/checkout']} >
          <Header />
        </HideComponentOnRoute>
        <Suspense fallback={
            <Backdrop open={true}>
              <CircularProgress size={150} thickness={5} color="primary"/>
            </Backdrop>
        }>
          <Switch>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path="/resetPassword/:token">
              <PasswordReset />
            </Route>
            <Route path="/checkout">
              <Checkout />
            </Route>
            <Route path="/signin">
              <Signin />
            </Route>
            <Route path="/shop" exact>
              <Shop />
            </Route>
            <Route path="/single" exact>
              <Single />
            </Route>
            <Route path="/wishlist" exact>
              <WishList />
            </Route>
            <Route path="/cart" exact>
              <Cart />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Suspense>
        <HideComponentOnRoute route={['/dashboard', '/checkout']} >
          <Footer />
        </HideComponentOnRoute>
        <Defaults />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default () => (
  <RecoilRoot>
    <App />
  </RecoilRoot>
);
