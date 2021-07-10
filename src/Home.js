import React from 'react';
import { Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        textAlign: 'center',
    },

    content: {
        maxWidth: 500,
        margin: 'auto',
    },

    floob: {
        margin: -50,
        width: 300
    }
}));

export default function Home() {
    let classes = useStyles();

    return (
        <div className={classes.root}>
            <Divider style={{marginTop: 20}} />
            
            <Typography variant="h2">The Floob Experiment</Typography>
            <div className={classes.content}>
                <Typography>Floobs were a failed attempt to create a synthetic pet. They were never fully understood.</Typography>
                <img src="/img/floob.png" className={classes.floob} />
                <Typography>Say hi to Floob, because you're gonna be stuck with them for a while.</Typography>
                <img src="/img/places/icons/kitchen.png" width={200} />
                <Typography>Your goal is to work out what your Floob likes and dislikes in order to prevent them from dying of happiness withdrawal. To figure out what they like, you'll be taking your Floob places, dressing them up, giving them toys, feeding them, and performing research on them.</Typography>
                <img src="/img/jacketfloob.png" width={200} />
                <Typography>Work together to understand Floob! Bring others along for the ride, and you can all vote on what to do to Floob.</Typography>
            </div>
        </div>
    );
}