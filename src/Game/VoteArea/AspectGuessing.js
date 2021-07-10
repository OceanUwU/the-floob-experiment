import React from 'react';
import { IconButton, Dialog, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AspectGuessingTable from './AspectGuessingTable';

export default function AspectGuessing(props) {
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    return (
        <div>
            <IconButton onClick={handleClickOpen}><AssessmentIcon /></IconButton>

            <Dialog onClose={handleClose} open={open} style={{zIndex: 13000}}>
                <DialogTitle>Opinion guessing</DialogTitle>
                <DialogContent>
                    <Typography variant="caption" align="center">Anyone can edit this.</Typography>

                    <AspectGuessingTable aspectGuesses={props.aspectGuesses} editable />
                </DialogContent>

            </Dialog>
        </div>
    );
};