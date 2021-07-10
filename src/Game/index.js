import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Typography, Tooltip, IconButton } from '@material-ui/core';
import socket from '../socket';
import NewDay from './NewDay';
import Intro from './Intro';
import Bars from './Bars';
import VoteArea from './VoteArea';
import Chat from './Chat';
import FloobImage from './FloobImage';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        lineHeight: 0,
        width: '100vw',
        height: '100vh',
    },

    aspectButton: {
        position: 'relative',
    },
}));

const getVote = floob => ({
    votingAllowed: floob.votingAllowed,
    type: floob.voteType,
    options: floob.options,
    votes: floob.votes,
    clothing: floob.clothing,
    voteTime: floob.voteTime,
    maxVoteTime: floob.maxVoteTime,
});

export default function Game(props) {
    const classes = useStyles();

    const [floob, setFloob] = React.useState(props.floob);
    const [dayScreen, setDayScreen] = React.useState(props.floob.day);
    const [day, setDay] = React.useState(0);
    const [clothing, setClothing] = React.useState(props.floob.clothing);
    const [vote, setVote] = React.useState(getVote(props.floob));
    const [aspectGuesses, setAspectGuesses] = React.useState(props.floob.aspectGuesses);

    React.useEffect(() => {
        socket.on('floobUpdate', floob => {
            floob = {...props.floob, ...floob};
            setFloob(floob);
            setDay(floob.day);
            setClothing(floob.clothing);
            setVote(getVote(floob));
        });

        socket.on('aspectGuesses', newAspectGuesses => setAspectGuesses(newAspectGuesses));

        socket.on('newDay', day => setDayScreen(day));

        return () => {
            socket.off('floobUpdate');
            socket.off('newDay');
        };
    }, []);

    return (
        <div className={classes.root}>
            <NewDay day={dayScreen} />
            <Intro />

            <Bars HP={floob.HP} maxHP={floob.maxHP} originalMaxHP={floob.originalMaxHP} happiness={floob.happiness} />
            <VoteArea vote={vote} aspectGuesses={aspectGuesses} />
            <Chat messages={props.floob.messages} />

            <FloobImage name={props.floob.name} age={day - 1} clothing={clothing} />
        </div>
    );
};