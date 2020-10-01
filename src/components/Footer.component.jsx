import React from 'react'
import { Container, Typography, makeStyles, Grid, Box } from '@material-ui/core'
import Subscribe from '../molecules/Subscribe.mole';
import FooterContent from '../molecules/FooterContent.mole';
import logo from '../assets/logo.png'


const createStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 0'
    },
    content: {
        // display: 'flex',
        // justifyContent: 'space-between',
        marginTop: theme.spacing(6),
        // maxWidth: '100%',
        // '& > *': {
        // flexGrow: 1
        // }
    },
    copyRight: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            marginTop: 20,
            // marginBottom: 40,
            '& > :first-child': {
                '& > *': {
                    display: 'block',
                    textAlign: "center",
                    margin: 'auto',
                    paddingBottom: 10
                }
            }
        },

    },
    payment: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        '& > *': {
            width: 40,
            height: 'auto',
            padding: 5
        }
    },
    mobileSub: {
        [theme.breakpoints.up('md')]: {
            display: 'none'
        }
    }
}))

export default function Footer() {

    const classes = createStyles();

    return (
        <div className="">
            <Box display={{ xs: 'none', md: 'block' }}>
                <Subscribe />
            </Box>
            <div className="">
                <Container maxWidth="lg">
                    <Grid container className={classes.content}>
                        <Grid item xs={12} className={classes.mobileSub}>
                            <Subscribe />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <FooterContent title="Catagories" content={['Women', 'Men', 'Child']} />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <FooterContent title="BUY WITH US" content={['About Us', 'Services', 'Contact US', 'Faqs', 'Privacy Policy', 'Cookie Policy', 'Terms and Conditions']} />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <FooterContent title="About" content={['Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat tempor incididunt. ']} />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <FooterContent title="Contacts" content={[{
                                Address: '7895 Piermont Dr NE Albuquerque, NM 198866, United States of America',
                                Phone: '+566 4774 9930; +566 4774 9940',
                                hours: 'all week from 9 am to 9 pm',
                                'E-MAIL': <Typography component="span" color="primary">info@mydomain.com</Typography>
                            }]} keyValue={true} />
                        </Grid>
                    </Grid>
                    <div className={classes.copyRight}>
                        <div className="">
                            <img src={logo} alt="" />
                            <Typography color="textSecondary" component="span" style={{ paddingLeft: 20 }}>
                                © Wokiee 2020. All Rights Reserved
                            </Typography>
                        </div>
                        <div className={classes.payment}>
                            <img src="https://cdn.shopify.com/s/files/1/0130/5041/3114/files/Stripe_x42.png" alt="" />
                            <img src="https://cdn.shopify.com/s/files/1/0130/5041/3114/files/shopify_x42.png" alt="" />
                            <img src="https://cdn.shopify.com/s/files/1/0130/5041/3114/files/AES256_x42.png" alt="" />
                            <img src="https://cdn.shopify.com/s/files/1/0130/5041/3114/files/paypal_2_x42.png" alt="" />
                            <img src="https://cdn.shopify.com/s/files/1/0130/5041/3114/files/visa_x42.png" alt="" />
                            <img src="https://cdn.shopify.com/s/files/1/0130/5041/3114/files/mastercard_x42.png" alt="" />
                            <img src="https://cdn.shopify.com/s/files/1/0130/5041/3114/files/discover_x42.png" alt="" />
                            <img src="https://cdn.shopify.com/s/files/1/0130/5041/3114/files/american-express_x42.png" alt="" />
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    )
}
