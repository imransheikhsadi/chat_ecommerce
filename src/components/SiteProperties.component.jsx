import { Box, Button, ButtonGroup, Container, fade, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, TextField, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { catchAsync, checkStatus } from '../utils';
import { getSiteProperties, updateSiteProperties } from '../request/other.request';
import { useIsInit } from '../customHooks';

const createStyles = makeStyles(theme => ({
    item: {
        backgroundColor: fade(theme.palette.text.secondary, .1),
        marginBottom: 2
    }
}))

export default function SiteProperties() {

    const classes = createStyles()
    const [catagories, setCatagories] = useState([]);
    const [catagory, setCatagory] = useState();
    const isInit = useIsInit()


    useEffect(() => {
        catchAsync(async () => {
            const response = await getSiteProperties();
            if (checkStatus(response)) {
                setCatagories(response.data.siteProperties.catagories)
            }
        })()
    }, [])

    useEffect(() => {
        if (!isInit) {
            catchAsync(async () => {
                await updateSiteProperties({ catagories });
            })()
        }
    }, [catagories])
   

  

   
   


    const handleCatagory = (e) => {
        setCatagory(e.currentTarget.value.toLowerCase());
    }

    const handleCatagories = () => {
        if (catagory && catagory !== '') {
            setCatagory('')
            setCatagories([...catagories.filter(val => val !== catagory), catagory])
        }
    }

    const handleCatagoryRemove = (name) => {
        setCatagories(catagories.filter(val => name !== val))
    }

    return (
        <div>
            <Box my={3}>
                <Typography variant="h4" align="center">
                    Site Properties
                </Typography>
            </Box>
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Typography variant="h5">
                            Catagories
                        </Typography>
                        <List>
                            {catagories.map((name, i) =>
                                <ListItem key={i} className={classes.item}>
                                    <ListItemText primary={name.toUpperCase()} />
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={() => handleCatagoryRemove(name)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )}
                        </List>
                        <Box>
                            <ButtonGroup>
                                <Box flexGrow={1}>
                                    <TextField placeholder="Add a catagory" onChange={handleCatagory} value={catagory} size="small" variant="outlined" />
                                </Box>
                                <Button onClick={handleCatagories} variant="outlined">
                                    <AddIcon />
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}
