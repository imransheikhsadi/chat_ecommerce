import React from 'react'
import LinkGallaryItem from '../molecules/LinkGallaryItem.mole'
import { Grid } from '@material-ui/core'
import link_image from '../assets/link_image.jpg';
import link_long from '../assets/link_long.jpg';
import link_hori from '../assets/link_hori.jpg';

export default function LinkGallary() {
    return (
        <div style={{ margin: 15 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Grid container spacing={2} >
                        <Grid item xs={12} sm={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <LinkGallaryItem image={link_image} title="Women" link="women"/>
                                </Grid>
                                <Grid item xs={12}>
                                    <LinkGallaryItem image={link_image} title="Men" link="men" />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LinkGallaryItem image={link_long} title="Child" link="child" height={260*2 + 15} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <LinkGallaryItem image={link_image} title="Young" link="young" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LinkGallaryItem image={link_image} title="Old" link="old" />
                        </Grid>
                        <Grid item xs={12}>
                                <LinkGallaryItem image={link_hori} title="Men And Women" link="men and women" />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}
