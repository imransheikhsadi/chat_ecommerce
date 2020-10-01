import React, { useState } from 'react'
import { Accordion, AccordionSummary, Typography, AccordionDetails } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

export default function ControlledAccordion({children,title}) {

    const [expandable, setExpandable] = useState(true);


    return (
        <Accordion  expanded={!expandable} onChange={() => setExpandable(!expandable)}>
            <AccordionSummary
                expandIcon={expandable ? <AddIcon /> : <RemoveIcon />}
            >
                <Typography variant="h6">
                    {title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    )
}
