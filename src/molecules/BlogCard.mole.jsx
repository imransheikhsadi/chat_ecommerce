import React from 'react'
import { Card, CardActionArea, CardMedia, CardContent, Typography, Box, Button, Link, makeStyles } from '@material-ui/core'
import CommentIcon from '@material-ui/icons/Comment';

const createStyles = makeStyles(theme => ({
    content: {
        width: "80%",
        backgroundColor: theme.palette.background.default,
        transform: props=>props.horizontal ? 'translateY(0)': 'translateY(-90px)',
        margin: 'auto',
        padding: 20,
        borderRadius: 5,
        textAlign: 'center',
        transition: 'all 300ms',
        zIndex: 4,
        '&:before': {
            content: `''`,
            position: 'absolute',
            zIndex: -1,
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            backgroundColor: theme.palette.background.default,
            borderRadius: 5,
            transition: 'all 300ms',

           
        },
        '&:hover': {
            '&:before': {
                transform: 'scale(1.1)'
            }
        }
    },
    footer: {
        fontSize: 14,
        marginBottom: -30,
        marginTop: 20
    }
}))

export default function BlogCard({ image,horizontal }) {

    const classes = createStyles({horizontal});

    return (
        <Card style={horizontal&& {display: 'flex'}}>
            <CardActionArea>
                <CardMedia component="img" src={image} />
            </CardActionArea>
            <CardContent style={{ position: 'relative', marginBottom: -90 }}>
                <Box className={classes.content} >
                    <Typography component="div">
                        <Box >
                            <Button color="primary">LaDIES</Button>
                            <Button color="primary">SECTIONS</Button>
                            <Button color="primary">PROMO</Button>
                        </Box>
                        <Box>
                            <Button style={{ textTransform: 'initial', fontSize: 18, fontWeight: 'bold' }}>Count Down Tome Zone</Button>
                        </Box>
                    </Typography>
                    <Typography color="textSecondary" style={{ fontSize: 14 }}>
                        It is a long established fact that by the readable content of a page when looking at its layout.
                    </Typography >
                    <Typography className={classes.footer} color="textSecondary"> by
                        <Link color="textPrimary"> Diego Lopez </Link>
                        on June 20, 2018
                        <Link color="textPrimary">
                            <CommentIcon style={{margin: 'auto 2px -4px 6px',fontSize: 16}}/> 6
                        </Link>
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}
