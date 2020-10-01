import React from 'react'
import { Container, Typography, makeStyles, Grid, Box } from '@material-ui/core'
import Subscribe from '../molecules/Subscribe.mole';
import FooterContent from '../molecules/FooterContent.mole';
import paypal from '../assets/paypal-logo.svg'


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
            width: 80,
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
            {/* <Box display={{ xs: 'none', md: 'block' }}>
                <Subscribe />
            </Box> */}
            <div className="">
                <Container maxWidth="lg">
                    {/* <Grid container className={classes.content}>
                        <Grid item xs={12} className={classes.mobileSub}>
                            <Subscribe />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <FooterContent title="Catagories" content={['Women', 'Men', 'Child']} />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <FooterContent title="BUY WITH US" content={['About Us', 'Contact US', 'Privacy Policy']} />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <FooterContent title="About" content={['There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour']} />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <FooterContent title="Contacts" content={[{
                                Address: '---',
                                Phone: '---',
                                hours: '---',
                                'E-MAIL': <Typography component="span" color="primary">imran.shaikh.dev@gmail.com</Typography>
                            }]} keyValue={true} />
                        </Grid>
                    </Grid> */}
                    <div className={classes.copyRight}>
                        <div className="">
                            {/* <img src={logo} alt="" /> */}
                            <Typography color="textSecondary" component="span" style={{ paddingLeft: 20 }}>
                                © NO-One 2020. All Rights Reserved
                            </Typography>
                        </div>
                        <div className={classes.payment}>
                            <img src={paypal} alt="" />
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    )
}
