import React, { lazy, Suspense, useEffect } from 'react';
import { ThemeProvider, CssBaseline, unstable_createMuiStrictModeTheme, Backdrop, CircularProgress } from '@material-ui/core';
import Home from './pages/Home.page';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './components/Header.component';
import Cart from './pages/Cart.page';
import { propertyState, tokenState } from './recoil/atoms';
import { purple } from '@material-ui/core/colors';
import HideComponentOnRoute from './molecules/HideComponentOnRoute.mole';
import { catchAsync, checkStatus } from './utils';
import { checkUser } from './request/user.requset';
import { userState } from './recoil/user/user.atoms';
import Defaults from './components/Defaults.component';
import PasswordReset from './pages/PasswordReset.page';
import { getSiteProperties } from './request/other.request';
import Chat from './pages/Chat.page';
import About from './pages/About.page';

const Dashboard = lazy(() => import('./pages/Dashboard.page'));
const Checkout = lazy(() => import('./pages/Checkout.page'));
const Shop = lazy(() => import('./pages/Shop.page'));
const Signin = lazy(() => import('./pages/Signin.page'));
const Signup = lazy(() => import('./pages/Signup.page'));
const Single = lazy(() => import('./pages/Single.page'));


const theme = unstable_createMuiStrictModeTheme({
  palette: {
    type: 'light',
    primary: {
      main: purple[900]
    }
  }
});

function App() {

  const setUser = useSetRecoilState(userState);
  const setProperty = useSetRecoilState(propertyState);
  const setToken = useSetRecoilState(tokenState);

  


  useEffect(() => {
    const checkMe = catchAsync(async () => {
      const response = await checkUser();
      const siteRes = await getSiteProperties();
      if (checkStatus(siteRes)) {
        setProperty(siteRes.data.siteProperties)
      }
      if (checkStatus(response)) {
        setUser(response.data.user);
        setToken(response.data.token);
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
            <Route path="/cart" exact>
              <Cart />
            </Route>
            <Route path="/chat" exact>
              <Chat />
            </Route>
            <Route path="/about us" exact>
              <About />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Suspense>
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
