import React from 'react';
import { Paper, Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AspectGuessingTable from './Game/VoteArea/AspectGuessingTable';

const useStyles = makeStyles((theme) => ({
    paper: {
        textAlign: 'center',
        margin: 15,
    },

    aspectGuessesContainer: {
        height: 400,
        borderTop: '1px solid lightgrey',
        overflowY: 'scroll',
    },
}));

export default function DeathScreen(props) {
    let classes = useStyles();

    return (
        <div>
            <Paper elevation={3} className={classes.paper}>
                <Typography variant="h4">R.I.P. {props.floob.name}</Typography>
                <Typography>Died at {props.floob.day - 1} day{props.floob.day - 1 == 1 ? '' : 's'} old.</Typography>

                <Divider />

                <Typography variant="h6">Opinions</Typography>

                <div className={classes.aspectGuessesContainer}>
                    <AspectGuessingTable aspectGuesses={props.floob.aspectGuesses} opinions={props.floob.opinions} />
                </div>
            </Paper>

            <Divider style={{marginBottom: 15}} />
        </div>
    );
}