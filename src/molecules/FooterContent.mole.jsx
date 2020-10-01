import React from 'react'
import { Typography, ListItem, ListItemText, List, makeStyles, Box } from '@material-ui/core'
import Keyvalue from './Keyvalue.mole';
import ControlledAccordion from './ControlledAccordion.mole';

const createStyles = makeStyles(theme => ({
    root: {

    },
    text: {
        color: theme.palette.text.secondary
    },
    dense: {
        paddingTop: 0,
        paddingBottom: 0
    },
    gutters: {
        paddingLeft: 0
    }
}))

export default function FooterContent({ title, content, keyValue }) {

    const classes = createStyles();

    return (
        <div className="">
            <Box display={{ xs: 'none', md: 'block' }}>
                <Typography variant="h6">
                    {title}
                </Typography>
                <List dense={true}>
                    {content.map((item, i) =>
                        <ListItem classes={{ dense: classes.dense, gutters: classes.gutters }} key={i}>
                            <ListItemText className={classes.text}>
                                {keyValue ? <Keyvalue items={item} /> : item}
                            </ListItemText>
                        </ListItem>
                    )}
                </List>
            </Box>

            <Box display={{ xs: 'block', md: 'none' }}>
                <ControlledAccordion title={title}>
                    <List dense={true}>
                        {content.map((item, i) =>
                            <ListItem classes={{ dense: classes.dense, gutters: classes.gutters }} key={i}>
                                <ListItemText className={classes.text}>
                                    {keyValue ? <Keyvalue items={item} /> : item}
                                </ListItemText>
                            </ListItem>
                        )}
                    </List>
                </ControlledAccordion>
            </Box>
        </div>
    )
}
